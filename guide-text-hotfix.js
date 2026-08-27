(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .guideExplain{
      margin:12px 0 16px!important;
      padding:14px 15px!important;
      background:#fffaf5!important;
      border:1px solid #eadfd5!important;
      border-radius:14px!important;
      color:#554a42!important;
      font-size:13px!important;
      line-height:1.75!important;
      text-align:left!important;
    }
    .guideExplain strong{color:#b95c17!important;font-weight:900!important}
    .guideExplain .guideExplainLead{display:block;margin-bottom:7px;font-size:14px;font-weight:900;color:#3f3833}
    .guideExplain .guideExplainNote{display:block;margin-top:8px;font-size:12px;color:#75695f}
  `;
  document.head.appendChild(style);

  function addGuideExplanation(){
    const wrap=document.querySelector('#guideView .guideWheelWrap');
    if(!wrap||wrap.querySelector('.guideExplain')) return;
    const wheel=wrap.querySelector('.guideWheel');
    if(!wheel) return;
    const box=document.createElement('div');
    box.className='guideExplain';
    box.innerHTML=`<span class="guideExplainLead">四群点数法とは？</span>
      食品を栄養の特徴ごとに<strong>4つの群</strong>に分け、<strong>1点＝80kcal</strong>を共通の目安として、食事全体のバランスを確認する方法です。<br>
      1〜3群は、乳・卵、魚・肉・豆、野菜・果物などの食品を中心に確認し、4群では主食・油脂・調味料などを見ます。
      <span class="guideExplainNote">「何点食べたか」だけでなく、「どの群から食べたか」を見ることで、食事の偏りに気づきやすくなります。</span>`;
    wrap.insertBefore(box,wheel);
  }

  addGuideExplanation();
  document.addEventListener('click',e=>{
    if(e.target.closest('#openGuide,.guideBtn')) setTimeout(addGuideExplanation,0);
  },true);
})();