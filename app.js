'use strict';
/* RodApp · lógica y pantallas del prototipo */
const lvOf=x=>{let l=0;LV.forEach((v,i)=>{if(x>=v)l=i});return l};
function xpInfo(x){const l=lvOf(x),a=LV[l],b=LV[l+1];return{l,name:LVN[l],b,pct:b?Math.round((x-a)/(b-a)*100):100,left:b?b-x:0}}
const xpOfN=n=>n==='Tú'?S.xp:80+(hash(n)*53)%1400;
const lchip=n=>`<span class="lchip">Nv. ${lvOf(xpOfN(n))+1}</span>`;
const badgesOf=n=>n==='Tú'?S.badges:BADGES.filter((_,j)=>(hash(n)>>j)%3===0).slice(0,5).map(b=>b.k);
const badgeSVG=(b,on,s=64)=>`<svg width="${s}" height="${s}" viewBox="0 0 64 64" role="img" aria-label="Insignia ${b.n}"><path d="M32 4l24 14v28L32 60 8 46V18z" fill="${on?b.c:'#1B2520'}" stroke="${on?'rgba(255,255,255,.35)':'#33423A'}" stroke-width="2" stroke-linejoin="round"/><g transform="translate(20 20)" fill="none" stroke="${on?'#fff':'#5B6B63'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${on?b.g:IC.lock}</g></svg>`;
function awardRide(){const r=S.sel;if(!r||S.award)return;
 const b=BADGES.find(x=>x.k===r.lugar&&r.km>=x.km&&!S.badges.includes(x.k));
 const xp=b?XP_INSIGNIA:XP_RODADA,l0=lvOf(S.xp);S.xp+=xp;S.rodadas++;if(b)S.badges.push(b.k);
 S.award={xp,b,up:lvOf(S.xp)>l0}}
function awardHTML(){const a=S.award;if(!a)return '';const i=xpInfo(S.xp);
 return `<div class="xp">${a.b?`<div style="display:flex;align-items:center;gap:14px">${badgeSVG(a.b,true,64)}<div><b style="font-size:17px">¡Insignia de ${a.b.n}!</b><span class="small" style="display:block">Rodaste ${a.b.km} km o más hasta allá.</span></div></div>`:''}<div style="display:flex;justify-content:space-between;align-items:baseline"><b style="font-size:17px">+${a.xp} XP</b><span class="small">${a.up?'¡Subiste al nivel '+(i.l+1)+'!':'Nivel '+(i.l+1)+' · '+i.name}</span></div><div class="meter"><i style="width:${i.pct}%"></i></div></div>`}

/* ================= estado ================= */
const S={};
function fresh(){
  Object.assign(S,{
   screen:'splash',tourOffer:false,user:null,verified:false,rides:seed(),sel:null,tab:'home',
   login:{email:'camilo@rodapp.co',pass:'123456'},
   reg:{nombre:'',correo:'',pass:'',exp:null,disp:[]},
   kyc:{step:0,front:'idle',back:'idle',selfie:'idle',failedOnce:false,msg:''},
   veh:{cc:null,tipo:null,marca:'',placa:'',bt:false},
   f:{cc:null,zona:null,fecha:null},
   cr:{nombre:'',ruta:null,cc:null,zona:null,nivel:'Intermedio',fecha:null,hora:null,cupo:8,punto:null},
   errs:{},lobby:null,run:null,rate:{},demo:{sound:true,fail:false},micOk:true,
   tryPrev:null,xp:900,rodadas:12,badges:['bog','vvc'],award:null,zonaMia:'Norte',com:{vista:'tu',tema:null,gfilter:null,grupos:['norte'],conf:{},posts:comSeed(),liked:{},gusta:{},open:null,draft:{tema:null,txt:'',video:false},err:false}
  });
}
fresh();
let ST=[];
const clearST=()=>{ST.forEach(t=>{clearTimeout(t);clearInterval(t)});ST=[]};
const later=(f,ms)=>{const t=setTimeout(f,ms);ST.push(t);return t};
const every=(f,ms)=>{const t=setInterval(f,ms);ST.push(t);return t};
const $=s=>document.querySelector(s);
const esc=s=>String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const first=n=>String(n||'').split(' ')[0];
const ini=n=>String(n).replace('Tú','Tú').split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
const hash=s=>[...String(s)].reduce((a,c)=>a+c.charCodeAt(0),0);
const pad=n=>String(n).padStart(2,'0');
const fmtT=sec=>{sec=Math.max(0,Math.floor(sec));return pad(Math.floor(sec/3600))+':'+pad(Math.floor(sec%3600/60))+':'+pad(sec%60)};

