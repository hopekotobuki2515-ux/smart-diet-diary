(()=>{
  if(window.__foodSearchSummaryLoaded) return;
  window.__foodSearchSummaryLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    #foodSearchView .fsx-session-summary{
      margin-top:12px;
      background:#fff;
      border:1px solid #eee2d7;
      border-radius:18px;
      padding:14px;
      box-shadow:0 3px 14px rgba(70,45,20,.05);
    }
    #foodSearchView .fsx-session-title{
      margin:0 0 10px;
      font-size:12px;
      font-weight:900;
      color:#5f5147;
    }
    #foodSearchView .fsx-session-grid{
      display:grid;
      grid-template-columns:repeat(5,1fr);
      gap:6px;
    }
    #foodSearchView .fsx-session-cell{
      min-width:0;
      border-radius:12px;
      padding:9px 3px;
      text-align:center;
      background:#fff8f2;
    }
    #foodSearchView .fsx-session-cell b{
      display:block;
      font-size:10px;
      color:#7a6a5f;
      margin-bottom:3px;
      white-space:nowrap;
    }
    #foodSearchView .fsx-session-cell strong{
      display:block;
      font-size:16px;
      line-height:1.1;
      color:#4f433b;
    }
    #foodSearchView .fsx-session-cell.total{
      background:#fff0e5;
    }
    #foodSearchView .fsx-session-cell.total strong{
      color:#d8651e;
    }
    @media(max-width:390px){
      #foodSearchView .fsx-session-summary{padding:12px 10px}
      #foodSearchView .fsx-session-grid{gap:4px}
      #foodSearchView .fsx-session-cell{padding:8px 2px}
      #foodSearchView .fsx-session-cell b{font-size:9.5px}
      #foodSearchView .fsx-session-cell strong{font-size:15px}
    }
  `;
  document.head.appendChild(style);

  const totals={1:0,2:0,3:0,4:0};
  let pendingScores=null;

  function roundHalf(n){return Math.round((Number(n)||0)*2)/2}
  function fmt(n){
    const v=roundHalf(n);
    return Number.isInteger(v)?String(v):v.toFixed(1);
  }

  function createSummary(){
    const wrap=document.querySelector('#foodSearchView .fsx-wrap');
    const card=wrap?.querySelector('.fsx-card');
    if(!wrap||!card) return null;
    let summary=wrap.querySelector('.fsx-session-summary');
    if(summary) return summary;
    summary=document.createElement('section');
    summary.className='fsx-session-summary';
    summary.setAttribute('aria-label','今回追加した食品の合計点数');
    summary.innerHTML=`
      <div class="fsx-session-title">今回追加した食品の合計</div>
      <div class="fsx-session-grid">
        <div class="fsx-session-cell"><b>第1群</b><strong data-sum="1">0</strong></div>
        <div class="fsx-session-cell"><b>第2群</b><strong data-sum="2">0</strong></div>
        <div class="fsx-session-cell"><b>第3群</b><strong data-sum="3">0</strong></div>
        <div class="fsx-session-cell"><b>第4群</b><strong data-sum="4">0</strong></div>
        <div class="fsx-session-cell total"><b>合計</b><strong data-sum="total">0</strong></div>
      </div>`;
    card.insertAdjacentElement('afterend',summary);
    return summary;
  }

  function render(){
    const summary=createSummary();
    if(!summary) return;
    [1,2,3,4].forEach(g=>{
      const el=summary.querySelector(`[data-sum="${g}"]`);
      if(el) el.textContent=fmt(totals[g]);
    });
    const total=[1,2,3,4].reduce((s,g)=>s+Number(totals[g]||0),0);
    const el=summary.querySelector('[data-sum="total"]');
    if(el) el.textContent=fmt(total);
  }

  function readScoresFromSheet(sheet){
    const scores={1:0,2:0,3:0,4:0};
    sheet?.querySelectorAll('.fsd-score span').forEach(el=>{
      const m=(el.textContent||'').match(/第([1-4])群\s*([0-9.]+)点/);
      if(m) scores[Number(m[1])]=Number(m[2])||0;
    });
    return scores;
  }

  document.addEventListener('click',e=>{
    const mealBtn=e.target.closest?.('.fsd-meals [data-meal]');
    if(!mealBtn) return;
    pendingScores=readScoresFromSheet(mealBtn.closest('.fsd-sheet'));
    setTimeout(()=>{
      if(!pendingScores) return;
      if(!document.querySelector('.fsd-confirm')){pendingScores=null;return;}
      [1,2,3,4].forEach(g=>{totals[g]=roundHalf(totals[g]+pendingScores[g])});
      pendingScores=null;
      render();
    },0);
  },true);

  createSummary();
  render();
})();
