(()=>{
  const s=document.createElement('style');
  s.textContent=`
    .groupCard.g4{padding-left:2px!important;padding-right:2px!important;overflow:hidden!important}
    .groupCard.g4 strong{font-size:15px!important;white-space:nowrap!important}
    .groupCard.g4 small{font-size:9.5px!important;line-height:1.15!important;white-space:nowrap!important;letter-spacing:-.15px!important}
    .groupCard.g4 b{font-size:14px!important;white-space:nowrap!important;letter-spacing:-.2px!important}
    .breakGroup.g4 .breakHead b{white-space:nowrap!important}
    .breakGroup.g4 .breakHead span{font-size:11px!important;line-height:1.2!important;text-align:center!important;white-space:nowrap!important}
    .breakGroup.g4 .subItem .name{font-size:9.5px!important;line-height:1.15!important;overflow-wrap:anywhere!important}
    @media(max-width:390px){
      .groupCard.g4 small{font-size:9px!important}
      .groupCard.g4 b{font-size:13.5px!important}
      .breakGroup.g4 .breakHead span{font-size:10.5px!important}
    }
  `;
  document.head.appendChild(s);
})();