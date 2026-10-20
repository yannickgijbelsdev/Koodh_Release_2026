from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
from datetime import datetime, timezone
import time

import httpx
from fastapi.responses import JSONResponse


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

NEWS_API_BASE = "https://clr.koodh.com/api/news"
NEWS_CACHE_TTL = 60
_news_cache = {}


async def _fetch_news(path):
    now = time.time()
    cached = _news_cache.get(path)
    if cached and now - cached[0] < NEWS_CACHE_TTL:
        return cached[1]
    async with httpx.AsyncClient(timeout=15) as http:
        resp = await http.get(f"{NEWS_API_BASE}/{path}")
        resp.raise_for_status()
        data = resp.json()
    _news_cache[path] = (now, data)
    return data


@api_router.get("/news")
async def get_news():
    try:
        return await _fetch_news("koodh/koodh")
    except Exception:
        logger.exception("news list fetch failed")
        return JSONResponse({"error": "News unavailable"}, status_code=502)


@api_router.get("/news/articles/{article_id}")
async def get_news_article(article_id: str):
    try:
        return await _fetch_news(f"articles/{article_id}")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 404:
            return JSONResponse({"error": "Article not found"}, status_code=404)
        logger.exception("news article fetch failed")
        return JSONResponse({"error": "News unavailable"}, status_code=502)
    except Exception:
        logger.exception("news article fetch failed")
        return JSONResponse({"error": "News unavailable"}, status_code=502)


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()