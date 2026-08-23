(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .breakGroup{grid-template-columns:120px 1fr!important}
    .breakToggle{display:none!important}
    .subHint{grid-column:2/3!important}
    .breakItems{gap:10px!important;padding:10px 10px 12px!important}
    .subItem{min-width:82px!important;padding:10px 8px 56px!important}
    .subItem .num{display:flex!important;justify-content:center!important;align-items:baseline!important;gap:2px!important;min-height:30px!important;line-height:1!important}
    .subItem .minus{left:50%!important;bottom:7px!important;transform:translateX(-50%)!important;width:46px!important;height:46px!important;line-height:46px!important;font-size:25px!important;background:#fff!important;border:2px solid currentColor!important;box-shadow:0 2px 7px rgba(0,0,0,.08)!important;touch-action:manipulation!important}
    .breakGroup.g1 .subItem .minus{color:var(--c1)!important}
    .breakGroup.g2 .subItem .minus{color:var(--c2)!important}
    .breakGroup.g3 .subItem .minus{color:var(--c3)!important}
    .breakGroup.g4 .subItem .minus{color:var(--c4)!important}
    .subItem .minus:active{transform:translateX(-50%) scale(.94)!important}
    @media (max-width:390px){
      .breakGroup{grid-template-columns:108px 1fr!important}
      .subItem{min-width:78px!important}
      .subItem .minus{width:48px!important;height:48px!important;line-height:48px!important}
    }
  `;
  document.head.appendChild(style);
})();
