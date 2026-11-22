(() => {
  "use strict";
  function render(main, config) {
    const {el}=window.TravelUI;
    const data=window.TRIP_DATA?.belongings;
    const groups=Array.isArray(data)?data.filter(g=>g&&Array.isArray(g.items)&&g.items.some(item=>typeof item==="string"&&item.trim())):[];
    if(!groups.length){main.append(el("p","notice","持ち物はまだ登録されていません。"));return;}
    const storageKey="travel-template:belongings:"+location.pathname+":"+String(config.id||"trip")+":"+String(config.startDate||"");
    let checked=new Set();
    try {
      const saved=JSON.parse(localStorage.getItem(storageKey)||"[]");
      if(Array.isArray(saved))checked=new Set(saved.filter(v=>typeof v==="string"));
    } catch {}
    function save(){try{localStorage.setItem(storageKey,JSON.stringify([...checked]));}catch{}}
    const columns=el("div","belongings-columns");
    const groupCounts=new Map();
    groups.forEach((group,i)=>{
      const card=el("article","belongings-card");
      if(group.eyebrow)card.append(el("span","eyebrow",group.eyebrow));
      card.append(el("h2","belongings-title",group.title||"持ち物"));
      const list=el("ul","belongings-list");
      const groupId=String(group.id||group.title||("group-"+i));
      const groupOccurrence=groupCounts.get(groupId)||0;
      groupCounts.set(groupId,groupOccurrence+1);
      const itemCounts=new Map();
      group.items.filter(item=>typeof item==="string"&&item.trim()).forEach(item=>{
        const occurrence=itemCounts.get(item)||0;
        itemCounts.set(item,occurrence+1);
        const key=JSON.stringify([groupId,groupOccurrence,item,occurrence]);
        const li=el("li"),label=el("label","belongings-item"),input=el("input");
        input.type="checkbox";input.checked=checked.has(key);
        input.addEventListener("change",()=>{if(input.checked)checked.add(key);else checked.delete(key);save();});
        label.append(input,el("span","",item));li.append(label);list.append(li);
      });
      card.append(list);columns.append(card);
    });
    main.append(columns);
  }
  window.TravelPages=window.TravelPages||{};
  window.TravelPages.belongings=render;
})();