/* ================= iconos ================= */
const IC={
 back:'<path d="M15 5l-7 7 7 7"/>',chev:'<path d="M9 5l7 7-7 7"/>',down:'<path d="M6 9l6 6 6-6"/>',check:'<path d="M5 13l4 4L19 7"/>',plus:'<path d="M12 5v14M5 12h14"/>',close:'<path d="M6 6l12 12M18 6L6 18"/>',
 home:'<path d="M4 11l8-7 8 7v9a1 1 0 0 1-1 1h-4v-6h-6v6H5a1 1 0 0 1-1-1z"/>',
 cal:'<rect x="4" y="5" width="16" height="16" rx="2"/><path d="M16 3v4M8 3v4M4 10h16"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/>',
 pin:'<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
 micoff:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M3 3l18 18"/>',
 warn:'<path d="M12 3l10 18H2z"/><path d="M12 10v5M12 18v.5"/>',
 wrench:'<path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.7 2.7-2.6-.6-.6-2.6z"/>',
 fuel:'<path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16M3 21h14M7 8h6M15 9h2a2 2 0 0 1 2 2v5a1.5 1.5 0 0 0 3 0V9l-3-3"/>',
 cam:'<path d="M4 8h3l2-3h6l2 3h3v12H4z"/><circle cx="12" cy="13" r="3.5"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z" fill="currentColor"/>',
 send:'<path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/>',
 bt:'<path d="M7 7l10 10-5 5V2l5 5L7 17"/>',
 people:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.5 3-5 6-5s6 1.5 6 5"/><circle cx="17" cy="9" r="2.5"/><path d="M17 14c3 0 4.5 1.5 4.5 4"/>',
 route:'<circle cx="6" cy="18" r="2"/><circle cx="18" cy="6" r="2"/><path d="M8 18h6a3 3 0 0 0 0-6h-4a3 3 0 0 1 0-6h6"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M8.5 12l2.5 2.5L16 9.5"/>',
 gauge:'<path d="M4 18a8 8 0 1 1 16 0M12 18l4-6"/>',
 flag:'<path d="M6 21V4M6 5h11l-2 4 2 4H6"/>',
 engine:'<path d="M4 9h3l2-2h6v3h2l2 2v4h-3l-2 2H8l-2-2H4z"/>',
 share:'<path d="M12 15V3M8 7l4-4 4 4M5 12v8h14v-8"/>',
 sliders:'<path d="M4 7h9M17 7h3M4 17h3M11 17h9"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
 id:'<rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="9" cy="11" r="2"/><path d="M6 16c.5-1.5 1.7-2 3-2s2.5.5 3 2M14 10h4M14 13h3"/>'
};
Object.assign(IC,{
  heart:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  heartf:'<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.4A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" fill="currentColor"/>',
  chat:'<path d="M4 5h16v11H9l-5 4z"/>',
  play:'<path d="M8 5l11 7-11 7z" fill="currentColor"/>',
  lock:'<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>'
});
const I=(n,s=22,sw=2)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${IC[n]||''}</svg>`;
const vb=()=>`<span class="vb" title="Verificado">${I('check',11,3.5)}</span>`;
const av=(n,cls='')=>{const t=TINTS[hash(n)%TINTS.length];return `<span class="avatar ${cls}" style="background:${t[0]};color:${t[1]}">${esc(ini(n))}</span>`};
const avs=(names,max=4)=>`<span class="avs">${names.slice(0,max).map(n=>av(n)).join('')}${names.length>max?`<span class="avatar" style="background:#E4EAE6;color:#3F4F46">+${names.length-max}</span>`:''}</span>`;
const wordmark=()=>`<span class="wm"><img src="${LOGO.wordD}" alt="RodApp"></span>`;
const hdr=(title,to,right='')=>`<div class="top"><button class="ib" ${to.startsWith('@')?`data-act="${to.slice(1)}"`:`data-act="go" data-to="${to}"`} aria-label="Volver">${I('back',24)}</button><div class="grow">${title?`<h2 class="t" style="font-size:20px">${title}</h2>`:''}</div>${right}</div>`;

/* ================= mapas ================= */
function pointAt(route,p){
  p=Math.min(1,Math.max(0,p));const L=[];let tot=0;
  for(let i=1;i<route.length;i++){const d=Math.hypot(route[i][0]-route[i-1][0],route[i][1]-route[i-1][1]);L.push(d);tot+=d}
  let t=p*tot;
  for(let i=0;i<L.length;i++){if(t<=L[i]){const k=L[i]?t/L[i]:0;return[route[i][0]+(route[i+1][0]-route[i][0])*k,route[i][1]+(route[i+1][1]-route[i][1])*k]}t-=L[i]}
  return route[route.length-1];
}
function mapSVG(route,dark,opt={}){dark=true;
  const c=dark?{land:'#0B1310',road:'#22322A',edge:'#15211B',hill:'#101D17',hill2:'#142A20',water:'#0B1B24',route:'#2FD98D',halo:'rgba(47,217,141,.22)'}:{land:'#EAF1EC',road:'#FFFFFF',edge:'#D3DED7',hill:'#DDEAE1',hill2:'#CDE0D4',water:'#CFE3EE',route:'#12B76A',halo:'rgba(18,183,106,.25)'};
  const pts=route.map(p=>p.join(',')).join(' ');
  const s=route[0],e=route[route.length-1];
  return `<svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Mapa de la ruta">
  <rect width="300" height="200" fill="${c.land}"/>
  <ellipse cx="228" cy="38" rx="86" ry="46" fill="${c.hill}"/><ellipse cx="236" cy="42" rx="46" ry="24" fill="${c.hill2}"/>
  <ellipse cx="46" cy="160" rx="72" ry="40" fill="${c.hill}"/>
  <path d="M-10 70C40 62 70 84 112 78S190 104 214 96 280 118 312 108V150C260 160 214 140 170 150S60 140 -10 118Z" fill="${c.water}" opacity=".55"/>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
    <g stroke="${c.edge}" stroke-width="9"><path d="M-10 150C50 140 90 170 150 160S250 120 310 130"/><path d="M60 -10C70 40 110 60 120 110S150 180 160 210"/><path d="M200 -10C190 40 220 70 250 100S290 160 310 170"/></g>
    <g stroke="${c.road}" stroke-width="6"><path d="M-10 150C50 140 90 170 150 160S250 120 310 130"/><path d="M60 -10C70 40 110 60 120 110S150 180 160 210"/><path d="M200 -10C190 40 220 70 250 100S290 160 310 170"/></g>
    <g stroke="${c.road}" stroke-width="2.4" opacity=".8"><path d="M-10 30C40 36 80 20 130 34S220 24 310 46"/><path d="M-10 100C30 96 60 110 100 104"/><path d="M180 200C190 170 230 160 250 190"/><path d="M130 -10L146 52"/></g>
    <polyline points="${pts}" stroke="${c.halo}" stroke-width="12"/>
    <polyline points="${pts}" stroke="${c.route}" stroke-width="4"/>
  </g>
  <circle cx="${s[0]}" cy="${s[1]}" r="8" fill="${dark?'#0F1714':'#fff'}"/><circle cx="${s[0]}" cy="${s[1]}" r="4.5" fill="${c.route}"/>
  <g transform="translate(${e[0]} ${e[1]})"><path d="M0 0V-18" stroke="${dark?'#fff':'#10151A'}" stroke-width="2.2"/><path d="M0 -18h11l-3 4 3 4H0z" fill="${dark?'#fff':'#10151A'}"/></g>
  ${opt.riders?'<g id="riders"></g>':''}
  ${opt.you?`<circle cx="${s[0]}" cy="${s[1]}" r="10" fill="#007AFF" stroke="#fff" stroke-width="3"/>`:''}
  </svg>`;
}

/* ================= navegación ================= */
function go(id){clearST();closeLayer();hideOv();S.screen=id;render()}
function render(){
  const sc=$('#screen');const b=sc.querySelector('.body');const keep=b&&S._last===S.screen?b.scrollTop:0;
  sc.innerHTML=(SCR[S.screen]||SCR.splash)();S._last=S.screen;
  const nb=sc.querySelector('.body');if(nb&&keep)nb.scrollTop=keep;
  if(AFTER[S.screen])AFTER[S.screen]();
}
function toast(m){const t=$('#toast');t.innerHTML=`<div class="toast">${I('check',20,3)}<span>${esc(m)}</span></div>`;clearTimeout(toast.t);toast.t=setTimeout(()=>t.innerHTML='',2600)}
let _lastFocus=null;
function openLayer(html){const l=$('#layer');const first=l.hidden;if(first)_lastFocus=document.activeElement;l.innerHTML=html;l.hidden=false;
  const d=l.querySelector('[role=dialog]');if(d){d.setAttribute('aria-modal','true');d.setAttribute('tabindex','-1');if(first){const f=d.querySelector('button,textarea,input');try{(f||d).focus({preventScroll:true})}catch(e){}}}}
function closeLayer(){const l=$('#layer');const was=!l.hidden;l.hidden=true;l.innerHTML='';
  if(was&&_lastFocus&&document.contains(_lastFocus)){try{_lastFocus.focus({preventScroll:true})}catch(e){}}_lastFocus=null}
function hideOv(){const o=$('#ov');o.hidden=true;o.innerHTML=''}
function beep(f=880,d=.16){if(!S.demo.sound)return;try{const a=beep.c||(beep.c=new(window.AudioContext||window.webkitAudioContext)());const o=a.createOscillator(),g=a.createGain();o.frequency.value=f;g.gain.value=.06;o.connect(g);g.connect(a.destination);o.start();o.stop(a.currentTime+d)}catch(e){}}
function say(t){if(!S.demo.sound)return;try{const u=new SpeechSynthesisUtterance(t);u.lang='es-CO';speechSynthesis.cancel();speechSynthesis.speak(u)}catch(e){}}
function buzz(){try{navigator.vibrate&&navigator.vibrate([120,60,120])}catch(e){}}
const cuposOf=r=>r.cupo-r.part.length;
const fixedUser=()=>{S.user=S.user||{nombre:'Camilo Rojas',exp:'Intermedio'};S.verified=true;S.veh.cc=S.veh.cc||'200–500'};

/* ================= pantallas ================= */
const SCR={};const AFTER={};

SCR.splash=()=>`<div class="scr dark splash">
 <div class="splash-mid"><img class="lock" src="${LOGO.stackD}" alt="RodApp"><p class="slogan">Bogotá rueda conectada</p></div>
 <div class="splash-act"><button class="btn" data-act="start">Empezar</button><button class="btn ghost" data-act="go" data-to="login">Ya tengo cuenta</button></div></div>`;


SCR.login=()=>`<div class="scr light">${hdr('','splash')}
 <div class="body"><h1 class="t">Inicia sesión</h1><p class="lead">Entra para ver las rodadas de tu zona.</p>
 <div class="field ${S.errs.login?'err':''}"><label for="le">Correo</label><input id="le" type="email" inputmode="email" autocomplete="email" data-bind="login.email" value="${esc(S.login.email)}" ${S.errs.login?'aria-invalid="true" aria-describedby="lm"':''}></div>
 <div class="field ${S.errs.login?'err':''}"><label for="lp">Contraseña</label><input id="lp" type="password" autocomplete="current-password" data-bind="login.pass" value="${esc(S.login.pass)}" ${S.errs.login?'aria-invalid="true" aria-describedby="lm"':''}><span class="msg" id="lm">Correo o contraseña incorrectos. Revisa los datos e intenta de nuevo.</span></div>
 <button class="btn link" style="min-height:40px;justify-content:flex-start;padding:0" data-act="toast" data-m="Te enviamos un enlace a tu correo">¿Olvidaste tu contraseña?</button></div>
 <div class="foot"><button class="btn" data-act="login">Entrar</button><button class="btn link" data-act="go" data-to="reg">¿No tienes cuenta? Regístrate</button></div></div>`;

const prog=(n,label)=>`<p class="pstep">Paso ${n} de 3 · ${label}</p><div class="prog">${[1,2,3].map(i=>`<i class="${i<=n?'on':''}"></i>`).join('')}</div>`;

SCR.reg=()=>{const e=S.errs,r=S.reg;
 const fld=(k,l,type,ph,msg,ac)=>`<div class="field ${e[k]?'err':''}"><label for="r_${k}">${l}</label><input id="r_${k}" type="${type}" placeholder="${ph}" autocomplete="${ac}" data-bind="reg.${k}" data-k="${k}" value="${esc(r[k])}" ${e[k]?`aria-invalid="true" aria-describedby="m_${k}"`:''}><span class="msg" id="m_${k}">${msg}</span></div>`;
 return `<div class="scr light">${hdr('','splash')}
 <div class="body">${prog(1,'Perfil motero')}<h1 class="t">Crea tu perfil</h1><p class="lead">Cuéntanos cómo ruedas para armarte el parche ideal.</p>
 ${fld('nombre','Nombre completo','text','Camilo Rojas','Escribe tu nombre completo.','name')}
 ${fld('correo','Correo','email','nombre@correo.com','Revisa el correo: falta el @ o el dominio.','email')}
 ${fld('pass','Contraseña','password','Mínimo 6 caracteres','Usa mínimo 6 caracteres.','new-password')}
 <div class="msgbox ${e.exp?'err':''}"><div class="lab" style="margin-bottom:8px">¿Cuánta experiencia tienes?</div>
  <div class="cards ${e.exp?'opts err':''}" role="radiogroup">${Object.keys(NIV).map(k=>`<button class="opt" role="radio" aria-checked="${r.exp===k}" data-act="exp" data-v="${k}"><span><b>${k}</b><span class="d">${NIVD[k]}</span></span><span class="rad">${r.exp===k?I('check',13,3.5):''}</span></button>`).join('')}</div><span class="msg">Elige tu nivel de experiencia.</span></div>
 <div><div class="lab" style="margin-bottom:8px">¿Cuándo sueles rodar?</div><div class="chips">${DISP.map(d=>`<button class="chip" aria-pressed="${r.disp.includes(d)}" data-act="disp" data-v="${d}">${d}</button>`).join('')}</div></div>
 </div><div class="foot"><button class="btn" data-act="regNext">Continuar</button></div></div>`};

const KT={front:['Frente de la cédula','Toma la foto del frente'],back:['Reverso de la cédula','Toma la foto del reverso']};
function tile(k){const st=S.kyc[k];const [t,h]=KT[k];let inner;
 if(st==='loading')inner=`<span class="in"><svg class="spin" width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#12B76A" stroke-width="3" stroke-linecap="round"><path d="M12 3a9 9 0 1 0 9 9"/></svg><b>Leyendo…</b></span>`;
 else if(st==='ok')inner=`<span class="in"><span class="okc pop">${I('check',22,3)}</span><b>${t} · leído</b></span>`;
 else if(st==='error')inner=`<span class="in"><span style="color:#FF6B61">${I('warn',30)}</span><b style="color:#FFB4AE">${esc(S.kyc.msg)}</b><span>Toca para intentar de nuevo</span></span>`;
 else inner=`<span class="in">${I('cam',30)}<b>${h}</b><span>Encaja la cédula en el recuadro</span></span>`;
 return `<button class="tile ${st==='ok'?'ok':st==='error'?'bad':''}" data-act="cap" data-k="${k}" ${st==='loading'?'disabled':''} aria-label="${t}"><span class="guide"></span>${inner}</button>`}
