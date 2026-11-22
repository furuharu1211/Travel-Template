(() => {
  "use strict";
  const weekdays = ["日","月","火","水","木","金","土"];
  function parseDate(value) {
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const d = new Date(value + "T00:00:00Z");
    return Number.isFinite(d.getTime()) && d.toISOString().slice(0,10) === value ? d : null;
  }
  function dateLabel(day, index, config) {
    const explicit = day.date ? parseDate(day.date) : null;
    const d = explicit || (!day.date ? parseDate(config.startDate) : null);
    if (!d) return "";
    if (!explicit) d.setUTCDate(d.getUTCDate() + index);
    return (d.getUTCMonth()+1)+"月"+d.getUTCDate()+"日（"+weekdays[d.getUTCDay()]+"）";
  }
  function externalLink(el, label, url) {
    const a=el("a","schedule-btn",label);
    a.href=url; a.target="_blank"; a.rel="noopener noreferrer"; return a;
  }
  function render(main, config) {
    const {el, pages, enabled}=window.TravelUI;
    const data=window.TRIP_DATA?.schedule;
    const validDays=Array.isArray(data?.days)?data.days.filter(d=>d&&typeof d==="object"):[];
    if (!validDays.length) {
      main.append(el("p","notice","旅の予定はまだ登録されていません。")); return;
    }
    if(data.lead) main.append(el("p","schedule-lead",data.lead));
    const jump=el("nav","schedule-jump");jump.setAttribute("aria-label","日程への移動");
    validDays.forEach((day,i)=>{
      const a=el("a","schedule-btn",(i+1)+"日目");a.href="#day-"+(i+1);jump.append(a);
    });
    if(validDays.length>1) main.append(jump);
    const days=el("div","timeline-days");
    validDays.forEach((day,i)=>{
      const article=el("article","day-block");article.id="day-"+(i+1);
      const date=dateLabel(day,i,config);
      article.append(el("h2","day-title",(i+1)+"日目"+(date?"｜"+date:"")));
      if(day.title) article.append(el("p","day-subtitle",day.title));
      const items=Array.isArray(day.items)?day.items.filter(item=>item&&typeof item==="object"):[];
      if(!items.length){article.append(el("p","notice","予定は未定です。"));days.append(article);return;}
      const timeline=el("ol","timeline");
      items.forEach(item=>{
        const row=el("li","timeline-item");
        const time=el("div","timeline-time",item.time||"未定");
        if(item.endTime)time.append(el("span","timeline-end","〜 "+item.endTime));
        const dot=el("div","timeline-dot-wrap");dot.setAttribute("aria-hidden","true");dot.append(el("span","timeline-dot"));
        const card=el("div","timeline-card");
        card.append(el("h3","",item.title||"予定"));
        if(item.description)card.append(el("p","timeline-description",item.description));
        if(item.transport)card.append(el("span","timeline-transport","移動："+item.transport));
        if(Array.isArray(item.notes)&&item.notes.length){
          const notes=el("ul","timeline-meta");item.notes.forEach(n=>notes.append(el("li","",n)));card.append(notes);
        }
        if(item.image){
          const photo=el("div","timeline-photo"),img=el("img");
          img.src=item.image;img.alt=item.imageAlt||item.title||"旅の写真";img.loading="lazy";
          img.addEventListener("error",()=>photo.remove());photo.append(img);card.append(photo);
        }
        const buttons=el("div","schedule-buttons");
        if(item.mapQuery)buttons.append(externalLink(el,"地図を見る","https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(item.mapQuery)));
        const detail=item.detail;
        const target=pages.find(p=>p.id===detail?.page);
        if(target&&enabled(config,target)){
          const a=el("a","schedule-btn",detail.label||"詳細を見る");
          a.href=target.id+".html"+(detail.anchor?"#"+encodeURIComponent(detail.anchor):"");buttons.append(a);
        }
        if(buttons.childElementCount)card.append(buttons);
        row.append(time,dot,card);timeline.append(row);
      });
      article.append(timeline);days.append(article);
    });
    main.append(days);
    const map=data.map;
    if(map?.embedUrl){
      let url;try{url=new URL(map.embedUrl);}catch{}
      if(url?.protocol==="https:"&&url.hostname==="www.google.com"&&(/^\/maps\/d\/(?:u\/\d+\/)?embed$/.test(url.pathname)||url.pathname==="/maps/embed")){
        const section=el("section","schedule-map");
        section.append(el("h2","day-title",map.title||"旅のマップ"));
        if(map.description)section.append(el("p","schedule-lead",map.description));
        const iframe=el("iframe","schedule-map-frame");iframe.src=url.href;iframe.title=map.title||"旅のマップ";iframe.loading="lazy";iframe.referrerPolicy="strict-origin-when-cross-origin";
        section.append(iframe);main.append(section);
      }
    }
  }
  window.TravelPages=window.TravelPages||{};
  window.TravelPages.schedule=render;
})();
