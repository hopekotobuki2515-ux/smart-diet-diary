(()=>{
  if(window.__privateBalanceBarsLoaded) return;
  window.__privateBalanceBarsLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    .fsd-balance{margin-top:10px;border:1px solid #eee2d7;background:#fff;border-radius:16px;padding:12px}
    .fsd-balance-title{font-size:12px;font-weight:900;color:#574c45;margin-bottom:10px}
    .fsd-balance-row{display:grid;grid-template-columns:44px 1fr;gap:9px;align-items:center;margin-top:11px}
    .fsd-balance-label{font-size:10px;font-weight:900;color:#645850;white-space:nowrap}
    .fsd-track{position:relative;height:14px;background:#f2ece7;border-radius:999px;overflow:visible}
    .fsd-fill-normal,.fsd-fill-over{position:absolute;top:0;height:100%}
    .fsd-fill-normal{left:0;border-radius:999px}.fsd-fill-over{border-radius:0 999px 999px 0;background:#d94b4b}
    .fsd-target-line{position:absolute;top:-5px;bottom:-5px;border-left:2px dashed #5f554e;opacity:.8;z-index:3}
    .fsd-balance-meta{display:flex;justify-content:space-between;gap:8px;margin-top:5px;font-size:9.5px;color:#857970}
    .fsd-balance-meta strong{font-weight:900;color:#5d514a}
    .fsd-g1{background:#f28c28}.fsd-g2{background:#e85b5b}.fsd-g3{background:#67a957}.fsd-g4{background:#e4bd3f}
    .fsd-target-note{font-size:9px;color:#91857c;margin-top:10px;line-height:1.5}
    .pvd-backdrop{position:fixed;inset:0;z-index:210;background:rgba(42,34,28,.45);display:flex;align-items:center;justify-content:center;padding:14px}
    .pvd-card{width:min(500px,100%);max-height:89dvh;overflow:auto;-webkit-overflow-scrolling:touch;background:#fffaf5;border-radius:22px;padding:16px;box-shadow:0 18px 50px rgba(50,34,22,.25)}
    .pvd-head{display:flex;align-items:flex-start;justify-content:space-between;gap:10px}.pvd-kicker{font-size:10px;font-weight:900;color:#d8651e;letter-spacing:.05em}.pvd-head h3{margin:3px 0 0;font-size:19px;color:#493f38}.pvd-close{border:0;background:#f1eae4;border-radius:50%;width:34px;height:34px;font-size:19px;color:#66564b}
    .pvd-saved{margin:12px 0;padding:10px 12px;border-radius:13px;background:#fff1e6;color:#a45117;font-size:12px;font-weight:900}
    .pvd-compare{display:grid;grid-template-columns:1fr 1fr;gap:9px}.pvd-panel{min-width:0;border:1px solid #eee2d7;background:#fff;border-radius:16px;padding:11px}.pvd-panel.guide{background:#fffaf3}
    .pvd-label{font-size:10px;font-weight:900;color:#776b62;margin-bottom:7px}.pvd-photo{width:100%;aspect-ratio:4/3;object-fit:cover;border-radius:12px;background:#f2ece7;display:block}.pvd-empty{aspect-ratio:4/3;border-radius:12px;background:#f4eee8;display:grid;place-items:center;text-align:center;padding:10px;font-size:10px;color:#8a7e75}
    .pvd-mealname{margin-top:8px;font-size:12px;font-weight:900;color:#4d443e}.pvd-guide-main{font-size:12px;font-weight:900;color:#a95418;line-height:1.45}.pvd-guide-sub{margin-top:5px;font-size:10px;line-height:1.5;color:#7b7068}
    .pvd-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:13px}.pvd-actions button{min-height:44px;border-radius:12px;padding:10px 8px;font-size:12px;font-weight:900}.pvd-stay{border:1px solid #eadfd5;background:#fff;color:#5f5147}.pvd-search{border:0;background:#f47a2a;color:#fff}
    @media(max-width:390px){.pvd-card{padding:14px}.pvd-compare{gap:7px}.pvd-panel{padding:9px}}
  `;
  document.head.appendChild(style);

  const mealNames={breakfast:'朝食',lunch:'昼食',dinner:'夕食',snack:'間食'};
  const fmt=n=>Number(n||0).toFixed(1);
  const sumObj=o=>Object.values(o||{}).reduce((a,v)=>a+(Number(v)||0),0);

  function detectDailyTarget(){
    try{
      const cfg=JSON.parse(localStorage.getItem('sdd-settings')||'{}');
      const n=Number(cfg.targetPoints||cfg.dailyPoints||cfg.points);
      if(Number.isFinite(n)&&n>=12&&n<=30)return n;
      if(String(cfg.sex||'').toLowerCase().match(/male|男性|男/))return 21;
    }catch(e){}
    return 15;
  }
  function targetsFor(meal){
    if(meal==='snack')return {1:.5,2:.5,3:.5,4:.5};
    const daily=detectDailyTarget();
    return {1:1,2:1,3:1,4:Math.round(Math.max(1,(daily-9)/3)*10)/10};
  }
  function mealScores(m){
    const out={1:0,2:0,3:0,4:0};
    if(!m)return out;
    [1,2,3].forEach(g=>{out[g]=(Number(m.groupCounts?.[g])||0)+sumObj(m.subCounts?.[g])});
    out[4]=(Number(m.p4)||0)+(Number(m.hold4Count)||0)+sumObj(m.subCounts?.[4]);
    return out;
  }
  function rowHtml(g,actual,target){
    const max=Math.max(target*1.6,actual,0.1), targetPct=Math.min(100,target/max*100), normal=Math.min(actual,target), normalPct=Math.min(100,normal/max*100), over=Math.max(0,actual-target), overPct=Math.min(100-normalPct,over/max*100);
    return `<div class="fsd-balance-row"><div class="fsd-balance-label">第${g}群</div><div><div class="fsd-track"><div class="fsd-fill-normal fsd-g${g}" style="width:${normalPct}%"></div>${over>0?`<div class="fsd-fill-over" style="left:${normalPct}%;width:${overPct}%"></div>`:''}<div class="fsd-target-line" style="left:${targetPct}%"></div></div><div class="fsd-balance-meta"><strong>${fmt(actual)} / ${fmt(target)}点</strong><span>${over>0?`目安＋${fmt(over)}点`:'目安位置を確認'}</span></div></div></div>`;
  }
  function balanceHtml(scores,targets){
    return `<section class="fsd-balance"><div class="fsd-balance-title">四群バランス</div>${[1,2,3,4].map(g=>rowHtml(g,scores[g],targets[g])).join('')}<div class="fsd-target-note">破線が1食あたりの目安です。目安を超えた部分だけ警告色で表示しています。</div></section>`;
  }
  function currentMealId(){
    try{if(typeof openMeal!=='undefined'&&mealNames[openMeal])return openMeal}catch(e){}
    if(mealNames[window.__activeMealId])return window.__activeMealId;
    return 'breakfast';
  }
  function openNormalDiaryPrivateView(){
    const d=typeof dayData==='function'?dayData():null;
    if(!d)return;
    const mealId=currentMealId(),m=d[mealId]||{},scores=mealScores(m),targets=targetsFor(mealId);
    const old=document.querySelector('.pvd-backdrop');if(old)old.remove();
    const back=document.createElement('div');back.className='pvd-backdrop';
    const photo=m.img?`<img class="pvd-photo" src="${m.img}" alt="登録した食事">`:`<div class="pvd-empty">${mealNames[mealId]}の写真または<br>食品データを確認できます</div>`;
    const total=Object.values(scores).reduce((a,v)=>a+Number(v||0),0);
    back.innerHTML=`<div class="pvd-card" role="dialog" aria-modal="true" aria-label="食事の自己確認"><div class="pvd-head"><div><div class="pvd-kicker">PRIVATE VIEW</div><h3>食事の自己確認</h3></div><button class="pvd-close" aria-label="閉じる">×</button></div><div class="pvd-saved">登録しました（気づきを保存）</div><div class="pvd-compare"><section class="pvd-panel"><div class="pvd-label">あなたが食べたもの</div>${photo}<div class="pvd-mealname">${mealNames[mealId]}・合計 ${fmt(total)}点</div></section><section class="pvd-panel guide"><div class="pvd-label">あなたの適量ガイド</div><div class="pvd-guide-main">破線があなたの1食目安</div><div class="pvd-guide-sub">実際の点数と見比べて、どの群が足りているか・超えているかを確認できます。</div></section></div>${balanceHtml(scores,targets)}<div class="pvd-actions"><button class="pvd-stay">記録に戻る</button><button class="pvd-search">食品を確認する</button></div></div>`;
    document.body.appendChild(back);
    const close=()=>back.remove();
    back.querySelector('.pvd-close').onclick=close;back.querySelector('.pvd-stay').onclick=close;
    back.querySelector('.pvd-search').onclick=()=>{close();const btn=document.querySelector('.footnav button[data-view="foodSearchView"]');if(btn)btn.click()};
    back.addEventListener('click',e=>{if(e.target===back)close()});
  }

  function renderFoodSearchPrivateBalance(){
    const root=document.querySelector('.fsd-private');if(!root||root.querySelector('.fsd-balance'))return;
    const scores={1:0,2:0,3:0,4:0};root.querySelectorAll('.fsd-scoreline span').forEach(el=>{const m=(el.textContent||'').match(/第([1-4])群\s*([0-9.]+)点/);if(m)scores[Number(m[1])]=Number(m[2])||0});
    const text=root.querySelector('.fsd-panel-sub')?.textContent||'',meal=Object.entries(mealNames).find(([,v])=>text.includes(v))?.[0]||'breakfast';
    const section=document.createElement('div');section.innerHTML=balanceHtml(scores,targetsFor(meal));const node=section.firstElementChild;const nutrients=root.querySelector('.fsd-nutrients');if(nutrients)nutrients.before(node);else root.appendChild(node);
  }
  document.addEventListener('click',e=>{if(e.target.closest?.('.fsd-meals [data-meal]'))setTimeout(renderFoodSearchPrivateBalance,0)},true);

  const save=document.getElementById('saveDay');
  if(save){save.onclick=()=>{if(typeof persistDay==='function')persistDay(false);openNormalDiaryPrivateView()};}
})();
