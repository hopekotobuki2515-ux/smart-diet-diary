(()=>{
  function enterDiaryNow(e){
    const target=e?.target?.closest?.('#enterDiary');
    if(!target) return;
    if(e){
      try{e.preventDefault()}catch(_){ }
      try{e.stopPropagation()}catch(_){ }
      try{e.stopImmediatePropagation()}catch(_){ }
    }
    const landing=document.getElementById('landingPage');
    if(landing){
      landing.classList.add('hidden');
      landing.style.display='none';
      landing.style.pointerEvents='none';
      landing.setAttribute('aria-hidden','true');
    }
    try{document.documentElement.scrollTop=0}catch(_){ }
    try{document.body.scrollTop=0}catch(_){ }
    try{window.scrollTo(0,0)}catch(_){ }
    try{if(typeof window.switchView==='function') window.switchView('todayView')}catch(_){ }
  }

  document.addEventListener('pointerup',enterDiaryNow,true);
  document.addEventListener('click',enterDiaryNow,true);
  document.addEventListener('touchend',enterDiaryNow,{capture:true,passive:false});

  function armButton(){
    const btn=document.getElementById('enterDiary');
    if(!btn) return;
    btn.style.pointerEvents='auto';
    btn.style.touchAction='manipulation';
    btn.style.position='relative';
    btn.style.zIndex='1002';
    btn.onclick=enterDiaryNow;
  }

  armButton();
  requestAnimationFrame(armButton);
  setTimeout(armButton,250);
})();