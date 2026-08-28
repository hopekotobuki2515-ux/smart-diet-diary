(()=>{
  if(window.__performanceHotfixLoaded)return;
  window.__performanceHotfixLoaded=true;

  const style=document.createElement('style');
  style.textContent=`
    .footnav>div{
      background:#fff!important;
      backdrop-filter:none!important;
      -webkit-backdrop-filter:none!important;
      box-shadow:0 5px 16px rgba(79,55,35,.10)!important;
    }
    .footnav button{
      transition:none!important;
      -webkit-tap-highlight-color:transparent!important;
      touch-action:manipulation!important;
    }
    .footnav button:active{transform:none!important}
  `;
  document.head.appendChild(style);

  const route=(btn)=>{
    const id=btn.dataset.view;
    if(!id)return;
    document.querySelectorAll('.view').forEach(v=>v.classList.toggle('active',v.id===id));
    document.querySelectorAll('.footnav button').forEach(b=>b.classList.toggle('active',b===btn));
    const app=document.querySelector('.app');
    if(app)app.scrollTop=0;
    if(id==='todayView'&&typeof window.render==='function')window.render();
    if(id==='healthView'&&typeof window.renderHealth==='function'&&typeof window.dayData==='function')window.renderHealth(window.dayData());
    if(id==='calendarView'&&typeof window.renderCalendar==='function')window.renderCalendar();
    if(id==='progressView'&&typeof window.renderProgress==='function')window.renderProgress();
    if(id==='settingsView'&&typeof window.loadSettings==='function')window.loadSettings();
  };

  const nav=document.querySelector('.footnav>div');
  if(!nav)return;

  const currentButtons=[...nav.querySelectorAll('button[data-view]')];
  currentButtons.forEach(oldBtn=>{
    const btn=oldBtn.cloneNode(true);
    oldBtn.replaceWith(btn);
    btn.addEventListener('click',e=>{
      e.preventDefault();
      route(btn);
    });
  });
})();
