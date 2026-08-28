(()=>{
  if(window.__foodSearchSpacingHotfixLoaded) return;
  window.__foodSearchSpacingHotfixLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    #foodSearchView .fsx-wrap{
      padding-bottom:calc(98px + env(safe-area-inset-bottom))!important;
    }
    #foodSearchView .fsx-card{
      margin-bottom:0!important;
    }
    .app.food-search-active{
      padding-bottom:0!important;
    }
    #foodSearchView .fsx-session-summary{
      margin-bottom:0!important;
    }
  `;
  document.head.appendChild(style);

  const app=document.querySelector('.app');
  const searchView=document.getElementById('foodSearchView');
  if(!app||!searchView) return;

  const sync=()=>{
    app.classList.toggle('food-search-active',searchView.classList.contains('active'));
  };

  sync();
  const mo=new MutationObserver(sync);
  mo.observe(searchView,{attributes:true,attributeFilter:['class']});
})();
