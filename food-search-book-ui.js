(()=>{
  if(window.__foodSearchBookUiLoaded)return;
  window.__foodSearchBookUiLoaded=true;

  const apply=()=>{
    const view=document.getElementById('foodSearchView');
    if(!view)return;
    const note=view.querySelector('.fsx-testnote');
    if(note)note.textContent='一般食材の第4群は、80kcalガイドブックの資料で確認した「1点＝80kcal」の重量を表示しています。コンビニ商品で推定フラグが付くものは目安値です。';
    view.querySelectorAll('.fsx-item').forEach(card=>{
      const name=card.querySelector('.fsx-name')?.textContent||'';
      const m=name.match(/｜1点\s*([0-9]+)g/);
      if(!m)return;
      const pfc=card.querySelector('.fsx-pfc');
      if(pfc)pfc.textContent='80kcal＝1点｜資料確認済み';
      const ing=card.querySelector('.fsx-ing');
      if(ing)ing.textContent='1点の目安量：'+m[1]+'g';
    });
  };

  const start=()=>{
    apply();
    const results=document.querySelector('#foodSearchView .fsx-results');
    if(results){
      const mo=new MutationObserver(apply);
      mo.observe(results,{childList:true,subtree:true});
    }
  };
  requestAnimationFrame(start);
  setTimeout(start,200);
})();
