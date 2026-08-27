(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .footnav{
      left:0!important;right:0!important;bottom:0!important;
      background:transparent!important;
      border-top:0!important;
      box-shadow:none!important;
      padding:0 10px calc(8px + env(safe-area-inset-bottom))!important;
      backdrop-filter:none!important;
      -webkit-backdrop-filter:none!important;
      pointer-events:none!important;
    }
    .footnav>div{
      width:min(500px,100%)!important;
      grid-template-columns:repeat(5,1fr)!important;
      gap:3px!important;
      padding:6px!important;
      background:rgba(255,255,255,.96)!important;
      border:1px solid rgba(231,220,210,.9)!important;
      border-radius:22px!important;
      box-shadow:0 8px 24px rgba(79,55,35,.14),0 2px 8px rgba(79,55,35,.06)!important;
      backdrop-filter:blur(16px)!important;
      -webkit-backdrop-filter:blur(16px)!important;
      overflow:hidden!important;
      pointer-events:auto!important;
    }
    .footnav button{
      position:relative!important;
      min-width:0!important;
      min-height:54px!important;
      padding:5px 2px 6px!important;
      border:0!important;
      border-radius:16px!important;
      background:transparent!important;
      color:#766b63!important;
      display:flex!important;
      flex-direction:column!important;
      align-items:center!important;
      justify-content:center!important;
      gap:3px!important;
      font-size:10.5px!important;
      line-height:1.05!important;
      font-weight:750!important;
      letter-spacing:0!important;
      white-space:nowrap!important;
      touch-action:manipulation!important;
      -webkit-tap-highlight-color:transparent!important;
      transition:background .16s ease,color .16s ease,transform .12s ease!important;
    }
    .footnav button .navIcon{
      width:21px!important;
      height:21px!important;
      display:block!important;
      flex:0 0 auto!important;
    }
    .footnav button .navIcon svg{
      width:100%!important;
      height:100%!important;
      display:block!important;
      fill:none!important;
      stroke:currentColor!important;
      stroke-width:2!important;
      stroke-linecap:round!important;
      stroke-linejoin:round!important;
    }
    .footnav button .navLabel{display:block!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important}
    .footnav button.active{
      color:#e96f1f!important;
      background:#fff0e5!important;
      font-weight:900!important;
    }
    .footnav button.active::after{
      content:''!important;
      position:absolute!important;
      left:50%!important;
      bottom:2px!important;
      width:18px!important;
      height:2.5px!important;
      border-radius:999px!important;
      background:#f47a2a!important;
      transform:translateX(-50%)!important;
    }
    .footnav button:active{transform:scale(.96)!important}
    .app{padding-bottom:88px!important}
    @media(max-width:390px){
      .footnav{padding-left:7px!important;padding-right:7px!important}
      .footnav>div{padding:5px!important;border-radius:20px!important}
      .footnav button{min-height:52px!important;font-size:10px!important;border-radius:14px!important}
      .footnav button .navIcon{width:20px!important;height:20px!important}
    }
  `;
  document.head.appendChild(style);

  const icons={
    todayView:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19a1 1 0 0 1 1 1v15.5a1.5 1.5 0 0 1-1.5 1.5H6.5A2.5 2.5 0 0 1 4 18.5v-13Z"/><path d="M7 3v18M10 7h6M10 11h6"/></svg>',
    healthView:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.9c-1.6-2-4.7-2.1-6.5-.3L12 7.9 9.7 5.6C7.9 3.8 4.8 3.9 3.2 5.9c-1.5 1.9-1.2 4.6.5 6.3L12 20l8.3-7.8c1.7-1.7 2-4.4.5-6.3Z"/></svg>',
    calendarView:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>',
    progressView:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></svg>',
    settingsView:'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.37a1.7 1.7 0 0 0-1 .63 1.7 1.7 0 0 0-.36 1.1V21h-4v-.1A1.7 1.7 0 0 0 8 19.37a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 3.63 15a1.7 1.7 0 0 0-.63-1 1.7 1.7 0 0 0-1.1-.36H2v-4h.1A1.7 1.7 0 0 0 3.63 8a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 8 3.63a1.7 1.7 0 0 0 1-.63 1.7 1.7 0 0 0 .36-1.1V2h4v.1A1.7 1.7 0 0 0 15 3.63a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.37 8c.14.39.37.73.63 1 .3.28.7.36 1.1.36h.1v4h-.1A1.7 1.7 0 0 0 19.4 15Z"/></svg>'
  };

  function enhanceNav(){
    document.querySelectorAll('.footnav button[data-view]').forEach(btn=>{
      if(btn.dataset.navEnhanced==='1') return;
      const label=(btn.textContent||'').trim();
      const icon=icons[btn.dataset.view]||'';
      btn.innerHTML=`<span class="navIcon">${icon}</span><span class="navLabel">${label}</span>`;
      btn.dataset.navEnhanced='1';
      btn.setAttribute('aria-label',label);
    });
  }

  enhanceNav();
  requestAnimationFrame(enhanceNav);
  setTimeout(enhanceNav,120);
})();
