(()=>{
  if(window.__searchNavHotfixLoaded) return;
  window.__searchNavHotfixLoaded=true;

  function openFoodSearch(btn){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='foodSearchView'));
    document.querySelectorAll('.footnav button').forEach(b=>b.classList.toggle('active',b===btn));
    const app=document.querySelector('.app');
    if(app) app.scrollTop=0;
    window.scrollTo(0,0);
  }

  function restoreSearchTab(){
    const nav=document.querySelector('.footnav>div');
    const searchView=document.getElementById('foodSearchView');
    if(!nav||!searchView) return false;

    let btn=nav.querySelector('button[data-view="foodSearchView"]') || nav.querySelector('button[data-view="guideView"]') || nav.querySelector('button[data-view="settingsView"]');
    if(!btn) return false;

    btn.dataset.view='foodSearchView';
    btn.setAttribute('aria-label','食品検索');
    const label=btn.querySelector('.navLabel');
    if(label) label.textContent='食品検索';
    else btn.textContent='食品検索';

    let icon=btn.querySelector('.navIcon');
    if(!icon){
      icon=document.createElement('span');
      icon.className='navIcon';
      btn.prepend(icon);
    }
    icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';

    if(btn.dataset.searchNavBound!=='1'){
      btn.dataset.searchNavBound='1';
      btn.addEventListener('click',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        openFoodSearch(btn);
      },true);
      btn.addEventListener('touchend',e=>{
        e.preventDefault();
        e.stopImmediatePropagation();
        openFoodSearch(btn);
      },{capture:true,passive:false});
    }
    return true;
  }

  if(!restoreSearchTab()){
    requestAnimationFrame(restoreSearchTab);
    setTimeout(restoreSearchTab,120);
    setTimeout(restoreSearchTab,400);
    setTimeout(restoreSearchTab,900);
  }
})();
