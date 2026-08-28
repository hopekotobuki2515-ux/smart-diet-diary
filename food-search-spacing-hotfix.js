(()=>{
  if(window.__foodSearchSpacingHotfixLoaded) return;
  window.__foodSearchSpacingHotfixLoaded=true;
  const style=document.createElement('style');
  style.textContent=`
    #foodSearchView .fsx-wrap{
      padding-bottom:0!important;
    }
    #foodSearchView .fsx-card{
      margin-bottom:calc(88px + env(safe-area-inset-bottom))!important;
    }
  `;
  document.head.appendChild(style);
})();