SCR.kyc=()=>{const k=S.kyc;
 if(k.step===0){const ok=k.front==='ok'&&k.back==='ok';
  return `<div class="scr light">${hdr('','reg')}<div class="body">${prog(2,'Identidad')}<h1 class="t">Verifica tu cédula</h1><p class="lead">Validamos que eres tú para cuidar al grupo. No mostramos tu cédula a nadie.</p>${tile('front')}${tile('back')}
  <div class="banner info">${I('shield',20)}<span>Usamos la foto solo para confirmar tu identidad.</span></div></div>
  <div class="foot"><button class="btn" data-act="kycNext" ${ok?'':'disabled'}>Continuar</button></div></div>`}
 const st=k.selfie;const col=st==='ok'?'#2FD98D':'#9DB0A6';
 return `<div class="scr light">${hdr('','@kycBack')}<div class="body">${prog(2,'Identidad')}<h1 class="t">Ahora, una selfie</h1><p class="lead">Centra tu cara en el óvalo. Sin casco, gorra ni gafas oscuras.</p>
  <button class="selfie" data-act="cap" data-k="selfie" ${st==='loading'?'disabled':''} aria-label="Tomar selfie">
   <svg width="236" height="300" viewBox="0 0 236 300" fill="none"><ellipse cx="118" cy="150" rx="80" ry="108" stroke="${col}" stroke-width="4" ${st==='ok'?'':'stroke-dasharray="10 9"'}/><circle cx="118" cy="125" r="30" fill="#1D2B24"/><path d="M62 232c8-34 30-46 56-46s48 12 56 46" fill="#1D2B24"/></svg>
   ${st==='loading'?'<span class="scan"></span>':''}
   ${st==='ok'?`<span class="okc pop" style="position:absolute;bottom:20px">${I('check',22,3)}</span>`:''}
   ${st==='idle'||st==='error'?`<span style="position:absolute;bottom:14px;color:#CFE0D6;font-size:14px">${st==='error'?esc(S.kyc.msg):'Toca para tomar la selfie'}</span>`:''}
  </button>
  <p class="small" style="text-align:center;margin:0">${st==='loading'?'Validando tu rostro…':st==='ok'?'Rostro validado':'Busca buena luz y mira de frente.'}</p></div>
  <div class="foot"><button class="btn" data-act="kycNext" ${st==='ok'?'':'disabled'}>Continuar</button></div></div>`};

SCR.veh=()=>{const v=S.veh,e=S.errs;
 return `<div class="scr light">${hdr('','@vehBack')}<div class="body">${prog(3,'Tu moto')}<h1 class="t">Registra tu moto</h1><p class="lead">Con esto te mostramos rodadas a tu ritmo.</p>
 <div class="msgbox ${e.cc?'err':''}"><div class="lab" style="margin-bottom:8px">Cilindraje</div><div class="cards ${e.cc?'opts err':''}" role="radiogroup">${CCS.map(c=>`<button class="opt" role="radio" aria-checked="${v.cc===c.k}" data-act="vcc" data-v="${c.k}"><span><b>${c.t}</b><span class="d">${c.d}</span></span><span class="rad">${v.cc===c.k?I('check',13,3.5):''}</span></button>`).join('')}</div><span class="msg">Elige el cilindraje de tu moto.</span></div>
 <div><div class="lab" style="margin-bottom:8px">Tipo de moto</div><div class="chips">${TIPOS.map(t=>`<button class="chip" aria-pressed="${v.tipo===t}" data-act="vtipo" data-v="${t}">${t}</button>`).join('')}</div></div>
 <div class="field ${e.marca?'err':''}"><label for="v_m">Marca</label><select id="v_m" data-bind="veh.marca" data-k="marca"><option value="">Selecciona la marca</option>${MARCAS.map(m=>`<option ${v.marca===m?'selected':''}>${m}</option>`).join('')}</select><span class="msg">Selecciona la marca de tu moto.</span></div>
 <div class="field ${e.placa?'err':''}"><label for="v_p">Placa</label><input id="v_p" maxlength="6" placeholder="ABC12D" autocapitalize="characters" data-bind="veh.placa" data-k="placa" data-up="1" value="${esc(v.placa)}" style="text-transform:uppercase;letter-spacing:2px;font-weight:700"><span class="msg">Placa de moto: 3 letras, 2 números y 1 letra (ej. ABC12D).</span></div>
 <button class="opt" role="switch" aria-checked="${v.bt}" data-act="bt"><span style="color:var(--green-ink)">${I('bt',24)}</span><span><b>Tengo intercomunicador Bluetooth</b><span class="d">Opcional. Lo conectamos al iniciar el Modo Rodada.</span></span><span class="rad" style="border-radius:8px">${v.bt?I('check',13,3.5):''}</span></button>
 </div><div class="foot"><button class="btn" data-act="vehNext">Finalizar registro</button></div></div>`};

SCR.done=()=>`<div class="scr light"><div class="body" style="justify-content:center;align-items:center;text-align:center;gap:14px">
 <span class="okc pop" style="width:92px;height:92px">${I('check',46,3)}</span><h1 class="t">¡Cuenta verificada!</h1>
 <p class="lead" style="max-width:290px">${esc(first(S.user&&S.user.nombre)||'Listo')}, ya puedes unirte a rodadas y crear la tuya.</p>
 <div class="banner info" style="text-align:left;width:100%">${I('shield',20)}<span>${esc(S.veh.marca||'Tu moto')} · ${esc(S.veh.cc||'')} cc · ${esc(S.veh.placa||'')}</span></div></div>
 <div class="foot"><button class="btn" data-act="toHome">Buscar rodadas</button></div></div>`;

/* ----- home ----- */
const tabbar=cur=>`<nav class="tabs" aria-label="Principal">${[['home','Inicio','home'],['comunidad','Comunidad','people'],['perfil','Perfil','user']].map(([k,l,i])=>`<button data-act="go" data-to="${k}" ${cur===k?'aria-current="true"':''}>${I(i,24)}${l}</button>`).join('')}</nav>`;
const lvl=n=>`<span class="lvl"><span class="b">${[1,2,3].map(i=>`<i class="${i<=NIV[n]?'f':''}"></i>`).join('')}</span>${n}</span>`;
function rideCard(r){const c=cuposOf(r);const cl=c<=0?'full':c<=2?'low':'';
 return `<button class="ride" data-act="open" data-id="${r.id}"><div class="rtop"><h3>${esc(r.name)}</h3>${lvl(r.nivel)}</div>
 <div class="host">${r.ver?vb():''}<span>${esc(r.club)} · ${esc(r.host==='Tú'?'Tú':r.host)}</span></div>
 <div class="meta"><span>${I('clock',16)}${r.fecha}, ${r.hora}</span><span>${I('pin',16)}${r.zona}</span><span>${I('engine',16)}${r.cc} cc</span>${r.lugar&&!S.badges.includes(r.lugar)?`<span style="color:var(--neon)">${I('star',16)}Insignia ${BADGES.find(b=>b.k===r.lugar).n} · +${XP_INSIGNIA} XP</span>`:''}</div>
 <div class="rfoot">${avs(r.part)}<span class="cupos ${cl}">${c<=0?'Rodada llena':c===1?'Queda 1 cupo':c+' cupos'}</span></div></button>`}
SCR.home=()=>{const f=S.f;
 const list=S.rides.filter(r=>(!f.cc||r.cc===f.cc)&&(!f.zona||r.zona===f.zona)&&(!f.fecha||r.fecha===f.fecha));
 return `<div class="scr light"><div class="hhead">${wordmark()}<button class="ib" data-act="go" data-to="perfil" aria-label="Perfil">${av(S.user?S.user.nombre:'Camilo Rojas')}</button></div>
 <div class="body" style="gap:14px"><div data-tour="h-titulo"><h1 class="t">Rodadas desde Bogotá</h1><p class="lead" style="margin-top:4px">${list.length} ${list.length===1?'rodada':'rodadas'} saliendo de Bogotá y la Sabana</p></div>
 <div data-tour="h-filtros" style="display:flex;flex-direction:column;gap:14px"><div class="scrollx"><button class="pill ${f.cc?'on':''}" data-act="filter" data-w="cc" aria-haspopup="dialog">${I('engine',16)}${f.cc?f.cc+' cc':'Cilindraje'}${I('down',16)}</button><button class="pill ${f.fecha?'on':''}" data-act="filter" data-w="fecha" aria-haspopup="dialog">${I('cal',16)}${f.fecha||'Fecha'}${I('down',16)}</button></div>
 <div class="scrollx" role="group" aria-label="Zona"><button class="chip" aria-pressed="${!f.zona}" data-act="zona" data-v="">Todas</button>${ZONAS.map(z=>`<button class="chip" aria-pressed="${f.zona===z}" data-act="zona" data-v="${z}">${z}</button>`).join('')}</div>${f.zona?`<p class="small" style="margin:0">${ZONA_INFO[f.zona]}</p>`:''}</div>
 ${list.length?`<div class="cards" style="gap:12px;padding-bottom:70px">${list.map(rideCard).join('')}</div>`:`<div class="empty"><span class="ill">${I('route',34)}</span><h2 class="t">No hay rodadas con estos filtros</h2><p class="lead">Amplía la búsqueda o arma tú la rodada.</p><button class="btn sm" data-act="clearF">Quitar filtros</button><button class="btn link" data-act="go" data-to="crear">Crear una rodada</button></div>`}
 </div><button class="fab" data-act="go" data-to="crear">${I('plus',24,2.6)}Crear rodada</button>${tabbar('home')}</div>`};
