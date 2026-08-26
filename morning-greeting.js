(()=>{
  function updateMorningGreeting(){
    const hero=document.querySelector('#healthView .healthHero');
    if(!hero)return;

    const now=new Date();
    const hour=now.getHours();
    const isMorning=hour>=5&&hour<10;

    hero.style.display=isMorning?'':'none';
  }

  updateMorningGreeting();
  setInterval(updateMorningGreeting,60000);
})();
