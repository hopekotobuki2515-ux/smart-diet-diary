(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .breakGroup{grid-template-columns:120px 1fr!important}
    .breakToggle{display:none!important}
    .subHint{grid-column:2/3!important}
    .breakItems{gap:10px!important;padding:10px 10px 12px!important;align-items:stretch!important}
    .subItem{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-width:82px!important;min-height:136px!important;padding:10px 8px 62px!important;text-align:center!important;overflow:visible!important}
    .subItem .name{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:34px!important;text-align:center!important;line-height:1.25!important}
    .subItem .num{position:static!important;display:flex!important;justify-content:center!important;align-items:baseline!important;gap:2px!important;width:100%!important;min-height:30px!important;height:auto!important;margin:6px 0 0!important;line-height:1!important;text-align:center!important;font-variant-numeric:tabular-nums!important}
    .breakGroup:not(.g4) .subItem .unit{display:none!important}
    .breakGroup:not(.g4) .subItem .num{display:flex!important;justify-content:center!important;align-items:center!important}
    .subItem .minus{position:absolute!important;left:50%!important;bottom:8px!important;transform:translateX(-50%)!important;width:46px!important;height:46px!important;line-height:46px!important;font-size:25px!important;background:#fff!important;border:2px solid currentColor!important;box-shadow:0 2px 7px rgba(0,0,0,.08)!important;touch-action:manipulation!important;z-index:2!important}
    .breakGroup.g1 .subItem .minus{color:var(--c1)!important}
    .breakGroup.g2 .subItem .minus{color:var(--c2)!important}
    .breakGroup.g3 .subItem .minus{color:var(--c3)!important}
    .breakGroup.g4 .subItem .minus{color:var(--c4)!important}
    .subItem .minus:active{transform:translateX(-50%) scale(.94)!important}
    .breakHead b{font-size:21px!important;line-height:1.05!important}
    .breakHead span{font-size:12px!important;margin-top:5px!important}
    .breakHead .icons{font-size:26px!important;line-height:1.15!important;margin-top:7px!important;letter-spacing:2px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:6px!important}
    .groupCard .emoji{font-size:24px!important;line-height:1.15!important;margin-top:4px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important}
    .foodOilIcon{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:27px!important;height:27px!important;vertical-align:middle!important}
    .foodOilIcon svg{display:block!important;width:100%!important;height:100%!important}
    #meals .g3box{display:none!important}
    @media (max-width:390px){
      .breakGroup{grid-template-columns:112px 1fr!important}
      .subItem{min-width:78px!important;min-height:138px!important;padding-bottom:64px!important}
      .subItem .minus{width:48px!important;height:48px!important;line-height:48px!important}
      .breakHead b{font-size:20px!important}
      .breakHead .icons{font-size:25px!important}
    }
  `;
  document.head.appendChild(style);

  const oilSvg=`<span class="foodOilIcon" aria-label="食用油"><svg viewBox="0 0 40 40" role="img"><path d="M16 4h8v5l3 3v22a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V12l3-3V4z" fill="#f5c74d" stroke="#9a6b18" stroke-width="1.6"/><path d="M16 4h8" stroke="#6f7f8b" stroke-width="3" stroke-linecap="round"/><rect x="15.5" y="17" width="9" height="10" rx="2" fill="#fff7d4" stroke="#c99825" stroke-width="1"/><path d="M18 20c2-3 4-3 5 0-1 3-4 4-5 0z" fill="#f2a900"/></svg></span>`;

  function syncIcons(){
    try{
      document.querySelectorAll('.breakGroup.g2 .breakHead .icons,.groupCard.g2 .emoji').forEach(el=>{el.innerHTML='🐟 🥩 🫘';});
      document.querySelectorAll('.breakGroup.g4 .breakHead .icons,.groupCard.g4 .emoji').forEach(el=>{el.innerHTML=`🍚 ${oilSvg} 🥄`;});
    }catch(e){console.error('icon sync',e)}
  }

  function syncCompactG3(){
    try{
      if(typeof dayData!=='function') return;
      const d=dayData();
      const g=d.g3||{green:0,light:0,mush:0};
      const green=Math.max(0,Number(g.green)||0);
      const light=Math.max(0,Number(g.light)||0);
      const mush=Math.max(0,Number(g.mush)||0);
      const veg=green+light;
      document.querySelectorAll('.g3box .g3m').forEach(card=>{
        const label=(card.querySelector('small')?.textContent||'').trim();
        const value=card.querySelector('b');
        if(!value) return;
        if(label.includes('野菜合計')) value.textContent=`${veg}g`;
        else if(label.includes('緑黄色野菜')) value.textContent=`${green}g`;
        else if(label.includes('きのこ')||label.includes('海藻')) value.textContent=`${mush}g`;
      });
    }catch(e){console.error('g3 sync',e)}
  }

  function reorderDiary(){
    try{
      const mealsSection=document.getElementById('meals')?.closest('.section');
      const detailedG3=document.querySelector('#todayView .g3support')?.closest('.section');
      if(mealsSection&&detailedG3&&mealsSection.nextElementSibling!==detailedG3){
        mealsSection.insertAdjacentElement('afterend',detailedG3);
      }
    }catch(e){console.error('diary reorder',e)}
  }

  function syncUi(){syncCompactG3();syncIcons();reorderDiary();}

  if(typeof window.render==='function'){
    const baseRender=window.render;
    window.render=function(){
      const result=baseRender.apply(this,arguments);
      requestAnimationFrame(syncUi);
      return result;
    };
  }

  document.addEventListener('click',e=>{
    if(e.target.closest('[data-g3],#resetG3')) setTimeout(syncCompactG3,0);
  },true);

  syncUi();
})();
