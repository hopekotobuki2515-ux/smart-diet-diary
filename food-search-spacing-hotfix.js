(()=>{
  if(window.__foodSearchSpacingHotfixLoaded) return;
  window.__foodSearchSpacingHotfixLoaded=true;
  const style=document.createElement('style');
  style.textContent=`
    #foodSearchView .fsx-wrap{
      padding-bottom:160px!important;
    }
  `;
  document.head.appendChild(style);
})();
