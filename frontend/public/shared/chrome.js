
function mountKoodhLogo(el,opts){
  opts=opts||{};var u="k"+Math.random().toString(36).slice(2,7);
  /* Exacte geometrie, gemeten op het originele logo */
  var TIP=[74.6,47.94],TOP=[[91.95,30.476],[98.589,30.476],[77.733,47.939],[71.467,47.939]],BOT=[[71.467,47.939],[77.733,47.939],[102.696,72.502],[96.441,72.502]];
  var ARC="M305.624 43.916C312.235 26.254 339.171 26.927 336.88 47.037V72.5";
  var items=[
    ["kt",'<polygon class="kt" fill="#fff"/>','<path class="mkt" d="M78.2 44.9L101.5 25.3" stroke-width="12"/>',0,.6,-1],
    ["kb",'<polygon class="kb" fill="#fff"/>','<path class="mkb" d="M78.2 51L105.5 78.8" stroke-width="12"/>',.03,.63,-1],
    ["o1",'<ellipse cx="141.254" cy="51.644" rx="20.821" ry="20.381" stroke="#fff" stroke-width="4.437" fill="none"/>','<ellipse cx="141.254" cy="51.644" rx="20.821" ry="20.381" transform="rotate(180 141.254 51.644)" stroke-width="10"/>',1.75,2.4,0],
    ["o2",'<ellipse cx="201.225" cy="51.644" rx="20.818" ry="20.385" stroke="#fff" stroke-width="4.43" fill="none"/>','<ellipse cx="201.225" cy="51.644" rx="20.818" ry="20.385" transform="rotate(180 201.225 51.644)" stroke-width="10"/>',1.86,2.51,1],
    ["d1",'<ellipse cx="259.309" cy="51.64" rx="19.846" ry="20.341" stroke="#fff" stroke-width="4.272" fill="none"/>','<ellipse cx="259.309" cy="51.64" rx="19.846" ry="20.341" transform="rotate(180 259.309 51.64)" stroke-width="10"/>',1.97,2.62,2],
    ["d2",'<rect x="277.236" y="11.745" width="4.257" height="60.772" fill="#fff"/>','<path d="M279.364 6V78" stroke-width="10"/>',2.12,2.6,2],
    ["h1",'<rect x="303.504" y="11.748" width="4.241" height="60.752" fill="#fff"/>','<path d="M305.624 6V78" stroke-width="10"/>',2.2,2.62,3],
    ["h2",'<path d="'+ARC+'" stroke="#fff" stroke-width="4.291" fill="none"/>','<path d="'+ARC+'V78" stroke-width="10"/>',2.32,2.85,3]
  ];
  /* Code-laag: getypte tekens die zich oplossen in de letters */
  var SLOT=[141.25,201.2,259.3,320.6],TGT="oodh",GLY="</>{}[];=*#01x$&%",SA=[1.05,1.16,1.27,1.38],SS=[1.45,1.55,1.65,1.75],SF=[1.75,1.86,1.97,2.2];
  var code=SLOT.map(function(x,i){return'<text class="c'+i+'" x="'+x+'" y="72.5" text-anchor="middle" fill="#fff" style="font:500 62px \'JetBrains Mono\',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace"></text>'}).join("");
  var defs="",body="";
  items.forEach(function(it){
    var m=it[2].replace(/ class="\w+"/,"").replace(/^<(\w+)/,'<$1 class="m" pathLength="1" fill="none" stroke="#fff"');
    defs+='<mask id="'+u+it[0]+'" maskUnits="userSpaceOnUse" x="40" y="-20" width="340" height="130">'+m+'</mask>';
    body+='<g class="g'+it[0]+'" mask="url(#'+u+it[0]+')">'+it[1]+'</g>';
  });
  el.innerHTML='<svg viewBox="64 4 282 76" width="100%" role="img" aria-label="koodh" style="display:block;overflow:visible"><defs>'+defs+'</defs>'+body+code+'<rect class="cur" x="0" y="19" width="3.4" height="57" fill="#fff"/></svg>';
  var parts=items.map(function(it){var g=el.querySelector(".g"+it[0]);return{g:g,m:el.querySelector("#"+u+it[0]+" .m"),id:"url(#"+u+it[0]+")",a:it[3],b:it[4],i:it[5]}});
  var cs=SLOT.map(function(x,i){return el.querySelector(".c"+i)}),cur=el.querySelector(".cur");
  var kt=el.querySelector(".kt"),kb=el.querySelector(".kb");
  var clamp=function(t){return t<0?0:t>1?1:t},seg=function(t,a,b){return clamp((t-a)/(b-a))},
    expo=function(t){return t>=1?1:1-Math.pow(2,-10*t)},quint=function(t){return 1-Math.pow(1-t,5)},
    io=function(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2},
    spring=function(t){return t<=0?0:1-Math.exp(-5.4*t)*Math.cos(15.4*t)};
  function rot(p,a){var s=Math.sin(a),c=Math.cos(a),x=p[0]-TIP[0],y=p[1]-TIP[1];return[TIP[0]+x*c-y*s,TIP[1]+x*s+y*c]}
  function pts(P,a,dx){return P.map(function(p){p=rot(p,a);return(p[0]+dx).toFixed(3)+","+p[1].toFixed(3)}).join(" ")}
  var speed=opts.speed||1,start=null,biteAt=-9,raf=0,done=false,DUR=3.6;
  function bite(t){var v=t-biteAt;if(v<0)return 0;if(v<.2)return .26*quint(v/.2);return .26*(1-spring(v-.2))}
  function draw(t){
    var o=bite(t),slide=(1-quint(seg(t,0,.8)))*7;
    kt.setAttribute("points",pts(TOP,-o,0));kb.setAttribute("points",pts(BOT,o,0));
    parts.forEach(function(p){
      var v=p.i<0?expo(seg(t,p.a,p.b)):io(seg(t,p.a,p.b));
      if(p.i<0)v=v>0?.12+.88*v:0;
      if(v>=1){p.g.removeAttribute("mask")}else{p.g.setAttribute("mask",p.id);p.m.style.strokeDasharray="1 1";p.m.style.strokeDashoffset=1-v}
      p.g.style.opacity=v>0?1:0;
      var tr=p.i<0?slide:(1-quint(seg(t,p.a-.1,p.b+.25)))*(2+p.i*1.5);
      p.g.style.transform="translateX("+tr.toFixed(3)+"px)";
    });
    /* getypte code */
    var typed=0;
    cs.forEach(function(c,i){
      if(t<SA[i]){c.style.opacity=0;return}typed++;
      var ch=t<SS[i]?GLY.charAt((Math.floor(t/.045)*7+i*5)%GLY.length):TGT.charAt(i);
      if(c.textContent!==ch)c.textContent=ch;
      var f=seg(t,SF[i],SF[i]+.38);
      c.style.opacity=(.85*(1-f)).toFixed(3);c.style.transform="translateY("+(-4*quint(f)).toFixed(2)+"px)";
    });
    /* cursor: knippert, springt mee met het typen en verdwijnt */
    var cx=typed?SLOT[typed-1]+31:113.5,typing=t>=SA[0]&&t<SS[3];
    var blink=typing?1:(Math.floor((t-.55)/.27)%2===0?1:0);
    cur.setAttribute("x",cx.toFixed(2));
    cur.style.opacity=t<.55?0:(blink*(1-seg(t,2.85,3.05))).toFixed(3);
  }
  function tick(now){
    if(start===null)start=now;var t=(now-start)/1000*speed;
    draw(t);
    if(t<DUR||t<biteAt+1.6){raf=requestAnimationFrame(tick)}else{done=true;raf=0}
  }
  var reduce=window.matchMedia&&matchMedia("(prefers-reduced-motion: reduce)").matches;
  function play(){cancelAnimationFrame(raf);done=false;start=null;biteAt=3.12;raf=requestAnimationFrame(tick)}
  function hap(){if(reduce||!done)return;start=performance.now()-DUR*1000/speed;biteAt=DUR;done=false;raf=requestAnimationFrame(tick)}
  if(reduce){draw(99);done=true}
  else if("IntersectionObserver" in window&&!opts.autoplay){draw(-1);var ob=new IntersectionObserver(function(e){if(e[0].isIntersecting){ob.disconnect();play()}},{threshold:.4});ob.observe(el)}
  else{draw(-1);play()}
  el.addEventListener("pointerenter",hap);
  return{bite:hap,replay:function(){if(reduce)return;play()},setSpeed:function(s){speed=s}};
}

