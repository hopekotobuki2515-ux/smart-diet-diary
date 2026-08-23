(()=>{
  const style=document.createElement('style');
  style.textContent=`
    .photoMini{display:inline-flex;align-items:center;justify-content:center;gap:6px;cursor:pointer}
    .photoStrip{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin:10px 0 6px}
    .photoThumb{position:relative;aspect-ratio:1/1;border-radius:12px;overflow:hidden;border:1px solid #eadfd5;background:#f8f3ef}
    .photoThumb img{width:100%;height:100%;object-fit:cover;display:block}
    .photoDelete{position:absolute;right:5px;top:5px;width:44px;height:44px;border:0;border-radius:50%;background:rgba(32,32,32,.72);color:#fff;font-size:24px;font-weight:900;display:grid;place-items:center;box-shadow:0 2px 6px rgba(0,0,0,.18);touch-action:manipulation;z-index:3}
    .photoCount{font-size:10px;color:#8b6f59;margin-top:3px;text-align:right}
    .photoMini.isFull{opacity:.55;pointer-events:none}
  `;
  document.head.appendChild(style);

  function getMeal(){
    if(typeof dayData!=='function') return null;
    const d=dayData();
    const id=window.__activeMealId||'breakfast';
    return {d,id,m:d[id]};
  }

  function ensureImgs(m){
    if(!Array.isArray(m.imgs)) m.imgs=[];
    if(m.img && !m.imgs.includes(m.img)) m.imgs.unshift(m.img);
    m.imgs=m.imgs.filter(Boolean).slice(0,3);
    m.img=m.imgs[0]||null;
  }

  function persist(d){
    try{ localStorage.setItem('sdd-'+keyDate(current),JSON.stringify(d)); }catch(e){ console.error('photo save',e); }
  }

  function compressFile(file){
    return new Promise(resolve=>compress(file,resolve));
  }

  function enhancePhotos(){
    const ctx=getMeal();
    const wrap=document.getElementById('meals');
    if(!ctx||!wrap) return;
    const {d,m}=ctx;
    ensureImgs(m);

    const oldPreview=wrap.querySelector('.preview');
    if(oldPreview) oldPreview.remove();

    let strip=wrap.querySelector('.photoStrip');
    if(!strip){
      strip=document.createElement('div');
      strip.className='photoStrip';
      const top=wrap.querySelector('.mealTop');
      if(top) top.insertAdjacentElement('afterend',strip);
    }
    strip.innerHTML=m.imgs.map((src,i)=>`<div class="photoThumb"><img src="${src}" alt="食事写真${i+1}"><button type="button" class="photoDelete" data-photo-delete="${i}" aria-label="写真${i+1}を削除">×</button></div>`).join('');
    strip.style.display=m.imgs.length?'grid':'none';

    const label=wrap.querySelector('.photoMini');
    if(label){
      let input=label.querySelector('input[type=file]');
      if(input){
        const fresh=input.cloneNode(true);
        input.replaceWith(fresh);
        input=fresh;
        input.multiple=true;
        input.removeAttribute('capture');
        input.onchange=async e=>{
          const files=[...(e.target.files||[])];
          if(!files.length) return;
          ensureImgs(m);
          const slots=Math.max(0,3-m.imgs.length);
          const chosen=files.slice(0,slots);
          for(const f of chosen){
            const data=await compressFile(f);
            if(data) m.imgs.push(data);
          }
          ensureImgs(m);persist(d);render();
        };
      }
      label.childNodes[0].textContent='📷 写真を追加';
      label.classList.toggle('isFull',m.imgs.length>=3);
      let count=label.parentElement?.querySelector('.photoCount');
      if(!count){count=document.createElement('div');count.className='photoCount';label.insertAdjacentElement('afterend',count)}
      count.textContent=`${m.imgs.length} / 3枚`;
    }

    wrap.querySelectorAll('[data-photo-delete]').forEach(btn=>btn.onclick=e=>{
      e.preventDefault();e.stopPropagation();
      const i=Number(btn.dataset.photoDelete);
      ensureImgs(m);
      if(i>=0&&i<m.imgs.length){
        m.imgs.splice(i,1);
        m.img=m.imgs[0]||null;
        persist(d);
        render();
      }
    });
  }

  if(typeof window.render==='function'){
    const base=window.render;
    window.render=function(){const r=base.apply(this,arguments);requestAnimationFrame(enhancePhotos);return r;};
  }
  requestAnimationFrame(enhancePhotos);
})();
