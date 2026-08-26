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

    .guideQuad{padding:18px 12px!important;text-align:center!important;line-height:1.2!important;overflow:hidden!important}
    .guideQuad .guideGroupTitle{display:block!important;font-size:19px!important;font-weight:900!important;line-height:1.1!important;margin-bottom:8px!important;white-space:nowrap!important}
    .guideQuad .guideGroupItems{display:block!important;font-size:11px!important;font-weight:800!important;line-height:1.45!important;white-space:normal!important;word-break:keep-all!important;overflow-wrap:normal!important}
    .guideQuad .guideGroupItems span{display:block!important;white-space:nowrap!important}
    .guideQuad.g3,.guideQuad.g4{padding-top:20px!important;padding-bottom:14px!important}
    .guideQuad.g1 .guideGroupTitle,.guideQuad.g1 .guideGroupItems{transform:translate(4px,4px)!important}
    .guideQuad.g2 .guideGroupTitle,.guideQuad.g2 .guideGroupItems{transform:translate(-4px,4px)!important}
    .guideQuad.g3 .guideGroupTitle,.guideQuad.g3 .guideGroupItems{transform:translate(4px,-4px)!important}
    .guideQuad.g4 .guideGroupTitle,.guideQuad.g4 .guideGroupItems{transform:translate(-4px,-4px)!important}

    .app .hero h1{white-space:nowrap!important;font-size:clamp(17px,5.2vw,21px)!important;letter-spacing:-.35px!important}

    @media(max-width:390px){
      .groupCard.g4 small{font-size:9px!important}
      .groupCard.g4 b{font-size:13.5px!important}
      .breakGroup.g4 .breakHead span{font-size:10.5px!important}
      .guideQuad{padding-left:9px!important;padding-right:9px!important}
      .guideQuad .guideGroupTitle{font-size:18px!important;margin-bottom:6px!important}
      .guideQuad .guideGroupItems{font-size:10.5px!important;line-height:1.42!important}
    }
  `;
  document.head.appendChild(s);

  function fixGuideLabels(){
    const guide=document.querySelector('.guideWheel');
    if(!guide) return;
    const groups=[
      ['.guideQuad.g1','第1群',['牛乳・乳製品','卵']],
      ['.guideQuad.g2','第2群',['魚介・肉','豆・豆製品']],
      ['.guideQuad.g3','第3群',['野菜','きのこ・海藻類','いも・果物']],
      ['.guideQuad.g4','第4群',['主食・調味料','油脂','その他']]
    ];
    groups.forEach(([sel,title,items])=>{
      const el=guide.querySelector(sel);
      if(!el) return;
      const desired=`<span class="guideGroupTitle">${title}</span><span class="guideGroupItems">${items.map(x=>`<span>${x}</span>`).join('')}</span>`;
      if(el.innerHTML!==desired) el.innerHTML=desired;
    });
  }

  requestAnimationFrame(fixGuideLabels);
  document.addEventListener('click',e=>{
    if(e.target.closest('#openGuide,.guideBtn')) setTimeout(fixGuideLabels,0);
  },true);
})();