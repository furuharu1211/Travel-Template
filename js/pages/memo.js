(() => {
  "use strict";
  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value);
      return ["https:", "http:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function render(main) {
    const {el}=window.TravelUI;
    const data=window.TRIP_DATA?.memo;
    const memos=Array.isArray(data)?data.filter(m=>m&&typeof m.title==="string"&&m.title.trim()):[];
    if(!memos.length){main.append(el("p","notice","旅行メモはまだ登録されていません。"));return;}
    const stack=el("div","memo-stack");
    memos.forEach(memo=>{
      const card=el("article","memo-card");
      card.append(el("h2","memo-title",memo.title));
      if(typeof memo.text==="string"&&memo.text.trim())card.append(el("p","memo-text",memo.text));
      const links=el("div","memo-links");
      (Array.isArray(memo.links)?memo.links:[]).forEach(link=>{
        const url=safeUrl(link?.url);
        if(!url||typeof link.label!=="string"||!link.label.trim())return;
        const a=el("a","memo-btn",link.label);
        a.href=url;a.target="_blank";a.rel="noopener noreferrer";
        links.append(a);
      });
      if(links.childElementCount)card.append(links);
      stack.append(card);
    });
    main.append(stack);
  }
  window.TravelPages=window.TravelPages||{};
  window.TravelPages.memo=render;
})();
