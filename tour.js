'use strict';
/* RodApp · Recorrido guiado (spotlight)
   Oscurece todo lo que no se explica, resalta un elemento real de la app y muestra un mensaje corto.
   Depende de app.js: S, go, fixedUser, startRun, $, I. No guarda datos del usuario. */
const Tour=(()=>{
  const STEPS=[
    {scr:'home',intro:true,t:'¡Bienvenido a RodApp!',d:'Te mostramos la app en 1 minuto. Puedes salir cuando quieras.'},
    {scr:'home',sel:'#screen [data-tour="h-titulo"]',t:'Encuentra tu rodada',d:'Aquí aparecen las salidas de la ciudad y de la Sabana.'},
    {scr:'home',sel:'#screen [data-tour="h-filtros"]',t:'Filtra a tu medida',d:'Elige cilindraje, fecha y zona.'},
    {scr:'home',sel:'#screen .ride',t:'Cada rodada, clara',d:'Mira el nivel, los cupos y quién guía antes de unirte.'},
    {scr:'home',sel:'#screen .fab',t:'Crea la tuya',d:'¿No hay una para ti? Publica ruta, nivel y cupos.'},
    {scr:'home',sel:'#screen .tabs button:nth-child(2)',t:'Comunidad',d:'Avisos de la vía, grupos y rodadas de tu zona.'},
    {scr:'comunidad',sel:'#screen [data-tour="c-vistas"]',t:'Tu vista, tu zona, tus grupos',d:'Cambia entre lo que te interesa y lo que pasa cerca.'},
    {scr:'comunidad',sel:'#screen [data-tour="c-temas"]',t:'Avisos que ayudan',d:'Peligros, hurtos, normas y talleres. Confirma lo que veas en la vía.'},
    {scr:'hud',sel:'#screen .alerts',t:'Alerta de un toque',d:'En ruta, un toque avisa al grupo por voz. Sin escribir ni mirar.'},
    {scr:'perfil',sel:'#screen [data-tour="p-xp"]',t:'Tu progreso',d:'Cada rodada suma XP. Las rutas largas dan insignias.'},
    {scr:'home',final:true,t:'¡Listo para rodar!',d:'Busca tu primera rodada o crea la tuya.'}
  ];
  const TOTAL=STEPS.filter(s=>s.sel).length;
  let idx=0,active=false;

  /* Lleva la app a la pantalla que necesita el paso. No recarga si ya está en ella. */
  function prep(scr){
    if(scr==='home'){
      if(S.screen!=='home'){fixedUser();S.f={cc:null,zona:null,fecha:null};S.run=null;go('home')}
    }else if(scr==='comunidad'){
      if(S.screen!=='comunidad'){fixedUser();Object.assign(S.com,{vista:'tu',tema:null,gfilter:null,open:null});go('comunidad')}
    }else if(scr==='hud'){
      if(S.screen!=='hud'){fixedUser();S.sel=S.rides[0];S.micOk=true;startRun();go('hud')}
    }else if(scr==='perfil'){
      if(S.screen!=='perfil'){fixedUser();go('perfil')}
    }
  }

  /* Rectángulo del elemento relativo al marco del teléfono. */
  function rectOf(el){
    const ph=$('.phone'),pr=ph.getBoundingClientRect(),r=el.getBoundingClientRect();
    return{x:r.left-pr.left-ph.clientLeft,y:r.top-pr.top-ph.clientTop,w:r.width,h:r.height,W:ph.clientWidth,H:ph.clientHeight};
  }
  /* Si el elemento está dentro de una lista con scroll, lo trae a la vista. */
  function reveal(el){
    const b=el.closest('.body');if(!b)return;
    const br=b.getBoundingClientRect(),er=el.getBoundingClientRect();
    if(er.top<br.top+6||er.bottom>br.bottom-6){b.scrollTop+=(er.top-br.top)-Math.max(6,(br.height-er.height)/2)}
  }

  function cardHTML(st,n){
    const close=`<button class="tx" data-t="skip" aria-label="Salir del recorrido">Saltar</button>`;
    if(st.intro)return `<span class="tic" aria-hidden="true">${I('route',30,2.2)}</span>
      <h2 class="tt" id="tt">${st.t}</h2><p class="td" id="td">${st.d}</p>
      <div class="tbtns"><button class="tb pri" data-t="next">Empezar recorrido</button><button class="tb lnk" data-t="skip">Ahora no</button></div>`;
    if(st.final)return `<span class="tic" aria-hidden="true">${I('flag',30,2.2)}</span>
      <h2 class="tt" id="tt">${st.t}</h2><p class="td" id="td">${st.d}</p>
      <div class="tbtns"><button class="tb pri" data-t="next">Ver rodadas</button><button class="tb lnk" data-t="prev">Volver atrás</button></div>`;
    const seg=Array.from({length:TOTAL},(_,k)=>`<i class="${k<n?'on':''}"></i>`).join('');
    return `<div class="thead"><span class="tn">${n} de ${TOTAL}</span>${close}</div><div class="tseg" aria-hidden="true">${seg}</div>
      <h2 class="tt" id="tt">${st.t}</h2><p class="td" id="td">${st.d}</p>
      <div class="tbtns row"><button class="tb gho" data-t="prev">Anterior</button><button class="tb pri" data-t="next">Siguiente</button></div>`;
  }

  /* Posiciona el foco de luz y la tarjeta. No toca el foco del teclado. */
  function place(st){
    const root=$('#tour');if(!root||root.hidden)return;
    const spot=root.querySelector('.tspot'),card=root.querySelector('.tcard'),arr=card.querySelector('.tarr');
    const ph=$('.phone'),W=ph.clientWidth,H=ph.clientHeight;
    if(!st.sel){
      spot.className='tspot none';spot.style.cssText='left:50%;top:50%;width:0;height:0';
      arr.hidden=true;card.style.top=Math.max(14,(H-card.offsetHeight)/2)+'px';return;
    }
    const el=document.querySelector(st.sel);
    if(!el){spot.className='tspot none';arr.hidden=true;card.style.top=Math.max(14,(H-card.offsetHeight)/2)+'px';return}
    reveal(el);
    const r=rectOf(el),pad=6;
    const x=Math.max(4,r.x-pad),y=Math.max(4,r.y-pad);
    const w=Math.min(W-8-x,r.w+pad*2-(x-(r.x-pad))),h=Math.min(H-8-y,r.h+pad*2);
    spot.className='tspot';spot.style.cssText=`left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    const ch=card.offsetHeight,gap=16,below=H-(y+h)-gap,above=y-gap;
    let top,dir;
    if(below>=ch){top=y+h+gap;dir='up'}else if(above>=ch){top=y-gap-ch;dir='down'}else{top=H-ch-14;dir=''}
    card.style.top=top+'px';
    if(dir){arr.hidden=false;arr.className='tarr '+dir;const cw=card.offsetWidth,cx=x+w/2-7;arr.style.left=Math.min(cw-34,Math.max(16,cx-parseFloat(getComputedStyle(card).left||0)))+'px'}
    else arr.hidden=true;
  }

  function show(i){
    idx=Math.max(0,Math.min(STEPS.length-1,i));
    const st=STEPS[idx];
    prep(st.scr);
    const n=STEPS.slice(0,idx+1).filter(s=>s.sel).length;
    const root=$('#tour');
    root.hidden=false;$('#screen').inert=true;
    root.innerHTML=`<div class="tblock"></div><div class="tspot none" aria-hidden="true"></div>
      <div class="tcard" role="dialog" aria-modal="true" aria-labelledby="tt" aria-describedby="td"><span class="tarr" hidden></span>${cardHTML(st,n)}</div>`;
    place(st);
    const f=root.querySelector('[data-t="next"]');if(f)try{f.focus({preventScroll:true})}catch(e){}
  }

  function stop(silent){
    if(!active)return;
    active=false;const root=$('#tour');root.hidden=true;root.innerHTML='';$('#screen').inert=false;
    if(!silent){
      if(S.screen==='hud')S.run=null;
      if(S.screen!=='home')go('home');
    }
  }
  function start(i=0){active=true;show(i)}
  function next(){if(idx>=STEPS.length-1){stop();return}show(idx+1)}
  function prev(){if(idx>0)show(idx-1)}

  document.addEventListener('click',e=>{
    const b=e.target.closest('#tour [data-t]');if(!b)return;
    const a=b.dataset.t;if(a==='next')next();else if(a==='prev')prev();else if(a==='skip')stop();
  });
  document.addEventListener('keydown',e=>{
    if(!active)return;
    if(e.key==='Escape'){e.preventDefault();stop()}
    else if(e.key==='ArrowRight'){e.preventDefault();next()}
    else if(e.key==='ArrowLeft'){e.preventDefault();prev()}
    else if(e.key==='Tab'){ /* el foco se queda dentro de la tarjeta */
      const f=[...document.querySelectorAll('#tour .tcard button')];if(!f.length)return;
      const a=document.activeElement,i=f.indexOf(a);
      if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}
      else if(!e.shiftKey&&(i===f.length-1||i<0)){e.preventDefault();f[0].focus()}
    }
  });
  window.addEventListener('resize',()=>{if(active)place(STEPS[idx])});

  return{start,stop,next,prev,get active(){return active},get steps(){return STEPS.length}};
})();
