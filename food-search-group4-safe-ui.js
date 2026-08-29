(()=>{
  if(window.__group4SafeUiLoaded)return;
  window.__group4SafeUiLoaded=true;

  const norm=s=>String(s??'').toLowerCase().replace(/\s+/g,'');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const rows=Array.isArray(window.__group4FoodRows)?window.__group4FoodRows:[];
  const items=rows.map((row,i)=>{
    const aliases=[];
    const name=String(row[0]||'');
    if(name.includes('ポテトチップス')) aliases.push('ポテチ');
    if(name.includes('ショートケーキ')) aliases.push('ケーキ');
    if(name.includes('ケーキドーナッツ')) aliases.push('ケーキ','ドーナツ','ドーナッツ');
    if(name.includes('イーストドーナッツ')) aliases.push('ドーナツ','ドーナッツ');
    return {
      id:`book_g4_${String(i+1).padStart(3,'0')}`,
      name,
      point_weight_g:Number(row[1]),
      category:String(row[2]||''),
      page:String(row[3]||''),
      keywords:[name,String(row[2]||''),'第4群','80kcal','1点',...aliases]
    };
  });
  let busy=false;

  function currentFilters(view){
    return {
      store:view.querySelector('.fsx-storechips .fsx-chip.on')?.dataset.store||'all',
      group:view.querySelector('.fsx-groupchips .fsx-chip.on')?.dataset.group||'all',
      q:norm(view.querySelector('.fsx-search')?.value||'')
    };
  }

  function isOldGeneralGroup4(card){
    if(card.classList.contains('fsx-book-item'))return false;
    const store=card.querySelector('.fsx-store')?.textContent||'';
    const groups=card.querySelector('.fsx-groups')?.textContent||'';
    return store.startsWith('一般食材｜')&&groups.includes('第4群');
  }

  function buildCard(item){
    const w=Number(item.point_weight_g);
    return `<article class="fsx-item fsx-book-item" data-book-id="${esc(item.id)}"><div class="fsx-topline"><div><div class="fsx-name">${esc(item.name)}</div><div class="fsx-store">一般食材｜${esc(item.category)}</div></div><div class="fsx-kcal">${esc(w)} g</div></div><div class="fsx-pfc">1点＝80kcal</div><div class="fsx-groups"><span class="fsx-g fsx-g4">第4群 1.0点</span></div><div class="fsx-ing">80kcalに相当する食品重量：${esc(w)}g</div><div class="fsx-est">資料確認済み</div></article>`;
  }

  function augment(){
    if(busy)return;
    const view=document.getElementById('foodSearchView');
    const results=view?.querySelector('.fsx-results');
    if(!view||!results)return;
    busy=true;

    results.querySelectorAll('.fsx-book-item').forEach(x=>x.remove());
    results.querySelectorAll('.fsx-item').forEach(card=>{if(isOldGeneralGroup4(card))card.remove();});

    const {store,group,q}=currentFilters(view);
    let add=[];
    if((store==='all'||store==='一般食材')&&(group==='all'||group==='group4')){
      add=items.filter(item=>{
        if(!q)return true;
        return norm([item.name,item.category,...item.keywords].join(' ')).includes(q);
      });
    }
    if(add.length)results.insertAdjacentHTML('beforeend',add.map(buildCard).join(''));

    const count=view.querySelector('.fsx-count');
    if(count)count.textContent=`${results.querySelectorAll('.fsx-item').length}件`;
    const note=view.querySelector('.fsx-testnote');
    if(note)note.textContent='一般食材の第4群は「1点＝80kcal」に相当する食品重量（g）を表示しています。';
    busy=false;
  }

  function start(){
    augment();
    const view=document.getElementById('foodSearchView');
    view?.addEventListener('click',()=>setTimeout(augment,30),true);
    view?.querySelector('.fsx-search')?.addEventListener('input',()=>setTimeout(augment,30));
    const results=view?.querySelector('.fsx-results');
    if(results){
      const mo=new MutationObserver(()=>{if(!busy)setTimeout(augment,0)});
      mo.observe(results,{childList:true});
    }
  }
  setTimeout(start,0);
})();
