(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .measure-card{padding:14px 15px;margin-top:12px}
    .measure-title{font-size:16px;font-weight:800;margin:0 0 10px}
    .measure-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    .measure-field{display:block;font-size:12px;font-weight:700;color:#5f5147}
    .measure-input-wrap{display:flex;align-items:center;gap:6px;margin-top:6px;background:#fffaf6;border:1px solid #e8d9cc;border-radius:12px;padding:0 10px}
    .measure-input{width:100%;min-width:0;border:0;outline:0;background:transparent;padding:11px 0;font-size:18px;font-weight:800;color:var(--ink)}
    .measure-unit{font-size:12px;color:var(--muted);font-weight:700}
    .measure-note{font-size:11px;color:var(--muted);margin-top:8px;line-height:1.5}
  `;
  document.head.appendChild(style);

  const dateKey=()=>typeof keyDate==='function'&&typeof current!=='undefined'?keyDate(current):new Date().toISOString().slice(0,10);
  const storeKey=()=>`sdd-measure-${dateKey()}`;
  const getData=()=>{try{return JSON.parse(localStorage.getItem(storeKey()))||{}}catch(e){return{}}};
  const setData=data=>localStorage.setItem(storeKey(),JSON.stringify(data));

  function renderMeasurements(){
    const old=document.getElementById('dailyMeasurements');
    if(old)old.remove();
    const dateSection=document.querySelector('.datebar')?.closest('.section');
    if(!dateSection)return;
    const data=getData();
    const section=document.createElement('section');
    section.className='section';
    section.id='dailyMeasurements';
    section.innerHTML=`<div class="card measure-card"><div class="measure-title">からだの記録</div><div class="measure-grid"><label class="measure-field">体重<div class="measure-input-wrap"><input id="weightInput" class="measure-input" type="number" inputmode="decimal" min="20" max="300" step="0.1" placeholder="--" value="${data.weight??''}"><span class="measure-unit">kg</span></div></label><label class="measure-field">腹囲<div class="measure-input-wrap"><input id="waistInput" class="measure-input" type="number" inputmode="decimal" min="30" max="250" step="0.1" placeholder="--" value="${data.waist??''}"><span class="measure-unit">cm</span></div></label></div><div class="measure-note">毎日でなくてもOK。測った日に入力してください。</div></div>`;
    dateSection.insertAdjacentElement('afterend',section);
    const saveNow=()=>setData({weight:document.getElementById('weightInput').value,waist:document.getElementById('waistInput').value});
    document.getElementById('weightInput').addEventListener('change',saveNow);
    document.getElementById('waistInput').addEventListener('change',saveNow);
  }

  window.addEventListener('DOMContentLoaded',renderMeasurements);
  const prev=document.getElementById('prevDay'),next=document.getElementById('nextDay');
  if(prev)prev.addEventListener('click',()=>setTimeout(renderMeasurements,0));
  if(next)next.addEventListener('click',()=>setTimeout(renderMeasurements,0));
  const save=document.getElementById('saveDay');
  if(save)save.addEventListener('click',()=>{
    const w=document.getElementById('weightInput'),wa=document.getElementById('waistInput');
    if(w&&wa)setData({weight:w.value,waist:wa.value});
  });
  const clear=document.getElementById('clearDay');
  if(clear)clear.addEventListener('click',()=>setTimeout(()=>{localStorage.removeItem(storeKey());renderMeasurements()},0));
  renderMeasurements();
})();