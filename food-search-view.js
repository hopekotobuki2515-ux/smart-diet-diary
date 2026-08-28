(()=>{
  if(window.__foodSearchViewLoaded) return;
  window.__foodSearchViewLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    .fsx-wrap{padding:14px 14px 120px}
    .fsx-card{background:#fff;border:1px solid #eee2d7;border-radius:18px;box-shadow:0 3px 14px rgba(70,45,20,.05);padding:16px}
    .fsx-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:14px}
    .fsx-head h2{margin:0;font-size:21px}.fsx-head p{margin:5px 0 0;font-size:12px;line-height:1.55;color:#776b62}
    .fsx-settings{border:1px solid #eadfd5;background:#fffaf6;color:#6b5544;border-radius:12px;padding:9px 11px;font-size:12px;font-weight:800;white-space:nowrap}
    .fsx-search{width:100%;border:1px solid #ded4cb;background:#fff;border-radius:14px;padding:13px 14px;font-size:16px;outline:none}
    .fsx-search:focus{border-color:#f47a2a;box-shadow:0 0 0 3px rgba(244,122,42,.12)}
    .fsx-label{font-size:11px;font-weight:900;color:#6e6259;margin:14px 0 7px}
    .fsx-chips{display:flex;gap:7px;overflow-x:auto;-webkit-overflow-scrolling:touch;padding-bottom:2px}
    .fsx-chip{flex:0 0 auto;border:1px solid #e3d8cf;background:#fff;border-radius:999px;padding:8px 11px;font-size:11px;font-weight:800;color:#6c5b50}
    .fsx-chip.on{border-color:#f47a2a;background:#fff0e5;color:#b95613}
    .fsx-meta{display:flex;justify-content:space-between;align-items:center;gap:8px;margin:16px 2px 8px;font-size:11px;color:#82766d}
    .fsx-results{display:flex;flex-direction:column;gap:9px}
    .fsx-item{background:#fff;border:1px solid #eee2d7;border-radius:15px;padding:13px;box-shadow:0 2px 8px rgba(70,45,20,.04)}
    .fsx-topline{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.fsx-name{font-size:15px;font-weight:900;line-height:1.35}.fsx-store{font-size:10px;color:#7d7168;margin-top:3px}
    .fsx-kcal{flex:0 0 auto;background:#fff5ea;border-radius:10px;padding:7px 9px;font-size:12px;font-weight:900;color:#b85b18}
    .fsx-pfc{margin-top:9px;font-size:11px;color:#5f554e}.fsx-groups{display:flex;flex-wrap:wrap;gap:6px;margin-top:9px}
    .fsx-g{border-radius:999px;padding:5px 8px;font-size:10.5px;font-weight:900}.fsx-g1{background:#eaf4ff;color:#2f6ea8}.fsx-g2{background:#fff0f3;color:#bb4561}.fsx-g3{background:#eff9eb;color:#4f8b38}.fsx-g4{background:#fff7e8;color:#b97415}
    .fsx-ing{margin-top:8px;font-size:10.5px;line-height:1.55;color:#776b62}.fsx-est{margin-top:8px;font-size:10px;color:#9a6a45}.fsx-empty{padding:24px 10px;text-align:center;color:#8a7e75;font-size:12px;line-height:1.7}
    .fsx-testnote{margin-top:12px;padding:10px 11px;border-radius:12px;background:#fffaf3;color:#7a6657;font-size:10.5px;line-height:1.55}

    .qgm-backdrop{position:fixed;inset:0;z-index:140;background:rgba(40,32,27,.42);display:flex;align-items:center;justify-content:center;padding:18px}
    .qgm-modal{width:min(500px,100%);max-height:88dvh;overflow:auto;-webkit-overflow-scrolling:touch;background:#fffaf5;border-radius:22px;padding:18px;box-shadow:0 20px 50px rgba(50,34,22,.25)}
    .qgm-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.qgm-head h2{margin:0;font-size:21px}.qgm-close{width:38px;height:38px;border:0;border-radius:50%;background:#f1eae4;font-size:22px;color:#66564b}
    .qgm-text{margin-top:12px;font-size:13px;line-height:1.75;color:#584d45}.qgm-point{margin:12px 0;padding:11px 12px;background:#fff3e7;border-radius:12px;color:#9b4e17;font-weight:900;text-align:center}
    .qgm-wheel{position:relative;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;width:min(300px,78vw);aspect-ratio:1;margin:14px auto 16px;border-radius:50%;overflow:hidden;border:6px solid #fff;box-shadow:0 4px 18px rgba(70,45,20,.10)}
    .qgm-quad{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;font-weight:900;font-size:17px;line-height:1.2;padding:10px 8px}
    .qgm-quad small{display:block;font-size:10px;line-height:1.35;margin-top:5px;font-weight:800}
    .qgm-quad.g1{background:#d9ecff}.qgm-quad.g2{background:#ffe0e0}.qgm-quad.g3{background:#dff3dc}.qgm-quad.g4{background:#fff0c8}
    .qgm-center{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:100px;height:100px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-size:14px;font-weight:900;box-shadow:0 3px 12px rgba(70,45,20,.10)}
    .qgm-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.qgm-box{border-radius:13px;padding:11px;font-size:11px;line-height:1.55}.qgm-box b{display:block;font-size:14px;margin-bottom:4px}
    .qgm-g1{background:#eaf4ff}.qgm-g2{background:#fff0f3}.qgm-g3{background:#eff9eb}.qgm-g4{background:#fff7e8}
    @media(max-width:390px){.fsx-wrap{padding-left:10px;padding-right:10px}.fsx-card{padding:14px}.fsx-head h2{font-size:19px}.qgm-modal{padding:16px}.qgm-grid{gap:7px}.qgm-wheel{width:min(286px,80vw)}}
  `;
  document.head.appendChild(style);

  const view=document.createElement('main');
  view.id='foodSearchView';
  view.className='view';
  view.innerHTML=`<section class="fsx-wrap"><div class="fsx-card">
    <div class="fsx-head"><div><h2>コンビニ・食品検索</h2><p>商品名や食材名から、四群の目安をすばやく確認できます。</p></div><button type="button" class="fsx-settings">設定</button></div>
    <input class="fsx-search" type="search" inputmode="search" placeholder="例：豚汁、サラダチキン、ヨーグルト">
    <div class="fsx-label">店舗</div><div class="fsx-chips fsx-storechips">
      <button class="fsx-chip on" data-store="all">すべて</button><button class="fsx-chip" data-store="セブンイレブン">セブン</button><button class="fsx-chip" data-store="ローソン">ローソン</button><button class="fsx-chip" data-store="ファミリーマート">ファミマ</button><button class="fsx-chip" data-store="一般食材">一般食材</button>
    </div>
    <div class="fsx-label">群で絞り込み</div><div class="fsx-chips fsx-groupchips">
      <button class="fsx-chip on" data-group="all">すべて</button><button class="fsx-chip" data-group="group1">第1群</button><button class="fsx-chip" data-group="group2">第2群</button><button class="fsx-chip" data-group="group3">第3群</button><button class="fsx-chip" data-group="group4">第4群</button>
    </div>
    <div class="fsx-meta"><span class="fsx-count">読み込み中...</span><span>ローカル検索</span></div>
    <div class="fsx-results"><div class="fsx-empty">データを読み込んでいます。</div></div>
    <div class="fsx-testnote">現在は動作確認用のテストデータです。推定フラグ付きの商品は、四群点数を「目安」として表示します。</div>
  </div></section>`;
  document.querySelector('.app')?.appendChild(view);

  let data=[];
  let selectedStore='all';
  let selectedGroup='all';
  const input=view.querySelector('.fsx-search');
  const results=view.querySelector('.fsx-results');
  const count=view.querySelector('.fsx-count');

  const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  const norm=s=>String(s??'').toLowerCase().replace(/\s+/g,'');

  function showView(id,navBtn){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
    document.querySelectorAll('.footnav button').forEach(b=>b.classList.toggle('active',b===navBtn));
    const app=document.querySelector('.app');
    if(app) app.scrollTop=0;
    window.scrollTo(0,0);
    if(id==='settingsView'&&typeof window.loadSettings==='function') window.loadSettings();
  }

  function renderResults(){
    const q=norm(input.value);
    const filtered=data.filter(item=>{
      if(selectedStore!=='all'&&item.store!==selectedStore) return false;
      if(selectedGroup!=='all'&&!(Number(item.group_scores?.[selectedGroup])>0)) return false;
      if(!q) return true;
      const hay=norm([item.name,item.store,item.category,...(item.ingredients_summary||[]),...(item.keywords||[])].join(' '));
      return hay.includes(q);
    });
    count.textContent=`${filtered.length}件`;
    if(!filtered.length){results.innerHTML='<div class="fsx-empty">該当する食品がありません。<br>検索語やフィルターを変えてみてください。</div>';return;}
    results.innerHTML=filtered.map(item=>{
      const gs=item.group_scores||{};
      const badges=[1,2,3,4].filter(n=>Number(gs['group'+n])>0).map(n=>`<span class="fsx-g fsx-g${n}">第${n}群 ${Number(gs['group'+n]).toFixed(1)}点</span>`).join('');
      return `<article class="fsx-item"><div class="fsx-topline"><div><div class="fsx-name">${esc(item.name)}</div><div class="fsx-store">${esc(item.store)}｜${esc(item.category)}</div></div><div class="fsx-kcal">${esc(item.calories)} kcal</div></div><div class="fsx-pfc">P ${esc(item.protein)}g ／ F ${esc(item.fat)}g ／ C ${esc(item.carbs)}g</div><div class="fsx-groups">${badges}</div><div class="fsx-ing">主な食材：${esc((item.ingredients_summary||[]).join('、'))}</div>${item.is_estimated?'<div class="fsx-est">※四群点数は推定値を含む目安です。</div>':''}</article>`;
    }).join('');
  }

  view.querySelectorAll('[data-store]').forEach(btn=>btn.addEventListener('click',()=>{
    selectedStore=btn.dataset.store;view.querySelectorAll('[data-store]').forEach(x=>x.classList.toggle('on',x===btn));renderResults();
  }));
  view.querySelectorAll('[data-group]').forEach(btn=>btn.addEventListener('click',()=>{
    selectedGroup=btn.dataset.group;view.querySelectorAll('[data-group]').forEach(x=>x.classList.toggle('on',x===btn));renderResults();
  }));
  input.addEventListener('input',renderResults);
  view.querySelector('.fsx-settings').addEventListener('click',()=>showView('settingsView',null));

  fetch('food-search-data.json?v=20260828c',{cache:'no-store'}).then(r=>{if(!r.ok)throw new Error('load failed');return r.json();}).then(json=>{data=Array.isArray(json)?json:[];renderResults();}).catch(()=>{count.textContent='0件';results.innerHTML='<div class="fsx-empty">食品データを読み込めませんでした。</div>';});

  function switchSearchNav(){
    const btn=document.querySelector('.footnav button[data-view="settingsView"],.footnav button[data-view="foodSearchView"]');
    if(!btn) return;
    btn.dataset.view='foodSearchView';
    const label=btn.querySelector('.navLabel');
    if(label) label.textContent='食品検索'; else btn.textContent='食品検索';
    btn.setAttribute('aria-label','食品検索');
    const icon=btn.querySelector('.navIcon');
    if(icon) icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
    if(btn.dataset.fsxBound!=='1'){
      btn.dataset.fsxBound='1';
      btn.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();showView('foodSearchView',btn);},true);
      btn.addEventListener('touchend',e=>{e.preventDefault();e.stopImmediatePropagation();showView('foodSearchView',btn);},{capture:true,passive:false});
    }
  }
  switchSearchNav();
  requestAnimationFrame(switchSearchNav);
  setTimeout(switchSearchNav,150);
  setTimeout(switchSearchNav,600);

  function openGuideModal(){
    if(document.querySelector('.qgm-backdrop')) return;
    const back=document.createElement('div');back.className='qgm-backdrop';
    back.innerHTML=`<div class="qgm-modal" role="dialog" aria-modal="true" aria-label="四群の説明">
      <div class="qgm-head"><h2>四群点数法とは？</h2><button type="button" class="qgm-close" aria-label="閉じる">×</button></div>
      <div class="qgm-text">食品を栄養の特徴ごとに4つの群に分け、食事全体のバランスを確認する考え方です。<div class="qgm-point">1点＝80kcal</div>「何点食べたか」だけでなく、「どの群から食べたか」を見ることで、食べ方の偏りに気づきやすくなります。</div>
      <div class="qgm-wheel">
        <div class="qgm-quad g1">第1群<small>牛乳・乳製品<br>卵</small></div>
        <div class="qgm-quad g2">第2群<small>魚介・肉<br>豆・豆製品</small></div>
        <div class="qgm-quad g3">第3群<small>野菜<br>きのこ・海藻<br>いも・果物</small></div>
        <div class="qgm-quad g4">第4群<small>主食・調味料<br>油脂<br>その他</small></div>
        <div class="qgm-center">1点＝80kcal</div>
      </div>
      <div class="qgm-grid"><div class="qgm-box qgm-g1"><b>第1群</b>牛乳・乳製品、卵など</div><div class="qgm-box qgm-g2"><b>第2群</b>魚介、肉、豆・豆製品など</div><div class="qgm-box qgm-g3"><b>第3群</b>野菜、きのこ・海藻、いも、果物など</div><div class="qgm-box qgm-g4"><b>第4群</b>主食、油脂、砂糖・調味料など</div></div>
    </div>`;
    const close=()=>back.remove();back.querySelector('.qgm-close').onclick=close;back.addEventListener('click',e=>{if(e.target===back)close();});document.body.appendChild(back);
  }
  document.addEventListener('click',e=>{const b=e.target.closest('#openGuide,.guideBtn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();openGuideModal();},true);
  document.addEventListener('touchend',e=>{const b=e.target.closest('#openGuide,.guideBtn');if(!b)return;e.preventDefault();e.stopImmediatePropagation();openGuideModal();},{capture:true,passive:false});
})();