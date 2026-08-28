(()=>{
  if(window.__privateBalanceBarsLoaded) return;
  window.__privateBalanceBarsLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    .fsd-balance{margin-top:10px;border:1px solid #eee2d7;background:#fff;border-radius:16px;padding:12px}
    .fsd-balance-title{font-size:11px;font-weight:900;color:#574c45;margin-bottom:10px}
    .fsd-balance-row{display:grid;grid-template-columns:44px 1fr;gap:9px;align-items:center;margin-top:10px}
    .fsd-balance-row:first-of-type{margin-top:0}
    .fsd-balance-label{font-size:10px;font-weight:900;color:#645850;white-space:nowrap}
    .fsd-balance-main{min-width:0}
    .fsd-track{position:relative;height:13px;background:#f2ece7;border-radius:999px;overflow:visible}
    .fsd-fill-normal,.fsd-fill-over{position:absolute;left:0;top:0;height:100%;border-radius:999px}
    .fsd-fill-over{border-radius:0 999px 999px 0;background:#d94b4b}
    .fsd-target-line{position:absolute;top:-4px;bottom:-4px;border-left:2px dashed #6d625b;opacity:.75;z-index:3}
    .fsd-balance-meta{display:flex;justify-content:space-between;gap:8px;margin-top:5px;font-size:9.5px;color:#857970}
    .fsd-balance-meta strong{font-weight:900;color:#5d514a}
    .fsd-g1{background:#f28c28}.fsd-g2{background:#e85b5b}.fsd-g3{background:#67a957}.fsd-g4{background:#e4bd3f}
    .fsd-target-note{font-size:9px;color:#91857c;margin-top:9px;line-height:1.45}
  `;
  document.head.appendChild(style);

  function readScores(root){
    const scores={1:0,2:0,3:0,4:0};
    root.querySelectorAll('.fsd-scoreline span').forEach(el=>{
      const m=(el.textContent||'').match(/第([1-4])群\s*([0-9.]+)点/);
      if(m)scores[Number(m[1])]=Number(m[2])||0;
    });
    return scores;
  }

  function detectDailyTarget(){
    const direct=[window.__sddDailyPointTarget,window.dailyPointTarget,window.targetPoints,window.settings?.targetPoints].map(Number).find(v=>Number.isFinite(v)&&v>=12&&v<=30);
    if(direct)return direct;
    try{
      for(let i=0;i<localStorage.length;i++){
        const raw=localStorage.getItem(localStorage.key(i));
        if(!raw)continue;
        let obj;try{obj=JSON.parse(raw)}catch(e){continue}
        const stack=[obj];
        while(stack.length){
          const cur=stack.pop();if(!cur||typeof cur!=='object')continue;
          for(const [k,v] of Object.entries(cur)){
            if(v&&typeof v==='object'){stack.push(v);continue}
            if(/target.*point|point.*target|daily.*point/i.test(k)){
              const n=Number(v);if(Number.isFinite(n)&&n>=12&&n<=30)return n;
            }
            if(/gender|sex|性別/i.test(k)){
              const s=String(v).toLowerCase();
              if(/male|男性|男/.test(s))return 21;
              if(/female|女性|女/.test(s))return 15;
            }
          }
        }
      }
    }catch(e){}
    return 15;
  }

  function detectMeal(root){
    const t=root.querySelector('.fsd-panel-sub')?.textContent||'';
    if(t.includes('間食'))return 'snack';
    if(t.includes('朝食'))return 'breakfast';
    if(t.includes('昼食'))return 'lunch';
    if(t.includes('夕食'))return 'dinner';
    return 'meal';
  }

  function targetsFor(meal){
    if(meal==='snack')return {1:.5,2:.5,3:.5,4:.5};
    const daily=detectDailyTarget();
    const g4=Math.max(1,(daily-9)/3);
    return {1:1,2:1,3:1,4:Math.round(g4*10)/10};
  }

  function fmt(n){return Number(n).toFixed(1)}

  function rowHtml(g,actual,target){
    const max=Math.max(target*1.5,actual,0.1);
    const targetPct=Math.min(100,(target/max)*100);
    const normal=Math.min(actual,target);
    const normalPct=Math.min(100,(normal/max)*100);
    const over=Math.max(0,actual-target);
    const overPct=Math.min(100-normalPct,(over/max)*100);
    const overLeft=normalPct;
    return `<div class="fsd-balance-row">
      <div class="fsd-balance-label">第${g}群</div>
      <div class="fsd-balance-main">
        <div class="fsd-track">
          <div class="fsd-fill-normal fsd-g${g}" style="width:${normalPct}%"></div>
          ${over>0?`<div class="fsd-fill-over" style="left:${overLeft}%;width:${overPct}%"></div>`:''}
          <div class="fsd-target-line" style="left:${targetPct}%" aria-hidden="true"></div>
        </div>
        <div class="fsd-balance-meta"><strong>${fmt(actual)} / ${fmt(target)}点</strong><span>${over>0?`目標＋${fmt(over)}点`:'目標線まで'}</span></div>
      </div>
    </div>`;
  }

  function renderInto(root){
    if(!root||root.querySelector('.fsd-balance'))return;
    const scores=readScores(root);
    const meal=detectMeal(root);
    const targets=targetsFor(meal);
    const section=document.createElement('section');
    section.className='fsd-balance';
    section.innerHTML=`<div class="fsd-balance-title">四群バランス</div>${[1,2,3,4].map(g=>rowHtml(g,scores[g],targets[g])).join('')}<div class="fsd-target-note">破線が1食あたりの目安位置です。目標線を超えた部分だけ警告色で表示します。</div>`;
    const nutrients=root.querySelector('.fsd-nutrients');
    if(nutrients)nutrients.insertAdjacentElement('beforebegin',section);
    else root.appendChild(section);
  }

  document.addEventListener('click',e=>{
    const mealBtn=e.target.closest?.('.fsd-meals [data-meal]');
    if(!mealBtn)return;
    setTimeout(()=>renderInto(document.querySelector('.fsd-private')),0);
  },true);
})();
