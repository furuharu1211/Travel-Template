(() => {
  "use strict";
  function render(main) {
    const {el}=window.TravelUI;
    const data=window.TRIP_DATA?.members;
    const members=Array.isArray(data)?data.filter(m=>m&&typeof m.name==="string"&&m.name.trim()):[];
    if(!members.length){main.append(el("p","notice","参加メンバーはまだ登録されていません。"));return;}
    main.append(el("p","members-lead","今回の旅行の参加者は"+members.length+"人！"));
    const grid=el("div","members-grid");
    members.forEach(member=>{
      const card=el("article","member-card");
      card.append(el("h2","",member.name));
      if(member.description)card.append(el("p","member-description",member.description));
      if(member.role)card.append(el("small","member-role",member.role));
      grid.append(card);
    });
    main.append(grid);
  }
  window.TravelPages=window.TravelPages||{};
  window.TravelPages.members=render;
})();
