(()=>{
  if(window.__foodSearchSpacingHotfixLoaded) return;
  window.__foodSearchSpacingHotfixLoaded=true;
  const style=document.createElement('style');
  style.textContent=`
    #foodSearchView .fsx-wrap{
      padding-bottom:calc(96px + env(safe-area-inset-bottom))!important;
    }
  `;
  document.head.appendChild(style);
})();
