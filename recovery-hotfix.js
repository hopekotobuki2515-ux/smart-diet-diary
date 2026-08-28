(()=>{
  if(window.__recoveryHotfixLoaded) return;
  window.__recoveryHotfixLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    .breakGroup{grid-template-columns:120px 1fr!important}
    .breakToggle{display:none!important}
    .subHint{grid-column:2/3!important}
    .breakItems{gap:10px!important;padding:10px 10px 12px!important;align-items:stretch!important}
    .subItem{position:relative!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-width:82px!important;min-height:136px!important;padding:10px 8px 62px!important;text-align:center!important;overflow:visible!important}
    .subItem .name{display:flex!important;align-items:center!important;justify-content:center!important;width:100%!important;min-height:34px!important;text-align:center!important;line-height:1.25!important}
    .subItem .num{position:static!important;display:flex!important;justify-content:center!important;align-items:center!important;gap:2px!important;width:100%!important;min-height:30px!important;margin:6px 0 0!important;line-height:1!important;text-align:center!important;font-variant-numeric:tabular-nums!important}
    .breakGroup:not(.g4) .subItem .unit{display:none!important}
    .subItem .minus{position:absolute!important;left:50%!important;bottom:8px!important;transform:translateX(-50%)!important;width:46px!important;height:46px!important;line-height:42px!important;font-size:25px!important;background:#fff!important;border:2px solid currentColor!important;border-radius:50%!important;box-shadow:0 2px 7px rgba(0,0,0,.08)!important;z-index:2!important}
    .breakGroup.g1 .subItem .minus{color:#2f7ed8!important}.breakGroup.g2 .subItem .minus{color:#e94f74!important}.breakGroup.g3 .subItem .minus{color:#5aa33b!important}.breakGroup.g4 .subItem .minus{color:#f39a1f!important}
    .groupSummary{align-items:stretch!important}
    .groupCard{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-start!important;min-height:178px!important;padding:10px 3px!important}
    .groupCard strong{min-height:22px!important;display:flex!important;align-items:center!important;justify-content:center!important}
    .groupCard small{min-height:28px!important;display:flex!important;align-items:center!important;justify-content:center!important;margin:3px 0 5px!important;text-align:center!important}
    .groupCard .emoji{font-size:24px!important;line-height:1.15!important;margin-top:2px!important;min-height:58px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;flex-wrap:wrap!important}
    .groupCard b{margin-top:auto!important;min-height:24px!important;display:flex!important;align-items:flex-end!important;justify-content:center!important;white-space:nowrap!important}
    .foodOilIcon{display:inline-flex!important;align-items:center!important;justify-content:center!important;width:27px!important;height:27px!important;vertical-align:middle!important}
    .foodOilIcon svg{display:block!important;width:100%!important;height:100%!important}
    #meals .g3box{display:none!important}
    #guideView .repairFoodGuideBox{margin:12px 0 14px!important;padding:12px!important;border:1px solid #efc7a4!important;background:#fff7ef!important;border-radius:14px!important}
    #guideView .repairFoodGuideBox .repairFoodGuideTitle{font-size:14px!important;font-weight:900!important;color:#6a5140!important;margin:0 0 7px!important}
    #guideView .repairFoodGuideBox .fdg-launch{margin:0!important;background:#f47a2a!important;color:#fff!important;border:0!important;border-radius:12px!important;min-height:46px!important;font-size:13px!important;box-shadow:0 3px 10px rgba(244,122,42,.18)!important}
    @media(max-width:390px){.breakGroup{grid-template-columns:112px 1fr!important}.subItem{min-width:78px!important;min-height:138px!important;padding-bottom:64px!important}.subItem .minus{width:48px!important;height:48px!important;line-height:44px!important}.groupCard{min-height:174px!important}.groupCard .emoji{min-height:56px!important;font-size:23px!important}}
  `;
  document.head.appendChild(style);

  const oilSvg=`<span class="foodOilIcon" aria-label="食用油"><svg viewBox="0 0 40 40" role="img"><path d="M16 4h8v5l3 3v22a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3V12l3-3V4z" fill="#f5c74d" stroke="#9a6b18" stroke-width="1.6"/><path d="M16 4h8" stroke="#6f7f8b" stroke-width="3" stroke-linecap="round"/><rect x="15.5" y="17" width="9" height="10" rx="2" fill="#fff7d4" stroke="#c99825" stroke-width="1"/><path d="M18 20c2-3 4-3 5 0-1 3-4 4-5 0z" fill="#f2a900"/></svg></span>`;

  function fixIcons(){
    document.querySelectorAll('.breakGroup.g2 .breakHead .icons,.groupCard.g2 .emoji').forEach(el=>{if(el.textContent!=='🐟 🥩 🫘')el.innerHTML='🐟 🥩 🫘';});
    document.querySelectorAll('.breakGroup.g4 .breakHead .icons,.groupCard.g4 .emoji').forEach(el=>{if(!el.querySelector('.foodOilIcon'))el.innerHTML=`🍚 ${oilSvg} 🥄`;});
  }

  function fixNav(){
    const names={todayView:'ダイアリー',healthView:'体調',calendarView:'カレンダー',progressView:'進捗',settingsView:'設定',foodSearchView:'食品検索'};
    document.querySelectorAll('.footnav button[data-view]').forEach(btn=>{
      const name=names[btn.dataset.view];if(!name)return;
      const label=btn.querySelector('.navLabel');
      if(label&&label.textContent!==name)label.textContent=name;else if(!label&&btn.textContent!==name)btn.textContent=name;
      btn.setAttribute('aria-label',name);
    });
  }

  function exposeFoodGuide(){
    const wrap=document.querySelector('#guideView .guideWheelWrap');
    const launch=document.querySelector('#guideView .fdg-launch');
    if(!wrap||!launch)return;
    let box=wrap.querySelector('.repairFoodGuideBox');
    if(!box){box=document.createElement('div');box.className='repairFoodGuideBox';box.innerHTML='<div class="repairFoodGuideTitle">食材が何群か迷ったときはこちら</div>';const wheel=wrap.querySelector('.guideWheel');if(wheel)wrap.insertBefore(box,wheel);else wrap.appendChild(box)}
    if(launch.parentElement!==box)box.appendChild(launch);
  }

  function sync(){fixIcons();fixNav();exposeFoodGuide();}
  sync();
  requestAnimationFrame(sync);
  setTimeout(sync,180);
})();