const CONF_T=['accidente','peligro','hurto','precaucion'];
function postCard(p){const C=S.com,T=TEMAS[p.tema],on=!!C.liked[p.id],open=C.open==p.id,cf=!!C.conf[p.id],r=p.ride&&S.rides.find(x=>x.id===p.ride),g=p.g&&GRUPOS.find(x=>x.k===p.g),nc=(p.conf||0)+(cf?1:0);
  return `<article class="post"><div class="ph"><button data-act="peek" data-n="${esc(p.n)}" aria-label="Ver perfil de ${esc(p.n)}">${av(p.n)}</button><div class="who"><b>${esc(p.n)}</b> ${lchip(p.n)}<small>${esc(p.zona)} · ${p.ago}${g?' · '+esc(g.n):''}</small></div><span class="ptg" style="background:${T.c}2E;color:${T.c}">${I(T.ic,14,2.4)}${T.l}</span></div>
  <p>${esc(p.t)}</p>
  ${p.dur?`<button class="vid" data-act="toast" data-m="Aquí se reproduce el video" aria-label="Reproducir video">${mapSVG(RTS[(p.rt||0)%3],true)}<span class="pl"><span>${I('play',24)}</span></span><small>${p.dur}</small></button>`:''}
  ${r?`<button class="fact" data-act="open" data-id="${r.id}" style="display:flex;justify-content:space-between;align-items:center;width:100%"><span><b style="font-size:15px">${esc(r.name)}</b><span>${r.fecha}, ${r.hora} · ${cuposOf(r)<=0?'Llena':cuposOf(r)+(cuposOf(r)===1?' cupo':' cupos')}</span></span>${I('chev',20)}</button>`:''}
  <div class="pa">${CONF_T.includes(p.tema)?`<button class="${cf?'on':''}" data-act="conf" data-id="${p.id}" aria-pressed="${cf}" aria-label="Confirmo este aviso. ${nc} confirmaciones">${I('check',20,2.6)}${cf?'Confirmado':'Confirmo'} · ${nc}</button>`:''}<button class="${on?'on':''}" data-act="like" data-id="${p.id}" aria-pressed="${on}" aria-label="Me gusta">${I(on?'heartf':'heart',20)}${p.likes+(on?1:0)}</button><button class="${open?'on':''}" data-act="ccm" data-id="${p.id}" aria-expanded="${open}" aria-label="Comentarios">${I('chat',20)}${p.c.length}</button><button class="rep" data-act="report" data-id="${p.id}" aria-label="Reportar publicación">${I('flag',20)}</button></div>
  ${open?`<div class="cm">${p.c.map(c=>`<div class="msg-b ${c.n==='Tú'?'me':''}"><small>${esc(c.n)} ${lchip(c.n)}</small>${esc(c.t)}</div>`).join('')}<form class="chatin" data-cform="${p.id}"><input placeholder="Escribe un comentario" autocomplete="off" aria-label="Comentario"><button type="submit" aria-label="Enviar">${I('send',22)}</button></form></div>`:''}</article>`}
function grupoCard(g){const on=S.com.grupos.includes(g.k),n=S.com.posts.filter(p=>p.g===g.k).length;
  return `<article class="gcard"><div class="gtop">${av(g.n)}<div class="who"><b>${esc(g.n)}</b>${g.ver?vb():''}<small>${esc(g.z)} · ${g.m.toLocaleString('es-CO')} miembros</small></div></div>
  <p>${esc(g.d)}</p>
  <div class="grow2"><button class="btn sm ${on?'ghost':''}" data-act="gjoin" data-k="${g.k}" aria-pressed="${on}" aria-label="${on?'Dejar de seguir':'Seguir'} ${esc(g.n)}">${on?'Siguiendo':'Seguir'}</button>${n?`<button class="btn link sm" data-act="gver" data-k="${g.k}">Ver ${n===1?'1 publicación':n+' publicaciones'}</button>`:''}</div></article>`}
