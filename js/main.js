(() => {
  "use strict";
  const c=window.TRIP_CONFIG, ui=window.TravelUI;
  const main=document.querySelector("main");
  if(!c||!ui){main.textContent="設定ファイルを読み込めませんでした。";return;}
  const {el,pages,enabled,dates}=ui;
  const current=document.body.dataset.page || "index";
  const page=pages.find(p=>p.id===current)||pages[0];
  const themes=["classic","ocean","nature","urban","warm","luxury"];
  document.documentElement.dataset.theme=themes.includes(c.theme)?c.theme:"classic";
  document.title=page.label+" | "+(c.subtitle||c.title);
  document.querySelector('meta[name="description"]').content=(c.title||"旅行")+"の情報共有サイト";
  ui.mount(c,current);
  if(current!=="index"){
    main.className="inner-main container";
    if(current!=="quiz" || !enabled(c,page)) main.append(el("span","eyebrow",({schedule:"SCHEDULE",sightseeing:"SIGHTSEEING",hotel:"HOTEL",belongings:"BELONGINGS",members:"MEMBERS",memo:"MEMO"})[current]||"TRIP INFORMATION"),el("h1","page-title",page.label));
    if(!enabled(c,page)){main.append(el("p","notice","この旅行ではこのページを使用していません。"));return;}
    const render=window.TravelPages?.[current];
    if(typeof render==="function"){render(main,c);return;}
    main.append(el("p","notice","このページは準備中です。STEP 5以降で実装します。"));return;
  }
  const hero=el("section","hero"); hero.setAttribute("aria-label","旅行メインビジュアル");
  const slides=(Array.isArray(c.heroImages)?c.heroImages:[]).map(src=>{
    const img=el("img","hero-slide");img.src=src;img.alt="";img.setAttribute("aria-hidden","true");
    img.addEventListener("error",()=>img.remove());hero.append(img);return img;
  });
  if(slides.length)slides[0].classList.add("is-active");
  let active=0;
  if(slides.length>1&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
    setInterval(()=>{const available=slides.filter(s=>s.isConnected);if(available.length<2){available[0]?.classList.add("is-active");return;}available.forEach(s=>s.classList.remove("is-active"));active=(active+1)%available.length;available[active].classList.add("is-active");},5000);
  }
  const content=el("div","hero-content");
  content.append(el("div","hero-kicker",c.subtitle),el("h1","hero-title",c.title),el("div","hero-date",dates(c)));
  const scroll=el("a","hero-scroll","スクロール ↓");scroll.href="#trip-menu";
  hero.append(content,scroll);main.append(hero);
  const section=el("section","home-links");section.id="trip-menu";
  const container=el("div","container"),grid=el("div","nav-card-grid");
  pages.filter(p=>p.id!=="index"&&enabled(c,p)).forEach((p,i)=>{
    const a=el("a","nav-card");a.href=p.id+".html";
    a.append(el("small","",String(i+1).padStart(2,"0")),el("h2","",p.label),el("p","",p.description));grid.append(a);
  });
  container.append(el("span","eyebrow","TRIP MENU"),el("h2","section-title","旅の情報を見る"),grid);section.append(container);main.append(section);
})();
