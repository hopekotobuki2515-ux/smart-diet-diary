(()=>{
  let lastKey='', lastAt=0;
  document.addEventListener('click',e=>{
    const btn=e.target.closest('[data-count-step]');
    const grp=e.target.closest('.grp[data-g]');

    // 1〜3群のカード本体タップでは数を変えない。数の変更は＋−だけに限定。
    if(grp && !btn){
      const g=Number(grp.dataset.g);
      if(g>=1 && g<=3){
        e.preventDefault();
        e.stopImmediatePropagation();
        return;
      }
    }

    if(!btn) return;

    e.preventDefault();
    e.stopImmediatePropagation();

    const g=Number(btn.dataset.countG);
    const step=Number(btn.dataset.countStep);
    if(!(g>=1 && g<=3) || !Number.isFinite(step)) return;

    // iPhoneで同じ操作が短時間に重複発火しても1回だけ処理
    const key=`${window.__activeMealId||'breakfast'}-${g}-${step}`;
    const now=Date.now();
    if(key===lastKey && now-lastAt<300) return;
    lastKey=key; lastAt=now;

    const d=dayData();
    const id=window.__activeMealId||'breakfast';
    const m=d[id];
    if(!m) return;

    if(!m.groupCounts) m.groupCounts={1:0,2:0,3:0};
    const current=Math.max(0, Math.floor(Number(m.groupCounts[g])||0));
    m.groupCounts[g]=Math.max(0,current+step);

    const has4=Array.isArray(m.groups) && m.groups.includes(4);
    m.groups=[1,2,3].filter(x=>(Number(m.groupCounts[x])||0)>0);
    if(has4) m.groups.push(4);

    render();
  },true);
})();