SCR.comunidad=()=>{const C=S.com,gf=C.gfilter&&GRUPOS.find(x=>x.k===C.gfilter);
  let L=C.posts.filter(p=>(!C.tema||p.tema===C.tema)&&(C.vista!=='zona'||p.zona===S.zonaMia)&&(!C.gfilter||p.g===C.gfilter));
  if(C.vista==='tu')L=L.map((p,i)=>[p,(p.n==='Tú'?100:0)+(p.zona===S.zonaMia?3:0)+(C.grupos.includes(p.g)?2:0)+2*(C.gusta[p.tema]||0)-i*.01]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
  const chip=(act,v,l,on)=>`<button class="chip" aria-pressed="${on}" data-act="${act}" data-v="${v}">${l}</button>`;
  const vistas=`<div class="scrollx" role="group" aria-label="Qué ver" data-tour="c-vistas">${chip('cvista','tu','Para ti',C.vista==='tu')}${chip('cvista','zona','Mi zona',C.vista==='zona')}${chip('cvista','grupos','Grupos',C.vista==='grupos')}</div>`;
  let main;
  if(C.vista==='grupos'){const mine=GRUPOS.filter(g=>C.grupos.includes(g.k)),rest=GRUPOS.filter(g=>!C.grupos.includes(g.k));
    main=`<div class="cards" style="gap:12px;padding-bottom:70px">${mine.length?`<h2 class="t" style="font-size:18px">Tus grupos</h2>${mine.map(grupoCard).join('')}`:''}<h2 class="t" style="font-size:18px">${mine.length?'Descubre más grupos':'Grupos para seguir'}</h2>${rest.map(grupoCard).join('')}</div>`}
  else main=`${C.vista==='zona'?`<div class="scrollx" role="group" aria-label="Zona">${ZONAS.map(z=>chip('czona',z,z,S.zonaMia===z)).join('')}</div>`:''}
  <div class="scrollx" role="group" aria-label="Tema" data-tour="c-temas">${chip('ctema','','Todo',!C.tema)}${Object.entries(TEMAS).map(([k,t])=>chip('ctema',k,t.f,C.tema===k)).join('')}</div>
  ${gf?`<div><button class="chip" aria-pressed="true" data-act="gclear" aria-label="Quitar el filtro del grupo ${esc(gf.n)}">${esc(gf.n)}${I('close',16,2.6)}</button></div>`:''}
  ${L.length?`<div class="cards" style="gap:12px;padding-bottom:70px">${L.map(postCard).join('')}</div>`:`<div class="empty"><span class="ill">${I('people',34)}</span><h2 class="t">Aún no hay publicaciones aquí</h2><p class="lead">Sé el primero en avisar algo a tu zona.</p><button class="btn sm" data-act="compose">Publicar</button></div>`}`;
  return `<div class="scr light"><div class="hhead">${wordmark()}<button class="ib" data-act="go" data-to="perfil" aria-label="Perfil">${av(S.user?S.user.nombre:'Camilo Rojas')}</button></div>
  <div class="body" style="gap:14px"><div><h1 class="t">Comunidad</h1><p class="lead" style="margin-top:4px">Avisos, rodadas y grupos de Bogotá y la Sabana.</p></div>
  ${vistas}${main}
  </div><button class="fab" data-act="compose">${I('plus',24,2.6)}Publicar</button>${tabbar('comunidad')}</div>`};
SCR.perfil=()=>{const u=S.user||{nombre:'Camilo Rojas',exp:'Intermedio'},xi=xpInfo(S.xp),m=S.rides.filter(r=>r.part.includes('Tú'));
  return `<div class="scr light"><div class="hhead">${wordmark()}<span></span></div><div class="body"><div style="display:flex;gap:14px;align-items:center">${av(u.nombre,'')}<div><h1 class="t" style="font-size:24px">${esc(u.nombre)}</h1><span class="host" style="margin-top:4px">${vb()}Identidad verificada</span></div></div>
  <div class="stats"><div class="stat"><b>${u.exp?u.exp.slice(0,4)+'.':'—'}</b><span>Ritmo</span></div><div class="stat"><b>4,8</b><span>Calificación</span></div><div class="stat"><b>${S.rodadas}</b><span>Rodadas</span></div></div>
  <div class="fact"><b>${esc(S.veh.marca||'Yamaha')} · ${esc(S.veh.cc||'200–500')} cc</b><span>Placa ${esc(S.veh.placa||'ABC12D')}${S.veh.bt?' · Intercomunicador Bluetooth':''}</span></div>
  <div class="xp" data-tour="p-xp"><div class="xtop"><span class="xlv">${xi.l+1}</span><div><b>Nivel ${xi.l+1} · ${xi.name}</b><span class="small">${S.xp} XP${xi.b?' · faltan '+xi.left+' para el nivel '+(xi.l+2):' · Nivel máximo'}</span></div></div>
   <div class="meter" role="progressbar" aria-label="Experiencia" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${xi.pct}"><i style="width:${xi.pct}%"></i></div>
   <span class="small">Cada rodada suma ${XP_RODADA} XP. Cada insignia suma ${XP_INSIGNIA} XP.</span></div>
  <div><h2 class="t" style="margin-bottom:10px">Mis rodadas</h2>${m.length?`<div class="cards" style="gap:12px">${m.map(rideCard).join('')}</div>`:`<div class="empty" style="padding:18px 10px"><p class="lead">Aún no tienes rodadas por salir.</p><button class="btn sm" data-act="go" data-to="home">Ver rodadas</button></div>`}</div>
  <div><div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:10px"><h2 class="t">Insignias</h2><span class="small">${S.badges.length} de ${BADGES.length}</span></div>
   <div class="bgrid">${BADGES.map(b=>{const o=S.badges.includes(b.k);return `<button class="bdg ${o?'':'lock'}" data-act="badge" data-k="${b.k}" aria-label="Insignia ${b.n}, ${o?'ganada':'bloqueada, mínimo '+b.km+' km'}">${badgeSVG(b,o,64)}<b>${b.n}</b><span>${o?'Ganada':'Mín. '+b.km+' km'}</span></button>`}).join('')}</div></div>
  <button class="btn ghost" data-act="go" data-to="splash">Cerrar sesión</button></div>${tabbar('perfil')}</div>`};

/* ----- crear ----- */
SCR.crear=()=>{const c=S.cr,e=S.errs;
 const grp=(k,l,arr,fmt=x=>x)=>`<div class="msgbox ${e[k]?'err':''}"><div class="lab" style="margin-bottom:8px">${l}</div><div class="chips ${e[k]?'opts err':''}">${arr.map(x=>`<button class="chip" aria-pressed="${c[k]===x}" data-act="cset" data-k="${k}" data-v="${x}">${fmt(x)}</button>`).join('')}</div><span class="msg">Elige una opción.</span></div>`;
 return `<div class="scr light">${hdr('Crear rodada','home')}<div class="body">
 <div class="msgbox"><div class="lab" style="margin-bottom:8px" id="lr">Ruta sugerida desde Bogotá</div><div class="cards" role="radiogroup" aria-labelledby="lr">${RUTAS.map((R,i)=>`<button class="opt" role="radio" aria-checked="${c.ruta===i}" data-act="cruta" data-v="${i}" style="min-height:58px"><span><b>${R.n}</b><span class="d">${R.z} · ~${R.km} km · ida y vuelta el mismo día</span></span><span class="rad">${c.ruta===i?I('check',13,3.5):''}</span></button>`).join('')}</div></div>
 <div class="field ${e.nombre?'err':''}"><label for="c_n">Nombre de la rodada</label><input id="c_n" placeholder="Ej. Domingo de neblina en La Calera" data-bind="cr.nombre" data-k="nombre" value="${esc(c.nombre)}"><span class="msg">Ponle un nombre a tu rodada.</span></div>
 ${grp('cc','Cilindraje mínimo',['<200','200–500','>500'],x=>x+' cc')}
 ${grp('zona','Zona',ZONAS)}
 ${grp('nivel','Nivel requerido',Object.keys(NIV))}
 ${grp('fecha','Fecha',FECHAS)}
 ${grp('hora','Hora de salida',HORAS)}
 <div class="msgbox ${e.punto?'err':''}"><div class="lab" style="margin-bottom:8px">Punto de encuentro</div><div class="cards ${e.punto?'opts err':''}" style="gap:8px">${SPOTS.map(s=>`<button class="opt" role="radio" aria-checked="${c.punto===s}" data-act="cset" data-k="punto" data-v="${esc(s)}" style="min-height:54px">${I('pin',20)}<b style="font-size:15px;font-weight:400">${s}</b><span class="rad">${c.punto===s?I('check',13,3.5):''}</span></button>`).join('')}</div><span class="msg">Elige dónde se encuentra el grupo.</span></div>
 <div><div class="lab" style="margin-bottom:8px">Cupos (contándote a ti)</div><div style="display:flex;align-items:center;gap:16px"><button class="ib" style="background:var(--surface)" data-act="cupo" data-d="-1" aria-label="Menos cupos"><span style="font-size:26px;line-height:1">−</span></button><b style="font:400 30px var(--display);min-width:40px;text-align:center">${c.cupo}</b><button class="ib" style="background:var(--surface)" data-act="cupo" data-d="1" aria-label="Más cupos">${I('plus',22)}</button></div></div>
 ${Object.keys(e).length?`<div class="banner err">${I('warn',20)}<span>Completa los campos marcados para publicar.</span></div>`:''}
 </div><div class="foot"><button class="btn" data-act="publish">Publicar rodada</button></div></div>`};

/* ----- detalle ----- */
SCR.detalle=()=>{const r=S.sel||S.rides[0];const c=cuposOf(r);const joined=r.part.includes('Tú');
 const exp=S.user&&S.user.exp;const warn=exp&&NIV[exp]<NIV[r.nivel]&&!joined;
 const route=RTS[r.rt%3];
 return `<div class="scr light">
 <div style="position:relative;height:230px;flex:none" class="map">${mapSVG(route,false)}<button class="ib" data-act="go" data-to="home" aria-label="Volver" style="position:absolute;left:12px;top:14px;background:rgba(0,0,0,.72);color:#fff;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)">${I('back',24)}</button></div>
 <div class="body" style="padding-top:18px">
  <div><h1 class="t" style="font-size:28px">${esc(r.name)}</h1><div class="host" style="margin-top:8px">${r.ver?vb():''}<span>${esc(r.club)} · Guía: ${esc(r.host)} ${lchip(r.host)}</span></div></div>
  <div class="facts"><div class="fact"><b>${r.hora}</b><span>${r.fecha}</span></div><div class="fact"><b>~${r.km} km</b><span>Ida y vuelta</span></div><div class="fact"><b>${r.cc} cc</b><span>Cilindraje</span></div><div class="fact">${lvl(r.nivel)}<span style="display:block;margin-top:2px">Nivel requerido</span></div></div>
  <div class="fact" style="display:flex;gap:10px;align-items:center">${I('pin',22)}<div><b style="font-size:15px">Punto de encuentro</b><span>${esc(r.punto)}</span></div></div>
  ${warn?`<div class="banner" style="background:rgba(255,149,0,.16);color:#FFC76B">${I('warn',20)}<span>Esta rodada es nivel ${r.nivel}. Tu perfil es ${exp}. Puedes unirte, pero el ritmo será exigente.</span></div>`:''}
  <div><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px"><h2 class="t">Parche confirmado</h2><span class="cupos ${c<=0?'full':c<=2?'low':''}">${c<=0?'Llena':c+(c===1?' cupo':' cupos')}</span></div>
   <div style="display:flex;flex-wrap:wrap;gap:10px">${r.part.map(n=>`<button data-act="peek" data-n="${esc(n)}" style="display:flex;flex-direction:column;align-items:center;gap:4px;width:64px">${av(n,'')}<span class="small" style="font-size:12px;text-align:center">${esc(first(n))}</span>${lchip(n)}</button>`).join('')}</div></div>
  <div><h2 class="t" style="margin-bottom:10px">Reglas de la rodada</h2><ul class="rules">${['Casco certificado y chaqueta con protecciones.','SOAT y revisión técnico-mecánica al día.','Llega con el tanque lleno al punto de encuentro.','Se rueda en zigzag y nadie adelanta al guía.','Sin picar ni acelerones: respeta los límites de velocidad y el descanso de los barrios.','Si alguien se queda atrás, el grupo espera en la próxima parada.'].map(x=>`<li>${I('check',18,2.6)}<span>${x}</span></li>`).join('')}</ul></div>
 </div><div class="foot">${joined?`<button class="btn" data-act="enterLobby">Ir a la sala de espera</button>`:c<=0?`<button class="btn" disabled>Rodada llena</button><button class="btn link" data-act="toast" data-m="Te avisamos si se libera un cupo">Avisarme si hay cupo</button>`:`<button class="btn" data-act="joinAsk">Unirme a la rodada</button>`}</div></div>`};

/* ----- lobby ----- */
function initLobby(host){
  const r=S.sel;const ppl=r.part.map((n,i)=>({n,st:n==='Tú'?'conf':(i===0?'ready':'conf')}));
  S.lobby={host,ready:false,started:false,ppl,msgs:host?[]:[{n:r.host,t:'Buenas, parche. Nos vemos 15 minutos antes y tanqueamos ahí mismo.'}]};
}
const readyN=()=>S.lobby.ppl.filter(p=>p.st==='ready').length;
SCR.lobby=()=>{const L=S.lobby,r=S.sel;const rn=readyN();const total=L.ppl.length;
 return `<div class="scr light">${hdr('Sala de espera','detalle','<button class="btn link sm" style="min-height:44px" data-act="leave">'+(L.host?'Cancelar':'Salir')+'</button>')}
 <div class="body" id="lbody"><div><h1 class="t" style="font-size:26px">${esc(r.name)}</h1><p class="lead" style="margin-top:4px">${r.fecha}, ${r.hora} · ${esc(r.punto)}</p></div>
  ${L.started?`<div class="banner ok">${I('flag',20)}<span><b>${esc(first(r.host))} inició la rodada.</b> Ve al punto de encuentro.</span></div>`:''}
  <div><div style="display:flex;justify-content:space-between;margin-bottom:8px"><b id="lcount">${rn} de ${total} listos</b><span class="small">${total} de ${r.cupo} cupos</span></div><div class="meter"><i id="lmeter" style="width:${total?rn/total*100:0}%"></i></div></div>
  <div id="lppl">${pplHTML()}</div>
  <div><h2 class="t" style="margin-bottom:10px">Chat del grupo</h2><div class="chat" id="lchat">${chatHTML()}</div></div>
 </div>
 <div class="foot"><form class="chatin" id="cform"><input id="cin" placeholder="Escribe al grupo" autocomplete="off" aria-label="Mensaje"><button type="submit" aria-label="Enviar">${I('send',22)}</button></form>
 ${L.started?`<button class="btn" data-act="toEnroute">Ir al punto de encuentro</button>`:L.host?`<button class="btn" data-act="hostStart" id="hbtn" ${rn>=1?'':'disabled'}>Iniciar rodada</button>`:`<button class="btn ${L.ready?'':''}" data-act="ready" id="rbtn">${L.ready?'Listo para salir · toca para cancelar':'Estoy listo para salir'}</button>`}
</div></div>`};
const pplHTML=()=>S.lobby.ppl.map(p=>`<button class="prow" data-act="peek" data-n="${esc(p.n)}">${av(p.n)}<div class="n">${esc(p.n)} ${lchip(p.n)}${p.n===S.sel.host?'<small>Anfitrión</small>':''}</div><span class="ptag ${p.st==='ready'?'':'w'}">${p.st==='ready'?'Listo':p.st==='conf'?'Confirmó':'Esperando'}</span></button>`).join('');
const chatHTML=()=>S.lobby.msgs.map(m=>m.me?`<div class="msg-b me">${esc(m.t)}</div>`:`<div class="msg-b"><small>${esc(m.n)} ${lchip(m.n)}</small>${esc(m.t)}</div>`).join('')||'<p class="small" style="margin:0">Aún no hay mensajes. Saluda al parche.</p>';
function refreshLobby(){const L=S.lobby;if(S.screen!=='lobby')return;const p=$('#lppl');if(!p)return;p.innerHTML=pplHTML();const rn=readyN();$('#lcount').textContent=rn+' de '+L.ppl.length+' listos';$('#lmeter').style.width=(L.ppl.length?rn/L.ppl.length*100:0)+'%';const h=$('#hbtn');if(h)h.disabled=rn<1}
function refreshChat(){const c=$('#lchat');if(c){c.innerHTML=chatHTML();const b=$('#lbody');b.scrollTop=b.scrollHeight}}
AFTER.lobby=()=>{const L=S.lobby,r=S.sel;
 $('#cform').addEventListener('submit',e=>{e.preventDefault();const i=$('#cin');const t=i.value.trim();if(!t)return;L.msgs.push({me:1,t});i.value='';refreshChat();
   later(()=>{const o=L.ppl.filter(p=>p.n!=='Tú');if(!o.length)return;L.msgs.push({n:o[hash(t)%o.length].n,t:['Listo, ahí nos vemos.','Perfecto, yo ya estoy saliendo.','Me avisan si cambia algo.','Dale, parche.'][hash(t)%4]});refreshChat()},1500)});
 if(L.host){const names=POOL.filter(n=>!L.ppl.some(p=>p.n===n));
   names.slice(0,4).forEach((n,i)=>{later(()=>{L.ppl.push({n,st:'conf'});r.part.push(n);refreshLobby()},1400+i*1500);later(()=>{const p=L.ppl.find(x=>x.n===n);if(p){p.st='ready';refreshLobby()}},3000+i*1800)});
 }else{
   L.ppl.filter(p=>p.st==='conf'&&p.n!=='Tú').forEach((p,i)=>later(()=>{p.st='ready';refreshLobby()},1500+i*1700));
 }};

/* ----- camino al punto ----- */
SCR.enroute=()=>{const r=S.sel;
 return `<div class="scr light"><div class="top" style="min-height:56px"><button class="ib" data-act="go" data-to="lobby" aria-label="Volver">${I('back',24)}</button><h2 class="t" style="font-size:20px">Dirígete al punto de encuentro</h2></div>
 <div class="map" style="flex:1;min-height:0;margin:6px 14px 0;border-radius:22px">${mapSVG([[100,138],[124,120],[150,112],[176,90]],false,{you:1})}</div>
 <div class="body" style="flex:none;overflow:visible;padding-top:14px"><div class="fact" style="display:flex;justify-content:space-between;align-items:center"><div><b style="font:400 28px var(--display)" id="edist">1,2 km</b><span id="eeta">4 min a tu destino</span></div><div style="text-align:right;max-width:160px"><b style="font-size:15px">${esc(r.punto.split(' Cra')[0])}</b><span>${r.hora}</span></div></div></div>
 <div class="foot"><button class="btn" data-act="micAsk" id="ebtn">Ya estoy en el punto</button></div></div>`};
AFTER.enroute=()=>{let d=1.2;every(()=>{d=Math.max(0,d-.15);const el=$('#edist');if(!el)return;el.textContent=d>0?d.toFixed(1).replace('.',',')+' km':'Llegaste';$('#eeta').textContent=d>0?Math.max(1,Math.round(d*3.4))+' min a tu destino':'Estás en el punto de encuentro'},1000)};

/* ----- HUD ----- */
const RIDERS=[{n:'Tú',off:0},{n:'Mauricio T.',off:.022},{n:'Sofía M.',off:-.022},{n:'Andrés F.',off:-.05},{n:'Julián P.',off:-.03,lag:true}];
function startRun(){S.run={t0:Date.now(),p:.05,drift:0,mic:S.micOk,speak:1,alerts:[],banner:null,chip:null,incomingDone:false,arrived:false}}
SCR.hud=()=>{const R=S.run;
 return `<div class="scr dark">
 <div class="hudtop"><span class="live"><i></i>EN VIVO · <span id="hclock">00:00:00</span></span><span class="small" id="hspd" style="font-weight:700;color:#fff">0 km/h</span></div>
 <div class="hudmap">${mapSVG(RTS[(S.sel.rt)%3],true,{riders:1})}<div id="hchip"></div></div>
 <button class="voice ${R.mic?'':'off'}" data-act="mute" id="hvoice" aria-pressed="${R.mic}"></button>
 <div class="alerts">
  <button class="ab red" data-act="alert" data-k="peligro">${I('warn',48,2.2)}<span>PELIGRO / CAÍDA<small>Avisa y comparte tu ubicación</small></span></button>
  <button class="ab org" data-act="alert" data-k="parada">${I('wrench',38,2.2)}<span>PARADA TÉCNICA</span></button>
  <button class="ab blu" data-act="alert" data-k="gasolina">${I('fuel',38,2.2)}<span>GASOLINA / DESCANSO</span></button>
 </div>
 <div class="endrow"><button data-act="endAsk">Finalizar rodada</button></div></div>`};
function voiceHTML(){const R=S.run;const sp=RIDERS[R.speak%RIDERS.length];
 if(!S.micOk)return `<span class="mi">${I('micoff',24)}</span><span><b>Voz no disponible</b><small>Toca para activar el micrófono</small></span>`;
 return R.mic?`<span class="mi">${I('mic',24)}</span><span><b>Canal de voz activo</b><small>${sp.n==='Tú'?'Tú hablando':'Habla '+esc(sp.n)}</small></span><span class="bars"><i></i><i></i><i></i><i></i></span>`:`<span class="mi">${I('micoff',24)}</span><span><b>Micrófono apagado</b><small>Toca para volver a hablar</small></span>`}
function ridersSVG(){const R=S.run,route=RTS[S.sel.rt%3];
 const me=pointAt(route,R.p);let out=`<circle cx="${me[0]}" cy="${me[1]}" r="30" fill="rgba(47,217,141,.07)" stroke="#2FD98D" stroke-width=".8" stroke-dasharray="3 3" opacity=".7"/>`;
 let lagName=null;
 RIDERS.forEach(r=>{const off=r.lag?r.off-R.drift:r.off;const pt=pointAt(route,R.p+off);const d=Math.hypot(pt[0]-me[0],pt[1]-me[1]);const out_=d>30;if(out_&&r.lag)lagName=r.n;
   if(r.n==='Tú'){out+=`<circle class="pulse" cx="${pt[0]}" cy="${pt[1]}" r="8" fill="none" stroke="#2FD98D" stroke-width="1.5"/><circle cx="${pt[0]}" cy="${pt[1]}" r="8" fill="#2FD98D" stroke="#0F1714" stroke-width="2"/><text x="${pt[0]}" y="${pt[1]+2.6}" text-anchor="middle" font-size="7" font-weight="700" fill="#03150C" font-family="Arial">Tú</text>`}
   else{const t=TINTS[hash(r.n)%TINTS.length];out+=`<circle cx="${pt[0]}" cy="${pt[1]}" r="7" fill="${out_?'#FF9500':'#fff'}" stroke="#0F1714" stroke-width="2"/><text x="${pt[0]}" y="${pt[1]+2.4}" text-anchor="middle" font-size="6.5" font-weight="700" fill="#10151A" font-family="Arial">${ini(r.n)}</text>`}});
 return [out,lagName]}
function hudTick(){const R=S.run;if(!R||S.screen!=='hud')return;
 if(R.p<1){R.p=Math.min(1,R.p+.0009);R.drift=Math.min(.14,R.drift+.00022)}
 else if(!R.arrived){R.arrived=true;R.chip={g:1,t:'Llegaron al destino. Cuando todos estén, finaliza la rodada.'}}
 const [svg,lag]=ridersSVG();const g=$('#riders');if(g)g.innerHTML=svg;const me=pointAt(RTS[S.sel.rt%3],R.p);const sv=document.querySelector('.hudmap>svg');if(sv)sv.setAttribute('viewBox',(me[0]-60)+' '+(me[1]-62)+' 120 124');
 const el=Math.floor((Date.now()-R.t0)/1000);$('#hclock').textContent=fmtT(el);$('#hspd').textContent=R.arrived?'0 km/h':(58+Math.round(Math.sin(el/3)*6))+' km/h';
 let chip=R.banner&&Date.now()<R.banner.until?R.banner:(lag&&!R.arrived?{t:first(lag)+' se está quedando atrás. Baja el ritmo.'}:R.chip);
 const ch=$('#hchip');if(ch){const html=chip?`<div class="chipf ${chip.g?'g':''}" style="${chip.color?'background:'+chip.color+';color:'+(chip.dk||'#10151A'):''}">${I(chip.ic||'warn',20)}<span>${esc(chip.t)}</span></div>`:'';if(ch.dataset.h!==html){ch.innerHTML=html;ch.dataset.h=html}}
 if(el%5===0||!R._v){const v=$('#hvoice');if(v){R.speak=(Math.floor(el/5))%RIDERS.length;const h=voiceHTML();if(v.dataset.h!==h){v.innerHTML=h;v.dataset.h=h}}R._v=1}
 if(!R.incomingDone&&el>=14){R.incomingDone=true;R.banner={t:'Andrés F. · Parada técnica. Está a 300 m atrás.',ic:'wrench',color:'#FF9500',until:Date.now()+8000};beep(660,.25);buzz()}
}
AFTER.hud=()=>{if(!S.run)startRun();const R=S.run;R._v=0;const v=$('#hvoice');v.innerHTML=voiceHTML();v.dataset.h=voiceHTML();hudTick();every(hudTick,120)};

function showAlert(k){const a=ALERTS[k],R=S.run;R.alerts.push({k,t:Date.now()});
 R.banner={t:'Enviaste: '+a.t,ic:a.ic,color:a.k,dk:a.kt,until:Date.now()+7000};
 beep(k==='peligro'?1000:760,.3);buzz();say(a.say);
 const o=$('#ov');o.hidden=false;o.innerHTML=`<div class="ovl" style="--k:${a.k};--kt:${a.kt}" role="alertdialog" aria-live="assertive">
  <div class="big"><svg class="rg" viewBox="0 0 200 200"><circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="8"/><circle class="ringc" cx="100" cy="100" r="90" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round" stroke-dasharray="565" transform="rotate(-90 100 100)"/></svg><div class="core pop">${I(a.ic,64,2)}</div></div>
  <h2 id="alh">Enviando alerta…</h2><p><b>${a.t}</b></p>
  <p style="display:flex;align-items:center;gap:10px;justify-content:center"><span class="bars"><i></i><i></i><i></i><i></i></span>Reproduciendo aviso por el canal de voz</p>
  <p class="small" id="alp" style="color:#BFD0C7">Compartiendo tu ubicación con el grupo.</p>
  <button class="cancel" data-act="cancelAlert">Fue un error · Cancelar alerta</button></div>`;
 clearTimeout(showAlert.t);clearTimeout(showAlert.t2);
 /* Estados del flujo real: enviando -> entregada. Aquí la entrega se simula; con backend se confirma por servidor. */
 showAlert.t2=setTimeout(()=>{const h=$('#alh'),p=$('#alp');if(h)h.textContent='Alerta entregada';if(p)p.textContent='Llegó a '+(RIDERS.length-1)+' compañeros. Se cierra sola en unos segundos.'},1200);
 showAlert.t=setTimeout(hideOv,5000)}

/* ----- resumen ----- */
function stats(){const r=S.sel;const avg=44+(r.id*3)%9;const min=Math.round(r.km/avg*60+14);return{km:r.km,time:Math.floor(min/60)+'h '+pad(min%60)+'m',avg,paradas:1+(S.run?S.run.alerts.filter(a=>a.k!=='peligro').length:1)}}
SCR.resumen=()=>{const r=S.sel,s=stats();const others=r.part.filter(n=>n!=='Tú');
 return `<div class="scr light"><div class="body" style="padding-top:22px"><div><span class="host" style="margin-bottom:8px">${vb()}Rodada completada</span><h1 class="t">¡Buena rodada!</h1><p class="lead" style="margin-top:4px">${esc(r.name)}</p></div>
 <div class="map" style="height:200px;border-radius:22px;flex:none">${mapSVG(RTS[r.rt%3],false)}</div>
 <div class="stats"><div class="stat"><b>${s.km} km</b><span>Recorridos</span></div><div class="stat"><b>${s.time}</b><span>En ruta</span></div><div class="stat"><b>${s.avg}</b><span>km/h promedio</span></div></div>
  ${awardHTML()}
 <div class="fact" style="display:flex;align-items:center;justify-content:space-between"><div><b>${others.length+1} participantes</b><span>${s.paradas} ${s.paradas===1?'parada':'paradas'} en el camino</span></div>${avs(r.part,4)}</div>
 </div><div class="foot"><button class="btn" data-act="go" data-to="calif">Calificar al parche</button><button class="btn ghost" data-act="shareSum">${I('share',20)}Compartir resumen</button></div></div>`};
SCR.calif=()=>{const r=S.sel;const others=r.part.filter(n=>n!=='Tú').slice(0,5);
 const row=(n,k,l)=>`<div class="rr"><span>${l}</span><span class="stars" role="group" aria-label="${l} de ${esc(n)}">${[1,2,3,4,5].map(i=>`<button class="${(S.rate[n+k]||0)>=i?'f':''}" data-act="star" data-n="${esc(n)}" data-k="${k}" data-v="${i}" aria-label="${i} de 5">${I('star',26)}</button>`).join('')}</span></div>`;
 return `<div class="scr light">${hdr('','resumen')}<div class="body"><h1 class="t">Califica al parche</h1><p class="lead">Tu opinión mantiene las rodadas seguras. Solo califica quien rodó contigo.</p>
 ${others.map(n=>`<div class="rate"><div style="display:flex;align-items:center;gap:12px">${av(n)}<b>${esc(n)}</b></div>${row(n,'c','Conducta en ruta')}${row(n,'p','Puntualidad')}</div>`).join('')}
 </div><div class="foot"><button class="btn" data-act="sendRate">Enviar calificación</button><button class="btn link" data-act="skipRate">Omitir por ahora</button></div></div>`};

/* ================= capas ================= */
function optSheet(title,opts,cur,key){openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="sheetp sheet" role="dialog" aria-label="${title}"><div class="grab"></div><h2 class="t">${title}</h2>${[['','Todos'],...opts.map(o=>[o,o])].map(([v,l])=>`<button class="optrow" role="radio" aria-checked="${(cur||'')===v}" data-act="setF" data-key="${key}" data-v="${esc(v)}">${key==='cc'&&v?l+' cc':l}${(cur||'')===v?I('check',22,3):''}</button>`).join('')}</div>`)}

function composeSheet(){const C=S.com,D=C.draft;
  openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="sheetp sheet" role="dialog" aria-label="Nueva publicación"><div class="grab"></div><h2 class="t">Nueva publicación</h2>
  <div class="chips" role="group" aria-label="Tema">${Object.entries(TEMAS).map(([k,t])=>`<button class="chip" aria-pressed="${D.tema===k}" data-act="ctemaD" data-v="${k}">${t.f}</button>`).join('')}</div>
  <textarea id="ctxt" class="ta" maxlength="280" aria-label="Publicación" placeholder="${esc(D.tema?TEMAS[D.tema].ph:'Elige un tema y cuéntale a tu zona.')}">${esc(D.txt)}</textarea>
  ${D.tema==='video'?`<button class="btn ghost sm" style="width:100%" data-act="cvid">${I('play',18)}${D.video?'Video adjunto · 0:42 (quitar)':'Adjuntar video de tu rodada'}</button>`:''}
  ${C.err?`<div class="banner err">${I('warn',20)}<span>Elige un tema y escribe al menos 8 caracteres.</span></div>`:''}
  <button class="btn" data-act="cpub">Publicar</button></div>`)}
