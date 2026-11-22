window.TravelUI = (() => {
  const pages = [
  {
    "id": "index",
    "label": "HOME",
    "description": "トップページ"
  },
  {
    "id": "schedule",
    "label": "旅のしおり",
    "description": "日程・移動をまとめたタイムライン"
  },
  {
    "id": "sightseeing",
    "label": "観光地",
    "description": "旅先の見どころ"
  },
  {
    "id": "quiz",
    "label": "観光地クイズ",
    "description": "旅先を楽しく予習"
  },
  {
    "id": "hotel",
    "label": "宿泊施設",
    "description": "宿泊先の情報"
  },
  {
    "id": "belongings",
    "label": "持ち物",
    "description": "持ち物チェックリスト"
  },
  {
    "id": "members",
    "label": "参加メンバー",
    "description": "旅の仲間"
  },
  {
    "id": "memo",
    "label": "旅行メモ",
    "description": "注意事項・共有情報"
  }
];
  function el(tag, cls, text) {
    const node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function enabled(c, p) { return p.id === "index" || c.features?.[p.id] === true; }
  function link(page, current) {
    const a = el("a", "", page.label);
    a.href = page.id + ".html";
    if (page.id === current) a.setAttribute("aria-current","page");
    return a;
  }
  function dates(c) {
    const start = String(c.startDate || "").replaceAll("-", ".");
    const end = String(c.endDate || "").replaceAll("-", ".");
    return [start, end === start ? "" : end].filter(Boolean).join(" — ");
  }
  function mount(c, current) {
    const header = el("header","site-header");
    const inner = el("div","header-inner");
    const brand = el("a","brand"); brand.href="index.html"; brand.setAttribute("aria-label","HOMEへ戻る");
    if(c.logo) { const img=el("img"); img.src=c.logo; img.alt=""; img.addEventListener("error",()=>img.remove()); brand.append(img); }
    brand.append(el("span","",c.subtitle || c.title));
    const button=el("button","menu-toggle","☰"); button.type="button";
    button.setAttribute("aria-label","メニューを開く"); button.setAttribute("aria-expanded","false"); button.setAttribute("aria-controls","mobile-menu");
    const menu=el("div","mobile-menu"); menu.id="mobile-menu"; menu.hidden=true;
    const nav=el("nav"); nav.setAttribute("aria-label","メインナビゲーション");
    pages.filter(p=>enabled(c,p)).forEach(p=>nav.append(link(p,current)));
    menu.append(nav); inner.append(brand,button); header.append(inner,menu);
    function toggle(open) { menu.hidden=!open; button.textContent=open?"×":"☰"; button.setAttribute("aria-expanded",String(open)); button.setAttribute("aria-label",open?"メニューを閉じる":"メニューを開く"); }
    button.addEventListener("click",()=>toggle(menu.hidden));
    document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!menu.hidden){toggle(false);button.focus();}});
    document.addEventListener("click",e=>{if(!header.contains(e.target))toggle(false);});
    document.querySelector("#site-header").replaceWith(header);
    const footer=el("footer","site-footer"), box=el("div","container");
    const home=link(pages[0],current); home.className="footer-home"; home.textContent="HOMEへ戻る";
    box.append(el("div","footer-title",c.subtitle||c.title),el("div","footer-date",dates(c)),home);
    footer.append(box); document.querySelector("#site-footer").replaceWith(footer);
  }
  return {pages,el,enabled,dates,mount};
})();
