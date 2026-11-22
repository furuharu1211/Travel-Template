(() => {
  "use strict";
  function safeUrl(value, image=false) {
    if(typeof value!=="string"||!value.trim())return null;
    try {
      const url=image?new URL(value,document.baseURI):new URL(value);
      return (image?["https:","http:","file:"]:["https:","http:"]).includes(url.protocol)?url.href:null;
    } catch {return null;}
  }
  function render(main) {
    const {el}=window.TravelUI;
    const data=window.TRIP_DATA?.hotel;
    const hotels=Array.isArray(data?.hotels)?data.hotels.filter(h=>h&&typeof h==="object"):[];
    if(!hotels.length){main.append(el("p","notice","宿泊施設はまだ登録されていません。"));return;}
    if(data.lead)main.append(el("p","hotel-lead",data.lead));
    const ids=new Set();
    const jump=el("nav","hotel-buttons");jump.setAttribute("aria-label","宿泊施設への移動");
    const stack=el("div","hotel-stack");
    function gallery(images,label){
      const g=el("div","hotel-gallery");
      (Array.isArray(images)?images:[]).forEach(photo=>{
        const src=safeUrl(typeof photo==="string"?photo:photo?.src,true);if(!src)return;
        const frame=el("div","hotel-gallery-image"),img=el("img");
        img.alt=photo?.alt||label+"の写真";img.loading="lazy";
        img.addEventListener("error",()=>{frame.remove();if(!g.childElementCount)g.remove();else if(g.childElementCount===1){g.classList.remove("is-gallery");g.removeAttribute("tabindex");g.removeAttribute("aria-label");}});
        img.src=src;frame.append(img);g.append(frame);
      });
      if(g.childElementCount>1){g.classList.add("is-gallery");g.tabIndex=0;g.setAttribute("aria-label",label+"の写真（横スクロール）");}
      return g.childElementCount?g:null;
    }
    function links(items){
      const row=el("div","hotel-buttons");
      items.forEach(([label,value,primary])=>{
        const url=safeUrl(value);if(!url)return;
        const a=el("a","hotel-btn"+(primary?" primary":""),label);a.href=url;a.target="_blank";a.rel="noopener noreferrer";row.append(a);
      });
      return row.childElementCount?row:null;
    }
    hotels.forEach((hotel,i)=>{
      const article=el("article","hotel-property");
      const candidate=typeof hotel.id==="string"&&/^[A-Za-z][A-Za-z0-9_-]*$/.test(hotel.id)?hotel.id:"hotel-"+(i+1);
      let id=candidate,n=2;while(ids.has(id)||document.getElementById(id))id=candidate+"-"+n++;
      ids.add(id);article.id=id;
      const name=hotel.name||"宿泊施設";
      const shortcut=el("a","hotel-btn",name);shortcut.href="#"+id;jump.append(shortcut);
      const heading=el("h2","hotel-name",name);article.append(heading);
      let number=0;
      function section(label,en){
        const node=el("section","hotel-section");
        node.append(el("span","eyebrow",String(++number).padStart(2,"0")+" "+en),el("h3","hotel-section-title",label));article.append(node);return node;
      }
      const overview=section("概要","OVERVIEW");
      if(hotel.description)overview.append(el("p","hotel-copy",hotel.description));
      const features=el("dl","hotel-features");
      [["チェックイン",hotel.checkIn],["チェックアウト",hotel.checkOut],["駐車場",hotel.parking]].forEach(([label,value])=>{
        if(value){const card=el("div","hotel-feature");card.append(el("dt","",label),el("dd","",value));features.append(card);}
      });
      if(features.childElementCount)overview.append(features);
      const photos=gallery(hotel.images,name);if(photos)overview.append(photos);
      const official=links([["公式サイトを見る",hotel.website,true]]);if(official)overview.append(official);
      [["部屋","ROOM",hotel.room],["食事","DINING",hotel.dining],["お風呂","BATH",hotel.bath]].forEach(([label,en,detail])=>{
        if(!detail)return;
        const images=gallery(detail.images,name+"・"+label);
        if(!detail.description&&!images)return;
        const node=section(label,en);
        if(detail.description)node.append(el("p","hotel-copy",detail.description));
        if(images)node.append(images);
      });
      if(Array.isArray(hotel.amenities)&&hotel.amenities.some(a=>typeof a==="string"&&a.trim())){
        const node=section("設備・アメニティ","AMENITIES"),grid=el("ul","hotel-amenities");
        hotel.amenities.filter(a=>typeof a==="string"&&a.trim()).forEach(a=>grid.append(el("li","",a)));
        node.append(grid);
      }
      const access=hotel.access;
      if(access){
        const buttons=links([["Google Mapsを見る",access.googleMaps],["Apple Mapsを見る",access.appleMaps]]);
        if(access.address||access.transport||buttons){
          const node=section("アクセス","ACCESS"),info=el("dl","hotel-info");
          [["住所",access.address],["移動",access.transport]].forEach(([label,value])=>{if(value){const row=el("div","hotel-info-row");row.append(el("dt","",label),el("dd","",value));info.append(row);}});
          if(info.childElementCount)node.append(info);if(buttons)node.append(buttons);
        }
      }
      stack.append(article);
    });
    if(hotels.length>1)main.append(jump);
    main.append(stack);
    if(location.hash){
      let id;try{id=decodeURIComponent(location.hash.slice(1));}catch{return;}
      const target=document.getElementById(id);
      if(target&&main.contains(target))requestAnimationFrame(()=>target.scrollIntoView({block:"start",behavior:"instant"}));
    }
  }
  window.TravelPages=window.TravelPages||{};
  window.TravelPages.hotel=render;
})();
