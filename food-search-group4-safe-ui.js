(()=>{
  if(window.__group4SafeUiLoaded)return;
  window.__group4SafeUiLoaded=true;

  const norm=s=>String(s??'').toLowerCase().replace(/\s+/g,'');
  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  let items=[];
  let busy=false;

  function currentFilters(view){
    const storeBtn=view.querySelector('.fsx-storechips .fsx-chip.on');
    const groupBtn=view.querySelector('.fsx-groupchips .fsx-chip.on');
    return {
      store:storeBtn?.dataset.store||'all',
      group:groupBtn?.dataset.group||'all',
      q:norm(view.querySelector('.fsx-search')?.value||'')
    };
  }

  function buildCard(item){
    const w=Number(item.point_weight_g);
    return `<article class="fsx-item fsx-book-item" data-book-id="${esc(item.id)}"><div class="fsx-topline"><div><div class="fsx-name">${esc(item.name)}</div><div class="fsx-store">一般食材｜${esc(item.category)}</div></div><div class="fsx-kcal">80 kcal</div></div><div class="fsx-pfc">80kcal＝1点｜資料確認済み</div><div class="fsx-groups"><span class="fsx-g fsx-g4">第4群 1.0点</span></div><div class="fsx-ing">1点の目安量：${esc(w)}g</div></article>`;
  }

  function augment(){
    if(busy||!items.length)return;
    const view=document.getElementById('foodSearchView');
    const results=view?.querySelector('.fsx-results');
    if(!view||!results)return;
    busy=true;
    results.querySelectorAll('.fsx-book-item').forEach(x=>x.remove());

    const {store,group,q}=currentFilters(view);
    let add=[];
    if((store==='all'||store==='一般食材')&&(group==='all'||group==='group4')){
      add=items.filter(item=>{
        if(!q)return true;
        return norm([item.name,item.category,...(item.keywords||[])].join(' ')).includes(q);
      });
    }
    if(add.length){
      results.insertAdjacentHTML('beforeend',add.map(buildCard).join(''));
    }

    const count=view.querySelector('.fsx-count');
    if(count){
      const base=[...results.querySelectorAll('.fsx-item:not(.fsx-book-item)')].length;
      count.textContent=`${base+add.length}件`;
    }
    const note=view.querySelector('.fsx-testnote');
    if(note)note.textContent='一般食材の第4群は、80kcalガイドブックで確認した「80kcal＝1点」に相当する重量を表示しています。';
    busy=false;
  }

  async function load(){
    try{
      const r=await fetch('food-search-group4-book.js?v=20260829c',{cache:'no-store'});
      if(!r.ok)throw new Error('load failed');
      const src=await r.text();
      const m=src.match(/const rows=(\[[\s\S]*?\]);\s*const items=/);
      if(!m)throw new Error('rows not found');
      const rows=JSON.parse(m[1]);
      items=rows.map((row,i)=>({
        id:`book_g4_${String(i+1).padStart(3,'0')}`,
        name:row[0],point_weight_g:Number(row[1]),category:row[2],page:row[3],
        keywords:[row[0],row[2],'第4群','80kcal','1点','ポテチ','ケーキ']
      }));
      augment();
      const view=document.getElementById('foodSearchView');
      view?.addEventListener('click',()=>setTimeout(augment,20),true);
      view?.querySelector('.fsx-search')?.addEventListener('input',()=>setTimeout(augment,20));
      const results=view?.querySelector('.fsx-results');
      if(results){
        const mo=new MutationObserver(()=>{if(!busy)setTimeout(augment,0)});
        mo.observe(results,{childList:true});
      }
    }catch(e){console.error('group4 safe ui',e)}
  }

  setTimeout(load,0);
})();
