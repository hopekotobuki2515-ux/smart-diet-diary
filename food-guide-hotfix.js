(()=>{
  if(window.__foodGuideReady) return;
  window.__foodGuideReady=true;

  const foods=[
    {g:1,name:'牛乳',keys:['牛乳','ミルク']},{g:1,name:'ヨーグルト',keys:['ヨーグルト']},{g:1,name:'チーズ',keys:['チーズ']},{g:1,name:'卵',keys:['卵','たまご','玉子']},
    {g:2,name:'肉類',keys:['肉','牛肉','豚肉','鶏肉','ハム','ソーセージ']},{g:2,name:'魚介類',keys:['魚','魚介','鮭','さけ','サバ','さば','まぐろ','マグロ','えび','エビ','いか','イカ']},{g:2,name:'豆腐',keys:['豆腐']},{g:2,name:'納豆',keys:['納豆']},{g:2,name:'大豆',keys:['大豆']},{g:2,name:'ツナ缶',keys:['ツナ','ツナ缶']},
    {g:3,name:'野菜',keys:['野菜','にんじん','人参','トマト','ほうれん草','キャベツ','レタス','大根','ピーマン']},{g:3,name:'きのこ',keys:['きのこ','キノコ','しいたけ','椎茸','しめじ','えのき']},{g:3,name:'海藻',keys:['海藻','わかめ','ワカメ','ひじき','昆布']},{g:3,name:'じゃがいも',keys:['じゃがいも','ジャガイモ','芋','いも']},{g:3,name:'さつまいも',keys:['さつまいも','サツマイモ']},{g:3,name:'果物',keys:['果物','フルーツ','りんご','リンゴ','みかん','バナナ','いちご','イチゴ']},
    {g:4,name:'ご飯',keys:['ご飯','ごはん','米']},{g:4,name:'パン',keys:['パン']},{g:4,name:'麺類',keys:['麺','うどん','そば','ラーメン','パスタ']},{g:4,name:'食用油',keys:['油','サラダ油','オリーブオイル','ごま油']},{g:4,name:'マヨネーズ',keys:['マヨネーズ','マヨ']},{g:4,name:'バター',keys:['バター']},{g:4,name:'砂糖',keys:['砂糖']}
  ];
  const labels={1:'第1群（乳・卵）',2:'第2群（肉・魚・豆）',3:'第3群（野菜・芋・果物・海藻）',4:'第4群（主食・油脂・調味料）'};
  const colors={1:'#eaf4ff',2:'#fff0f3',3:'#eff9eb',4:'#fff7e8'};

  const style=document.createElement('style');
  style.textContent=`
    .fdg-launch{width:100%;margin-top:12px;border:1px solid #efc7a4;background:#fff7ef;color:#a95518;border-radius:12px;padding:11px 12px;font-size:13px;font-weight:900;touch-action:manipulation}
    .fdg-backdrop{position:fixed;inset:0;z-index:120;background:rgba(44,36,30,.38);display:flex;align-items:flex-end;justify-content:center;padding:16px 12px calc(16px + env(safe-area-inset-bottom))}
    .fdg-sheet{width:min(500px,100%);max-height:82dvh;overflow:auto;-webkit-overflow-scrolling:touch;background:#fffaf5;border-radius:22px 22px 16px 16px;box-shadow:0 18px 50px rgba(55,35,20,.22);padding:16px}
    .fdg-head{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;margin-bottom:12px}
    .fdg-head h3{margin:0;font-size:20px}.fdg-head p{margin:4px 0 0;color:#75695f;font-size:12px;line-height:1.55}
    .fdg-close{flex:0 0 38px;width:38px;height:38px;border:0;border-radius:50%;background:#f2ebe5;font-size:22px;color:#6b584b;font-weight:800}
    .fdg-search{width:100%;border:1px solid #dfd5cd;background:#fff;border-radius:13px;padding:12px 13px;font-size:16px;outline:none}
    .fdg-search:focus{border-color:#f08a3c;box-shadow:0 0 0 3px rgba(240,138,60,.12)}
    .fdg-result{margin-top:10px;min-height:42px}.fdg-hit{border-radius:12px;padding:11px 12px;font-size:13px;line-height:1.55}.fdg-hit b{display:block;font-size:16px;margin-bottom:3px}.fdg-none{padding:10px 2px;color:#7b7067;font-size:12px}
    .fdg-groups{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}.fdg-card{border:1px solid #e5ddd5;border-radius:13px;padding:10px;min-height:116px}.fdg-card b{display:block;font-size:13px;margin-bottom:6px}.fdg-card span{display:block;font-size:11px;line-height:1.55;color:#5f554e}
    .fdg-tips{margin-top:12px;background:#fff;border:1px solid #eadfd5;border-radius:14px;padding:12px}.fdg-tips strong{display:block;font-size:13px;margin-bottom:6px}.fdg-tips div{font-size:11.5px;line-height:1.65;color:#5e534b;margin-top:4px}
    @media(max-width:390px){.fdg-sheet{padding:14px}.fdg-groups{gap:7px}.fdg-card{padding:9px}.fdg-card b{font-size:12px}.fdg-card span{font-size:10.5px}}
  `;
  document.head.appendChild(style);

  function ensureLaunch(){
    const guide=document.querySelector('#guideView');
    const box=guide?.querySelector('.guideExplain');
    if(!box||guide.querySelector('.fdg-launch')) return;
    const btn=document.createElement('button');
    btn.type='button';btn.className='fdg-launch';btn.textContent='🔎 これ何群？ 食材を検索';
    btn.addEventListener('click',openGuide);
    box.appendChild(btn);
  }

  function openGuide(){
    if(document.querySelector('.fdg-backdrop')) return;
    const back=document.createElement('div');back.className='fdg-backdrop';
    back.innerHTML=`<div class="fdg-sheet" role="dialog" aria-modal="true" aria-label="食材早見表">
      <div class="fdg-head"><div><h3>これ何群？ 食材早見表</h3><p>食材名を入力すると、該当する群をすぐ確認できます。</p></div><button class="fdg-close" type="button" aria-label="閉じる">×</button></div>
      <input class="fdg-search" type="search" inputmode="search" placeholder="例：豆腐、芋、マヨネーズ">
      <div class="fdg-result"><div class="fdg-none">検索するか、下の代表例を参考にしてください。</div></div>
      <div class="fdg-groups">
        <div class="fdg-card" style="background:${colors[1]}"><b>${labels[1]}</b><span>牛乳、ヨーグルト、チーズ、卵 など</span></div>
        <div class="fdg-card" style="background:${colors[2]}"><b>${labels[2]}</b><span>肉類、魚介類、豆腐、納豆、ツナ缶 など</span></div>
        <div class="fdg-card" style="background:${colors[3]}"><b>${labels[3]}</b><span>野菜、きのこ、わかめ、芋類、果物 など</span></div>
        <div class="fdg-card" style="background:${colors[4]}"><b>${labels[4]}</b><span>ご飯、パン、麺類、油、マヨネーズ、砂糖 など</span></div>
      </div>
      <div class="fdg-tips"><strong>迷いやすい食材</strong><div>大豆・豆腐・納豆 → <b>2群</b>（たんぱく質源として分類）</div><div>じゃがいも・さつまいも → <b>3群</b>（いも類として分類）</div><div>マヨネーズ・バター → <b>4群</b>（油脂類として分類）</div></div>
    </div>`;
    const input=back.querySelector('.fdg-search'),result=back.querySelector('.fdg-result');
    function run(){
      const q=input.value.trim().toLowerCase();
      if(!q){result.innerHTML='<div class="fdg-none">検索するか、下の代表例を参考にしてください。</div>';return;}
      const hits=foods.filter(f=>f.keys.some(k=>k.toLowerCase().includes(q)||q.includes(k.toLowerCase())));
      if(!hits.length){result.innerHTML='<div class="fdg-none">該当する代表食材が見つかりません。近い名前や一般的な食材名で試してください。</div>';return;}
      const best=hits[0],same=[...new Set(hits.map(h=>h.name))];
      result.innerHTML=`<div class="fdg-hit" style="background:${colors[best.g]}"><b>${labels[best.g]}</b>${same.join('、')}</div>`;
    }
    input.addEventListener('input',run);
    const close=()=>back.remove();
    back.querySelector('.fdg-close').addEventListener('click',close);
    back.addEventListener('click',e=>{if(e.target===back) close();});
    document.body.appendChild(back);
    setTimeout(()=>input.focus(),50);
  }

  ensureLaunch();
  document.addEventListener('click',e=>{if(e.target.closest('#openGuide,.guideBtn')) setTimeout(ensureLaunch,0);},true);
})();