(function(){
  var logo=mountKoodhLogo(document.getElementById("navlogo"),{autoplay:true});
  var mark=document.getElementById("mark"),beat=0;
  setInterval(function(){if(document.hidden)return;beat++;
    if(mark.classList.contains("compact")){(beat%2?logo.bite:logo.replay)()}else logo.replay();
  },9000);
  var still=matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.koodhMagnetics=function(){
    if(!matchMedia("(hover:hover)").matches||still)return;
    document.querySelectorAll(".btn,.sc .visit").forEach(function(b){
      if(b.__mag)return;b.__mag=1;
      b.addEventListener("pointermove",function(e){var r=b.getBoundingClientRect();b.style.setProperty("--mx",((e.clientX-r.left-r.width/2)*.18).toFixed(1)+"px");b.style.setProperty("--my",((e.clientY-r.top-r.height/2)*.3).toFixed(1)+"px")});
      b.addEventListener("pointerleave",function(){b.style.setProperty("--mx","0px");b.style.setProperty("--my","0px")});
    });
  };
  window.koodhMagnetics();
  const BEAK='<svg viewBox="66 26 42 51" width="9"><polygon fill="#fff" points="91.95,30.476 98.589,30.476 77.733,47.939 102.696,72.502 96.441,72.502 71.467,47.939"/></svg>';
  const T=[
    w=>`<div class="t"><i></i>deploy.ts</div><code><b>await</b> koodh.<em>deploy</em>({
  env: <em>"production"</em>
});
<b>const</b> site = build(brand);</code>`,
    w=>`<div class="t"><i></i>Traffic</div><div class="bars">${[30,52,40,70,58,84,66,92].map(h=>`<span style="height:${h}%"></span>`).join("")}</div>`,
    w=>`<div class="t"><i></i>Microsoft 365</div><div class="row"><span class="av"></span><div style="flex:1"><div class="ln" style="width:80%"></div><div class="ln" style="width:55%"></div></div></div><div class="ln" style="width:90%;margin-top:10px"></div>`,
    w=>`<div class="t"><i></i>Wi-Fi · Office</div><div class="row"><svg viewBox="0 0 24 24" width="22" fill="none" stroke="#fff" stroke-width="1.8" stroke-linecap="round"><path d="M2.5 9a14 14 0 0 1 19 0M5.5 12.3a9.5 9.5 0 0 1 13 0M8.6 15.5a5 5 0 0 1 6.8 0"/></svg><div style="flex:1"><div class="ln" style="width:70%"></div><div class="ln" style="width:40%"></div></div></div>`,
    w=>`<div class="t"><i></i>AI assistant</div><div class="ln" style="width:60%"></div><div class="ln" style="width:85%;background:rgba(201,214,250,.6)"></div><div class="ln" style="width:72%;background:rgba(201,214,250,.6)"></div>`,
    w=>`<div class="row" style="margin-bottom:8px">${BEAK}<b style="font-size:12px;letter-spacing:.02em">koodh</b></div><div class="ln" style="width:70%"></div><div class="ln" style="width:45%"></div>`,
    w=>`<div class="ln" style="width:85%"></div><div class="ln" style="width:65%"></div><div class="ln" style="width:75%"></div><div class="ln" style="width:40%"></div>`,
    w=>`<div class="t"><i></i>network.cfg</div><code>ssid <em>"Office"</em> band 5GHz
vlan 10 name <em>"Staff"</em>
<b>@</b> 6/6 access points up</code>`
  ];
  function mountTunnel(el,o){
    o=Object.assign({n:30,depth:2600,speed:120},o||{});
    const scene=document.createElement("div");scene.className="tn-scene";el.appendChild(scene);
    let seed=o.seed||7;const R=()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296;
    let W=el.clientWidth,H=el.clientHeight;
    const ps=[];
    function place(p,z){
      const a=R()*Math.PI*2,r=.55+R()*.6;
      p.x=Math.cos(a)*r*Math.max(W,600)*.62;p.y=Math.sin(a)*r*Math.max(H,500)*.62;
      p.ry=-Math.cos(a)*28;p.rx=Math.sin(a)*18;p.z=z;
    }
    for(let i=0;i<o.n;i++){
      const d=document.createElement("div"),k=i%T.length,w=150+Math.round(R()*170);
      d.className="tn-p"+(R()<.18?" solid":"");d.style.width=w+"px";d.innerHTML=T[k](w);scene.appendChild(d);
      const p={el:d};place(p,-o.depth*(i/o.n));ps.push(p);
    }
    let boost=0,mx=0,my=0,cx=0,cy=0,last=performance.now(),vis=true,raf=0;
    el.parentElement.addEventListener("pointermove",e=>{const r=el.getBoundingClientRect();mx=(e.clientX-r.left)/r.width-.5;my=(e.clientY-r.top)/r.height-.5},{passive:true});
    function frame(now){
      const dt=Math.min(.05,(now-last)/1000);last=now;
      cx+=(mx-cx)*.05;cy+=(my-cy)*.05;
      el.style.perspectiveOrigin=(50+cx*18)+"% "+(50+cy*18)+"%";
      const v=(o.speed+boost)*(still?0:1);
      for(const p of ps){
        p.z+=v*dt;if(p.z>260){place(p,p.z-o.depth-260)}
        const f=Math.pow(Math.min(1,Math.max(0,(p.z+o.depth)/(o.depth*.7))),2.2)*Math.max(0,Math.min(1,(260-p.z)/320));
        p.el.style.opacity=f.toFixed(3);
        p.el.style.transform=`translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,${p.z.toFixed(1)}px) translate(-50%,-50%) rotateY(${p.ry.toFixed(1)}deg) rotateX(${p.rx.toFixed(1)}deg)`;
      }
      if(vis)raf=requestAnimationFrame(frame);
    }
    if(window.IntersectionObserver)new IntersectionObserver(es=>{const v=es[0].isIntersecting;if(v&&!vis){vis=true;last=performance.now();raf=requestAnimationFrame(frame)}else vis=v}).observe(el);
    addEventListener("resize",()=>{W=el.clientWidth;H=el.clientHeight});
    raf=requestAnimationFrame(frame);
    return{set boost(b){boost=b}};
  }
  document.querySelectorAll(".tunnel").forEach(function(el){mountTunnel(el,{n:22,seed:29,speed:90})});
  var ticking=false;
  function upd(){mark.classList.toggle("compact",scrollY>40);ticking=false}
  addEventListener("scroll",function(){if(!ticking){ticking=true;requestAnimationFrame(upd)}},{passive:true});upd();
})();