function peekSheet(n){const x=xpOfN(n),i=xpInfo(x),bs=badgesOf(n).map(k=>BADGES.find(b=>b.k===k));
  openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="sheetp sheet" role="dialog" aria-label="Perfil de ${esc(n)}"><div class="grab"></div>
  <div style="display:flex;align-items:center;gap:12px">${av(n)}<div><h2 class="t" style="font-size:20px">${esc(n)}</h2><span class="small">Nivel ${i.l+1} · ${i.name} · ${x} XP</span></div></div>
  <div class="meter" role="progressbar" aria-label="Experiencia" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${i.pct}"><i style="width:${i.pct}%"></i></div>
  <div class="lab">Insignias · ${bs.length}</div>${bs.length?`<div style="display:flex;flex-wrap:wrap;gap:8px">${bs.map(b=>`<div style="display:flex;flex-direction:column;align-items:center;width:62px">${badgeSVG(b,true,48)}<span class="small" style="font-size:11px">${b.n}</span></div>`).join('')}</div>`:'<p class="lead">Todavía no tiene insignias.</p>'}
  <button class="btn ghost" data-act="closeLayer">Cerrar</button></div>`)}
function badgeSheet(k){const b=BADGES.find(x=>x.k===k),o=S.badges.includes(k);
  openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="sheetp sheet" role="dialog" aria-label="Insignia ${b.n}"><div class="grab"></div>
  <div style="display:flex;align-items:center;gap:14px">${badgeSVG(b,o,84)}<div><h2 class="t">${b.n}</h2><span class="small">${o?'Insignia ganada':'Todavía no la tienes'}</span></div></div>
  <p class="lead">${o?'La ganaste rodando hasta '+b.n+'. Ya cuenta en tu nivel.':'Rueda hasta '+b.n+' en una rodada de '+b.km+' km o más para ganarla.'}</p>
  <p class="small" style="margin:0">Una insignia suma ${XP_INSIGNIA} XP. Una rodada normal suma ${XP_RODADA} XP.</p>
  <button class="btn ghost" data-act="closeLayer">Cerrar</button></div>`)}

