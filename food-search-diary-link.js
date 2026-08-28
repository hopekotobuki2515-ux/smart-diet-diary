(()=>{
  if(window.__foodSearchDiaryLinkLoaded) return;
  window.__foodSearchDiaryLinkLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    #foodSearchView .fsx-settings{display:none!important}
    .fsx-add{width:100%;margin-top:11px;border:0;border-radius:12px;padding:11px 12px;background:#f47a2a;color:#fff;font-size:12px;font-weight:900;touch-action:manipulation}
    .fsd-backdrop{position:fixed;inset:0;z-index:180;background:rgba(42,34,28,.42);display:flex;align-items:flex-end;justify-content:center;padding:12px}
    .fsd-sheet{width:min(500px,100%);background:#fffaf5;border-radius:22px 22px 16px 16px;padding:17px;box-shadow:0 18px 50px rgba(50,34,22,.24)}
    .fsd-head{display:flex;justify-content:space-between;gap:12px;align-items:flex-start}.fsd-head h3{margin:0;font-size:18px}.fsd-close{border:0;background:#f1eae4;border-radius:50%;width:36px;height:36px;font-size:20px}
    .fsd-name{margin:7px 0 11px;font-size:12px;color:#6d6057;line-height:1.5}.fsd-score{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:13px}.fsd-score span{border-radius:999px;padding:6px 8px;font-size:10.5px;font-weight:900;background:#fff0e5;color:#a95418}
    .fsd-label{font-size:12px;font-weight:900;margin:3px 0 8px}.fsd-meals{display:grid;grid-template-columns:repeat(4,1fr);gap:7px}.fsd-meals button{border:1px solid #eadfd5;background:#fff;border-radius:12px;padding:11px 3px;font-size:12px;font-weight:900;color:#5f5147;touch-action:manipulation}

    .fsd-confirm{position:fixed;inset:0;z-index:190;background:rgba(42,34,28,.42);display:flex;align-items:center;justify-content:center;padding:14px}
    .fsd-private{width:min(500px,100%);max-height:88dvh;overflow:auto;-webkit-overflow-scrolling:touch;background:#fffaf5;border-radius:22px;padding:16px;box-shadow:0 18px 50px rgba(50,34,22,.24)}
    .fsd-private-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:12px}
    .fsd-private-kicker{font-size:10px;font-weight:900;color:#d8651e;letter-spacing:.04em}.fsd-private-head h3{margin:3px 0 0;font-size:18px;color:#493f38}.fsd-private-close{border:0;background:#f1eae4;border-radius:50%;width:34px;height:34px;font-size:19px;color:#66564b}
    .fsd-saved{margin-bottom:12px;padding:10px 12px;border-radius:13px;background:#fff1e6;color:#a45117;font-size:12px;font-weight:900}
    .fsd-compare{display:grid;grid-template-columns:1fr 1fr;gap:9px}
    .fsd-panel{min-width:0;border:1px solid #eee2d7;background:#fff;border-radius:16px;padding:12px}.fsd-panel.guide{background:#fffaf3}
    .fsd-panel-label{font-size:10px;font-weight:900;color:#776b62;margin-bottom:7px}.fsd-panel-name{font-size:13px;font-weight:900;line-height:1.4;color:#463d37;word-break:break-word}.fsd-panel-sub{font-size:10px;color:#7f736a;margin-top:5px;line-height:1.5}
    .fsd-scoreline{display:flex;flex-wrap:wrap;gap:5px;margin-top:9px}.fsd-scoreline span{font-size:9.5px;font-weight:900;border-radius:999px;background:#fff0e5;color:#a95418;padding:5px 7px}
    .fsd-guide-visual{margin-top:10px;padding:10px;border-radius:12px;background:#fff;border:1px solid #f0e3d6}
    .fsd-guide-bar{height:9px;background:#f2e9e2;border-radius:999px;overflow:hidden}.fsd-guide-fill{height:100%;background:#f47a2a;border-radius:999px}
    .fsd-guide-value{margin-top:7px;font-size:12px;font-weight:900;color:#a95418}.fsd-guide-note{margin-top:4px;font-size:9.5px;color:#7a6e65;line-height:1.5}
    .fsd-nutrients{margin-top:10px;border:1px solid #eee2d7;background:#fff;border-radius:16px;padding:12px}.fsd-nutrients-title{font-size:11px;font-weight:900;color:#574c45;margin-bottom:8px}.fsd-nutrient-row{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-top:1px solid #f2ebe5;font-size:11px;color:#61564f}.fsd-nutrient-row:first-of-type{border-top:0}.fsd-nutrient-row b{color:#453d38}.fsd-nutrient-state{font-weight:900;text-align:right;color:#7a6657}
    .fsd-private-note{margin:10px 2px 0;font-size:9.5px;line-height:1.55;color:#8a7e75}
    .fsd-confirmactions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.fsd-confirmactions button{min-height:44px;border-radius:12px;padding:10px 8px;font-size:12px;font-weight:900;touch-action:manipulation}.fsd-continue{border:1px solid #eadfd5;background:#fff;color:#5f5147}.fsd-check{border:0;background:#f47a2a;color:#fff}
    .fsd-toast{position:fixed;left:50%;bottom:calc(98px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:190;background:#333;color:#fff;border-radius:999px;padding:10px 14px;font-size:12px;font-weight:800;white-space:nowrap;box-shadow:0 5px 16px rgba(0,0,0,.2)}
    @media(max-width:390px){.fsd-private{padding:14px}.fsd-compare{gap:7px}.fsd-panel{padding:10px}.fsd-panel-name{font-size:12px}.fsd-nutrients{padding:10px}}
  `;
  document.head.appendChild(style);

  const mealNames={breakfast:'朝食',lunch:'昼食',dinner:'夕食',snack:'間食'};
  const defs={1:['milk','egg'],2:['fish','meat','beans'],3:['veg','mush','potato','fruit'],4:['staple','seasoning','fat','other']};

  function roundHalf(n){return Math.round((Number(n)||0)*2)/2}
  function round1(n){return Math.round((Number(n)||0)*10)/10}
  function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}

  function parsePfc(card){
    const t=card.querySelector('.fsx-pfc')?.textContent||'';
    const p=Number((t.match(/P\s*([0-9.]+)/i)||[])[1]||0);
    const f=Number((t.match(/F\s*([0-9.]+)/i)||[])[1]||0);
    const c=Number((t.match(/C\s*([0-9.]+)/i)||[])[1]||0);
    return {protein:p,fat:f,carbs:c};
  }

  function parseItem(card){
    const scores={1:0,2:0,3:0,4:0};
    card.querySelectorAll('.fsx-g').forEach(el=>{const m=(el.textContent||'').match(/第([1-4])群\s*([0-9.]+)点/);if(m)scores[Number(m[1])]=Number(m[2])||0});
    const kcal=Number((card.querySelector('.fsx-kcal')?.textContent||'').match(/[0-9.]+/)?.[0]||0);
    return {name:(card.querySelector('.fsx-name')?.textContent||'食品').trim(),ingredients:(card.querySelector('.fsx-ing')?.textContent||'').replace(/^主な食材：/,'').trim(),scores,kcal,...parsePfc(card)};
  }

  function inferKey(group,item){
    const t=`${item.name} ${item.ingredients}`;
    if(group===1){if(/卵|たまご|玉子/.test(t))return 'egg';return 'milk'}
    if(group===2){if(/魚|鮭|さけ|サーモン|まぐろ|マグロ|さば|鯖|ツナ|えび|海老|いか|たこ/.test(t))return 'fish';if(/豆|豆腐|納豆|大豆|枝豆/.test(t))return 'beans';return 'meat'}
    if(group===3){if(/果物|フルーツ|りんご|リンゴ|みかん|バナナ|いちご|キウイ|ぶどう/.test(t))return 'fruit';if(/いも|芋|じゃが|さつま/.test(t))return 'potato';if(/きのこ|茸|しいたけ|しめじ|えのき|海藻|わかめ|ひじき|昆布/.test(t))return 'mush';return 'veg'}
    if(/油|オイル|マヨ|バター|マーガリン/.test(t))return 'fat';if(/砂糖|ソース|たれ|ドレッシング|調味/.test(t))return 'seasoning';if(/酒|ビール|ワイン|焼酎/.test(t))return 'other';return 'staple';
  }

  function ensureMeal(m){if(!m.subCounts)m.subCounts={1:{},2:{},3:{},4:{}};[1,2,3,4].forEach(g=>{if(!m.subCounts[g])m.subCounts[g]={};defs[g].forEach(k=>{if(!Number.isFinite(Number(m.subCounts[g][k])))m.subCounts[g][k]=0})})}

  function addToDiary(item,mealId){
    if(typeof dayData!=='function')return false;
    const d=dayData(),m=d?.[mealId];if(!m)return false;ensureMeal(m);
    [1,2,3,4].forEach(g=>{const score=roundHalf(item.scores[g]);if(score<=0)return;const key=inferKey(g,item);m.subCounts[g][key]=roundHalf((Number(m.subCounts[g][key])||0)+score)});
    m.searchItems=Array.isArray(m.searchItems)?m.searchItems:[];m.searchItems.push({name:item.name,scores:item.scores,kcal:item.kcal,fat:item.fat,carbs:item.carbs,addedAt:Date.now()});
    try{if(typeof keyDate==='function'&&typeof current!=='undefined')localStorage.setItem('sdd-'+keyDate(current),JSON.stringify(d))}catch(e){}
    window.__activeMealId=mealId;if(typeof render==='function')render();return true;
  }

  function toast(text){const old=document.querySelector('.fsd-toast');if(old)old.remove();const el=document.createElement('div');el.className='fsd-toast';el.textContent=text;document.body.appendChild(el);setTimeout(()=>el.remove(),2200)}

  function openDiary(mealId){window.__activeMealId=mealId;if(typeof render==='function')render();document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id==='todayView'));const navBtn=document.querySelector('.footnav button[data-view="todayView"]');document.querySelectorAll('.footnav button').forEach(b=>b.classList.toggle('active',b===navBtn));const app=document.querySelector('.app');if(app)app.scrollTop=0}

  function guideFor(item,mealId){
    const entries=[1,2,3,4].map(g=>[g,Number(item.scores[g]||0)]).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]);
    const mainGroup=entries[0]?.[0]||4;
    const actual=entries[0]?.[1]||1;
    const target=mealId==='snack'?Math.min(actual,0.5):Math.min(actual,1.0);
    const ratio=Math.max(0.1,Math.min(1,target/Math.max(actual,.1)));
    const pct=Math.round(ratio*100);
    const label=pct>=95?'登録量をそのまま目安に':'登録量の約'+pct+'%';
    return {mainGroup,actual,target,ratio,pct,label,fatGuide:round1(item.fat*ratio),carbsGuide:round1(item.carbs*ratio)};
  }

  function nutrientState(actual,guide){
    const diff=round1(actual-guide);
    if(diff<=0.5)return 'ガイド範囲内';
    return `ガイド比 ＋${diff}g`;
  }

  function confirmAdded(item,mealId){
    const old=document.querySelector('.fsd-confirm');if(old)old.remove();
    const g=guideFor(item,mealId);
    const scoreText=[1,2,3,4].filter(n=>item.scores[n]>0).map(n=>`<span>第${n}群 ${item.scores[n]}点</span>`).join('');
    const box=document.createElement('div');box.className='fsd-confirm';
    box.innerHTML=`<div class="fsd-private" role="dialog" aria-modal="true" aria-label="食事の自己確認">
      <div class="fsd-private-head"><div><div class="fsd-private-kicker">PRIVATE VIEW</div><h3>食事の自己確認</h3></div><button type="button" class="fsd-private-close" aria-label="閉じる">×</button></div>
      <div class="fsd-saved">登録しました（気づきを保存）</div>
      <div class="fsd-compare">
        <section class="fsd-panel"><div class="fsd-panel-label">あなたが食べたもの</div><div class="fsd-panel-name">${esc(item.name)}</div><div class="fsd-panel-sub">${mealNames[mealId]}・${item.kcal?item.kcal+'kcal':'食品データ'}</div><div class="fsd-scoreline">${scoreText}</div></section>
        <section class="fsd-panel guide"><div class="fsd-panel-label">あなたの適量ガイド</div><div class="fsd-panel-name">第${g.mainGroup}群 ${g.target.toFixed(1)}点を目安</div><div class="fsd-guide-visual"><div class="fsd-guide-bar"><div class="fsd-guide-fill" style="width:${g.pct}%"></div></div><div class="fsd-guide-value">${g.label}</div><div class="fsd-guide-note">登録量 ${g.actual.toFixed(1)}点 → ガイド ${g.target.toFixed(1)}点</div></div></section>
      </div>
      <section class="fsd-nutrients"><div class="fsd-nutrients-title">油分・糖質の確認</div><div class="fsd-nutrient-row"><b>油分（脂質）</b><span class="fsd-nutrient-state">${item.fat.toFixed(1)}g ／ ${nutrientState(item.fat,g.fatGuide)}</span></div><div class="fsd-nutrient-row"><b>糖質（炭水化物）</b><span class="fsd-nutrient-state">${item.carbs.toFixed(1)}g ／ ${nutrientState(item.carbs,g.carbsGuide)}</span></div></section>
      <div class="fsd-private-note">良い・悪いの評価ではなく、今回の登録量と目安量の差を確認するための表示です。</div>
      <div class="fsd-confirmactions"><button type="button" class="fsd-continue">続けて追加する</button><button type="button" class="fsd-check">ダイアリーを確認する</button></div>
    </div>`;
    document.body.appendChild(box);
    const close=()=>box.remove();box.querySelector('.fsd-private-close').onclick=close;box.querySelector('.fsd-continue').onclick=close;box.querySelector('.fsd-check').onclick=()=>{close();openDiary(mealId)};box.addEventListener('click',e=>{if(e.target===box)close()});
  }

  function openSheet(card){
    const item=parseItem(card);const old=document.querySelector('.fsd-backdrop');if(old)old.remove();const back=document.createElement('div');back.className='fsd-backdrop';const scoreText=[1,2,3,4].filter(g=>item.scores[g]>0).map(g=>`<span>第${g}群 ${item.scores[g]}点</span>`).join('');
    back.innerHTML=`<div class="fsd-sheet" role="dialog" aria-modal="true"><div class="fsd-head"><div><h3>ダイアリーに追加</h3><div class="fsd-name">${esc(item.name)}</div></div><button class="fsd-close" aria-label="閉じる">×</button></div><div class="fsd-score">${scoreText}</div><div class="fsd-label">どの食事に追加しますか？</div><div class="fsd-meals">${Object.entries(mealNames).map(([id,label])=>`<button data-meal="${id}">${label}</button>`).join('')}</div></div>`;
    document.body.appendChild(back);back.querySelector('.fsd-close').onclick=()=>back.remove();back.addEventListener('click',e=>{if(e.target===back)back.remove()});back.querySelectorAll('[data-meal]').forEach(btn=>btn.onclick=()=>{const mealId=btn.dataset.meal;if(addToDiary(item,mealId)){back.remove();confirmAdded(item,mealId)}else toast('追加できませんでした')});
  }

  function enhance(){const root=document.querySelector('#foodSearchView .fsx-results');if(!root)return;root.querySelectorAll('.fsx-item').forEach(card=>{if(card.querySelector('.fsx-add'))return;const btn=document.createElement('button');btn.type='button';btn.className='fsx-add';btn.textContent='ダイアリーに追加';btn.onclick=e=>{e.preventDefault();openSheet(card)};card.appendChild(btn)})}

  const settings=document.querySelector('#foodSearchView .fsx-settings');if(settings)settings.remove();enhance();const results=document.querySelector('#foodSearchView .fsx-results');if(results){const mo=new MutationObserver(()=>enhance());mo.observe(results,{childList:true})}
})();