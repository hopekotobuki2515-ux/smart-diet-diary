(()=>{
  if(window.__finalRouteHotfix) return;
  window.__finalRouteHotfix=true;

  function showOnly(id){
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
    const app=document.querySelector('.app');
    if(app) app.scrollTop=0;
    window.scrollTo(0,0);
  }

  function ensureFoodSearchNav(){
    const nav=document.querySelector('.footnav>div');
    if(!nav) return;
    let btn=nav.querySelector('button[data-view="foodSearchView"]');
    if(!btn){
      btn=nav.querySelector('button[data-view="guideView"]') || nav.querySelector('button[data-view="settingsView"]');
      if(!btn) return;
      btn.dataset.view='foodSearchView';
    }
    btn.setAttribute('aria-label','食品検索');
    const label=btn.querySelector('.navLabel');
    if(label) label.textContent='食品検索';
    else btn.textContent='食品検索';
    const icon=btn.querySelector('.navIcon');
    if(icon) icon.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"></circle><path d="m20 20-4-4"></path></svg>';
  }

  function openFourGroupModal(){
    document.querySelectorAll('.qgm-backdrop,.finalQBackdrop').forEach(x=>x.remove());
    const back=document.createElement('div');
    back.className='finalQBackdrop';
    back.innerHTML=`<div class="finalQModal" role="dialog" aria-modal="true" aria-label="四群の説明">
      <div class="finalQHead"><h2>四群点数法とは？</h2><button type="button" aria-label="閉じる">×</button></div>
      <p>食品を栄養の特徴ごとに4つの群に分け、<strong>1点＝80kcal</strong>を目安に、食事全体のバランスを確認する方法です。</p>
      <div class="finalQWheel">
        <div class="fq q1"><b>第1群</b><span>牛乳・乳製品<br>卵</span></div>
        <div class="fq q2"><b>第2群</b><span>魚介・肉<br>豆・豆製品</span></div>
        <div class="fq q3"><b>第3群</b><span>野菜<br>きのこ・海藻<br>いも・果物</span></div>
        <div class="fq q4"><b>第4群</b><span>主食・調味料<br>油脂<br>その他</span></div>
        <div class="finalQCenter">1点＝<br>80kcal</div>
      </div>
      <p class="finalQNote">「何点食べたか」だけでなく、「どの群から食べたか」を見ることで、食事の偏りに気づきやすくなります。</p>
    </div>`;
    const close=()=>back.remove();
    back.querySelector('button').onclick=close;
    back.addEventListener('click',e=>{if(e.target===back) close();});
    document.body.appendChild(back);
  }

  const style=document.createElement('style');
  style.textContent=`
    .finalQBackdrop{position:fixed;inset:0;z-index:999;background:rgba(35,28,24,.46);display:flex;align-items:center;justify-content:center;padding:16px}
    .finalQModal{width:min(500px,100%);max-height:90dvh;overflow:auto;background:#fffaf5;border-radius:22px;padding:18px;box-shadow:0 18px 50px rgba(0,0,0,.25);color:#554a42}
    .finalQHead{display:flex;align-items:center;justify-content:space-between;gap:12px}.finalQHead h2{margin:0;font-size:21px}.finalQHead button{width:38px;height:38px;border:0;border-radius:50%;background:#f1eae4;font-size:22px;color:#66564b}
    .finalQModal>p{font-size:13px;line-height:1.7;margin:12px 0}.finalQNote{margin-top:12px!important;color:#74675e}
    .finalQWheel{position:relative;display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;width:min(310px,82vw);aspect-ratio:1;margin:14px auto;border-radius:50%;overflow:hidden;border:6px solid #fff;box-shadow:0 4px 18px rgba(70,45,20,.12)}
    .fq{display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:10px 8px}.fq b{font-size:17px}.fq span{font-size:10px;line-height:1.4;margin-top:5px;font-weight:800}.q1{background:#d9ecff}.q2{background:#ffe0e0}.q3{background:#dff3dc}.q4{background:#fff0c8}
    .finalQCenter{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:104px;height:104px;border-radius:50%;background:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font-weight:900;box-shadow:0 3px 12px rgba(70,45,20,.10)}
  `;
  document.head.appendChild(style);

  const reapply=()=>ensureFoodSearchNav();
  reapply();
  requestAnimationFrame(reapply);
  setTimeout(reapply,150);
  setTimeout(reapply,500);

  const mo=new MutationObserver(()=>requestAnimationFrame(reapply));
  const navRoot=document.querySelector('.footnav');
  if(navRoot) mo.observe(navRoot,{childList:true,subtree:true,attributes:true,attributeFilter:['data-view']});

  document.addEventListener('click',e=>{
    const foodBtn=e.target.closest('.footnav button[data-view="foodSearchView"]');
    if(foodBtn){
      e.preventDefault();e.stopImmediatePropagation();
      showOnly('foodSearchView');
      document.querySelectorAll('.footnav button').forEach(b=>b.classList.toggle('active',b===foodBtn));
      return;
    }
    const guideBtn=e.target.closest('#openGuide,.guideBtn');
    if(guideBtn){
      e.preventDefault();e.stopImmediatePropagation();
      openFourGroupModal();
    }
  },true);

  document.addEventListener('touchend',e=>{
    const foodBtn=e.target.closest('.footnav button[data-view="foodSearchView"]');
    if(foodBtn){
      e.preventDefault();e.stopImmediatePropagation();
      showOnly('foodSearchView');
      document.querySelectorAll('.footnav button').forEach(b=>b.classList.toggle('active',b===foodBtn));
      return;
    }
    const guideBtn=e.target.closest('#openGuide,.guideBtn');
    if(guideBtn){
      e.preventDefault();e.stopImmediatePropagation();
      openFourGroupModal();
    }
  },{capture:true,passive:false});
})();