/* ================= acciones ================= */
const ACT={
 go:d=>go(d.to),
 start:()=>go('reg'),
 toHome:()=>{S.tourOffer=true;go('home')},
 tourStart:()=>Tour.start(),
 toast:d=>toast(d.m),
 closeLayer:()=>closeLayer(),
 login:()=>{const l=S.login;if(l.email.trim().toLowerCase()==='camilo@rodapp.co'&&l.pass==='123456'){S.errs={};fixedUser();S.tourOffer=true;go('home')}else{S.errs={login:1};render()}},
 exp:d=>{S.reg.exp=d.v;delete S.errs.exp;render()},
 disp:d=>{const a=S.reg.disp,i=a.indexOf(d.v);i<0?a.push(d.v):a.splice(i,1);render()},
 regNext:()=>{const r=S.reg,e={};if(r.nombre.trim().length<3)e.nombre=1;if(!/^\S+@\S+\.\S+$/.test(r.correo))e.correo=1;if(r.pass.length<6)e.pass=1;if(!r.exp)e.exp=1;S.errs=e;
   if(Object.keys(e).length)return render();S.user={nombre:r.nombre.trim(),exp:r.exp};S.kyc={step:0,front:'idle',back:'idle',selfie:'idle',failedOnce:false,msg:''};go('kyc')},
 cap:d=>{const k=d.k,K=S.kyc;if(K[k]==='loading'||K[k]==='ok')return;K[k]='loading';render();
   later(()=>{if(S.demo.fail&&!K.failedOnce){K.failedOnce=true;K[k]='error';K.msg=k==='selfie'?'No vimos tu cara completa. Intenta de nuevo.':'No pudimos leer tu documento. Busca más luz y evita reflejos.'}else K[k]='ok';render()},k==='selfie'?1800:1200)},
 kycBack:()=>{S.kyc.step=0;render()},
 vehBack:()=>{S.kyc.step=1;go('kyc')},
 kycNext:()=>{if(S.kyc.step===0){S.kyc.step=1;render()}else go('veh')},
 vcc:d=>{S.veh.cc=d.v;delete S.errs.cc;render()},
 vtipo:d=>{S.veh.tipo=d.v;render()},
 bt:()=>{S.veh.bt=!S.veh.bt;render()},
 vehNext:()=>{const v=S.veh,e={};if(!v.cc)e.cc=1;if(!v.marca)e.marca=1;if(!/^[A-Z]{3}\d{2}[A-Z]$/.test(v.placa))e.placa=1;S.errs=e;if(Object.keys(e).length)return render();S.verified=true;go('done')},
 filter:d=>{d.w==='cc'?optSheet('Cilindraje',['<200','200–500','>500'],S.f.cc,'cc'):optSheet('Fecha',FECHAS,S.f.fecha,'fecha')},
 setF:d=>{S.f[d.key]=d.v||null;closeLayer();render()},
 zona:d=>{S.f.zona=d.v||null;render()},
 clearF:()=>{S.f={cc:null,zona:null,fecha:null};render()},
 open:d=>{S.sel=S.rides.find(r=>r.id==d.id);go('detalle')},
 joinAsk:()=>{const r=S.sel;openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="dlg sheet" role="dialog" aria-label="Confirmar asistencia"><span class="ic">${I('flag',26)}</span><h2 class="t">¿Confirmas tu asistencia?</h2><p>${esc(r.name)}<br>${r.fecha}, ${r.hora}<br>${esc(r.punto)}</p><button class="btn" data-act="join">Confirmar</button><button class="btn ghost" data-act="closeLayer">Cancelar</button></div>`)},
 join:()=>{const r=S.sel;if(!r.part.includes('Tú'))r.part.push('Tú');closeLayer();toast('Estás dentro de la rodada');initLobby(false);go('lobby')},
 enterLobby:()=>{if(!S.lobby||S.lobby.rid!==S.sel.id){initLobby(S.sel.host==='Tú');S.lobby.rid=S.sel.id}go('lobby')},
 ready:()=>{const L=S.lobby;L.ready=!L.ready;const me=L.ppl.find(p=>p.n==='Tú');me.st=L.ready?'ready':'conf';
   refreshLobby();const b=$('#rbtn');b.textContent=L.ready?'Listo para salir · toca para cancelar':'Estoy listo para salir';
   if(L.ready){later(()=>{if(L.started||!L.ready)return;L.started=true;L.msgs.push({n:S.sel.host,t:'Arrancamos. Todos al punto de encuentro.'});beep(740,.2);render()},3500)}},
 hostStart:()=>{S.lobby.started=true;go('enroute')},
 toEnroute:()=>go('enroute'),
 leave:()=>{const r=S.sel;const i=r.part.indexOf('Tú');if(i>=0&&r.host!=='Tú')r.part.splice(i,1);if(r.host==='Tú')S.rides=S.rides.filter(x=>x!==r);S.lobby=null;toast(r.host==='Tú'?'Rodada cancelada':'Saliste de la rodada');go('home')},
 micAsk:()=>openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="dlg sheet" role="dialog" aria-label="Permiso de micrófono"><span class="ic">${I('mic',26)}</span><h2 class="t">¿Activar el canal de voz?</h2><p>RodApp usa el micrófono para que hables con tu grupo sin soltar el manubrio.</p><button class="btn" data-act="micYes">Permitir</button><button class="btn ghost" data-act="micNo">No permitir</button></div>`),
 micYes:()=>{S.micOk=true;closeLayer();startRun();go('hud')},
 micNo:()=>{S.micOk=false;closeLayer();startRun();S.run.mic=false;go('hud')},
 mute:()=>{const R=S.run;if(!S.micOk){S.micOk=true;R.mic=true;toast('Micrófono activado')}else R.mic=!R.mic;R._v=0;const v=$('#hvoice');v.classList.toggle('off',!R.mic);v.setAttribute('aria-pressed',R.mic);v.innerHTML=voiceHTML();v.dataset.h=voiceHTML()},
 alert:d=>showAlert(d.k),
 cancelAlert:()=>{clearTimeout(showAlert.t);clearTimeout(showAlert.t2);hideOv();const R=S.run;R.alerts.pop();R.banner={t:'Alerta cancelada. Avisamos al grupo: falsa alarma.',g:1,color:'#2FD98D',ic:'check',until:Date.now()+5000}},
 endAsk:()=>openLayer(`<div class="scrim" data-act="closeLayer"></div><div class="dlg sheet" role="dialog"><h2 class="t">¿Finalizar la rodada para todo el grupo?</h2><p>Si ya llegaron al destino, finaliza para ver el resumen.</p><button class="btn" data-act="end">Sí, finalizar</button><button class="btn ghost" data-act="closeLayer">Cancelar</button></div>`),
 end:()=>{closeLayer();awardRide();go('resumen')},
 cset:d=>{S.cr[d.k]=d.v;delete S.errs[d.k];render()},
 cruta:d=>{const i=+d.v,R=RUTAS[i];S.cr.ruta=i;if(!S.cr.nombre||RNAMES.includes(S.cr.nombre))S.cr.nombre=R.n;S.cr.zona=R.z;S.cr.punto=SPOTS[R.p];delete S.errs.zona;delete S.errs.punto;render()},
 cupo:d=>{S.cr.cupo=Math.min(12,Math.max(2,S.cr.cupo+ +d.d));render()},
 publish:()=>{const c=S.cr,e={};['nombre','cc','zona','fecha','hora','punto'].forEach(k=>{if(!c[k]||(k==='nombre'&&!c.nombre.trim()))e[k]=1});S.errs=e;if(Object.keys(e).length){render();const b=$('.body');b&&b.scrollTo({top:0,behavior:'smooth'});return}
   const i=c.ruta==null?0:c.ruta;const r={id:Date.now()%100000,name:c.nombre.trim(),zona:c.zona,cc:c.cc,nivel:c.nivel,fecha:c.fecha,hora:c.hora,cupo:c.cupo,part:['Tú'],punto:c.punto,km:RKM[i],rt:i,host:'Tú',club:'Tu rodada',ver:true};
   S.rides.unshift(r);S.sel=r;S.cr={nombre:'',ruta:null,cc:null,zona:null,nivel:'Intermedio',fecha:null,hora:null,cupo:8,punto:null};initLobby(true);S.lobby.rid=r.id;toast('Rodada publicada');go('lobby')},
 shareSum:async()=>{const s=stats();const t=`Rodé ${s.km} km con RodApp: ${S.sel.name}.`;try{if(navigator.share){await navigator.share({text:t});return}}catch(e){}toast('Resumen copiado para compartir')},
 star:d=>{S.rate[d.n+d.k]=+d.v;render()},
 sendRate:()=>{S.award=null;S.rate={};S.run=null;S.lobby=null;const r=S.sel;const i=r.part.indexOf('Tú');if(i>=0)r.part.splice(i,1);toast('Gracias. Tu parche queda más seguro');go('home')},
 skipRate:()=>{S.award=null;S.rate={};S.run=null;S.lobby=null;go('home')},
  cvista:d=>{S.com.vista=d.v;if(d.v!=='tu')S.com.gfilter=null;render()},
  czona:d=>{S.zonaMia=d.v;render()},
  gjoin:d=>{const G=S.com.grupos,i=G.indexOf(d.k);i<0?G.push(d.k):G.splice(i,1);toast(i<0?'Ahora sigues este grupo':'Dejaste de seguir el grupo');render()},
  gver:d=>{S.com.gfilter=d.k;S.com.vista='tu';S.com.tema=null;render()},
  gclear:()=>{S.com.gfilter=null;render()},
  conf:d=>{const C=S.com;C.conf[d.id]=!C.conf[d.id];render()},
  report:()=>toast('Gracias. Revisaremos esta publicación'),
  ctema:d=>{S.com.tema=d.v||null;render()},
  like:d=>{const C=S.com,p=C.posts.find(x=>x.id==d.id),on=!C.liked[p.id];C.liked[p.id]=on;C.gusta[p.tema]=Math.max(0,(C.gusta[p.tema]||0)+(on?1:-1));render()},
  ccm:d=>{S.com.open=S.com.open==d.id?null:+d.id;render()},
  compose:()=>{S.com.err=false;composeSheet()},
  ctemaD:d=>{const D=S.com.draft,t=$('#ctxt');if(t)D.txt=t.value;D.tema=d.v;S.com.err=false;composeSheet()},
  cvid:()=>{const D=S.com.draft,t=$('#ctxt');if(t)D.txt=t.value;D.video=!D.video;composeSheet()},
  cpub:()=>{const C=S.com,D=C.draft,t=$('#ctxt');if(t)D.txt=t.value;const tx=D.txt.trim();
    if(!D.tema||tx.length<8){C.err=true;composeSheet();return}
    C.posts.unshift(Object.assign({id:Date.now()%1000000,n:'Tú',zona:S.zonaMia,tema:D.tema,ago:'Ahora',t:tx,likes:0,conf:0,c:[]},D.tema==='video'&&D.video?{rt:1,dur:'0:42'}:{}));
    C.draft={tema:null,txt:'',video:false};C.err=false;C.tema=null;closeLayer();toast('Publicación enviada a tu zona');render()},
  peek:d=>peekSheet(d.n),
  badge:d=>badgeSheet(d.k)
};
document.addEventListener('submit',e=>{const f=e.target.closest('[data-cform]');if(!f)return;e.preventDefault();
  const C=S.com,p=C.posts.find(x=>x.id==f.dataset.cform),t=f.querySelector('input').value.trim();if(!p||!t)return;
  p.c.push({n:'Tú',t});C.gusta[p.tema]=(C.gusta[p.tema]||0)+1;C.open=p.id;render()});
document.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t||t.disabled)return;const f=ACT[t.dataset.act];if(f)f(t.dataset,t,e)});
document.addEventListener('input',e=>{const t=e.target;const b=t.dataset&&t.dataset.bind;if(!b)return;if(t.dataset.up){t.value=t.value.toUpperCase().replace(/[^A-Z0-9]/g,'')}
 const [o,k]=b.split('.');S[o][k]=t.value;if(t.dataset.k){delete S.errs[t.dataset.k];const f=t.closest('.field');f&&f.classList.remove('err')}
 if(o==='login'){delete S.errs.login;document.querySelectorAll('.field.err').forEach(x=>x.classList.remove('err'))}});
document.addEventListener('change',e=>{const t=e.target;if(t.tagName==='SELECT'&&t.dataset.bind){const [o,k]=t.dataset.bind.split('.');S[o][k]=t.value;delete S.errs[t.dataset.k];t.closest('.field').classList.remove('err')}});

AFTER.home=()=>{if(S.tourOffer){S.tourOffer=false;later(()=>Tour.start(),400)}};
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!(window.Tour&&Tour.active)&&!$('#layer').hidden)closeLayer()});
render();
