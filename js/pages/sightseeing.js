(() => {
  "use strict";
  function safeUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.href : null; }
    catch { return null; }
  }
  function imageUrl(value) {
    if (typeof value !== "string" || !value.trim()) return null;
    try {
      const url = new URL(value, document.baseURI);
      return ["https:", "http:", "file:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  }
  function render(main) {
    const {el} = window.TravelUI;
    const data = window.TRIP_DATA?.sightseeing;
    const groups = Array.isArray(data?.groups) ? data.groups.filter(g => g && Array.isArray(g.spots) && g.spots.some(s => s && typeof s === "object")) : [];
    if (!groups.length) {
      main.append(el("p","notice","観光地はまだ登録されていません。")); return;
    }
    if (data.lead) main.append(el("p","places-lead",data.lead));
    const ids = new Set();
    function assignId(node, value, fallback) {
      const candidate = typeof value === "string" && /^[A-Za-z][A-Za-z0-9_-]*$/.test(value) ? value : fallback;
      let id = candidate, n = 2;
      while (ids.has(id) || document.getElementById(id)) id = candidate + "-" + n++;
      ids.add(id); node.id = id;
    }
    const jump = el("nav","places-jump"); jump.setAttribute("aria-label","観光地の分類への移動");
    const sections = [];
    groups.forEach((group, i) => {
      const section = el("section","places-section");
      assignId(section,group.id,"places-group-"+(i+1));
      const heading = el("div","places-heading");
      if(group.eyebrow) heading.append(el("span","eyebrow",group.eyebrow));
      heading.append(el("h2","section-title",group.title||"観光地"));
      if(group.description) heading.append(el("p","places-lead",group.description));
      section.append(heading);
      const shortcut=el("a","place-btn",group.title||"観光地"); shortcut.href="#"+section.id; jump.append(shortcut);
      const list=el("div","place-list");
      group.spots.filter(s=>s && typeof s==="object").forEach((spot,j)=>{
        const card=el("article","place-card");
        assignId(card,spot.id,"spot-"+(i+1)+"-"+(j+1));
        const title=spot.title||"観光スポット";
        const frames=el("div","place-media");
        const images=Array.isArray(spot.images)?spot.images:[];
        images.forEach(photo=>{
          const src=imageUrl(typeof photo==="string"?photo:photo?.src);
          if(!src)return;
          const frame=el("div","media-frame"),img=el("img");
          img.alt=(typeof photo==="object"&&photo?.alt)||title;
          img.loading="lazy";img.addEventListener("error",()=>{frame.remove();if(!frames.childElementCount)frames.remove();});
          img.src=src;frame.append(img);frames.append(frame);
        });
        if(frames.childElementCount){if(frames.childElementCount>1){frames.classList.add("is-gallery");frames.tabIndex=0;frames.setAttribute("aria-label",title+"の写真（横スクロール）");}card.append(frames);}
        const body=el("div","place-body");
        if(spot.category)body.append(el("span","place-category",spot.category));
        body.append(el("h3","",title));
        if(spot.description)body.append(el("p","place-description",spot.description));
        const details=el("dl","place-details");
        [["営業時間",spot.hours],["料金",spot.fee],["所要時間",spot.duration],["住所",spot.address],["アクセス",spot.access],["駐車場",spot.parking]].forEach(([label,value])=>{
          if(value){const row=el("div","place-detail");row.append(el("dt","",label),el("dd","",value));details.append(row);}
        });
        if(details.childElementCount)body.append(details);
        if(Array.isArray(spot.notes)&&spot.notes.length){const notes=el("ul","place-notes");spot.notes.forEach(note=>notes.append(el("li","",note)));body.append(notes);}
        const buttons=el("div","place-buttons");
        const query=typeof spot.mapQuery==="string"?spot.mapQuery.trim():"";
        const google=safeUrl(spot.googleMaps)||(query?"https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(query):null);
        const apple=safeUrl(spot.appleMaps)||(query?"https://maps.apple.com/?q="+encodeURIComponent(query):null);
        [[safeUrl(spot.website),"公式サイトを見る",true],[google,"Google Mapsを見る",false],[apple,"Apple Mapsを見る",false]].forEach(([url,label,primary])=>{
          if(!url)return;
          const a=el("a","place-btn"+(primary?" primary":""),label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";buttons.append(a);
        });
        if(buttons.childElementCount)body.append(buttons);
        card.append(body);list.append(card);
      });
      section.append(list);sections.push(section);
    });
    if(sections.length>1)main.append(jump);
    main.append(...sections);
    // JS生成後に、旅のしおり等から指定されたカードへ移動する。
    if(location.hash){
      let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);
      if(target&&main.contains(target))requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:"instant"}));
    }
  }
  window.TravelPages=window.TravelPages||{};
  window.TravelPages.sightseeing=render;
})();
