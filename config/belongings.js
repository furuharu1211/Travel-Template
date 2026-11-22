// 持ち物：配列に分類、items に持ち物を記述します。
// id は分類ごとに一意にしてください。旅行ごとに trip.js の id も変更してください。
window.TRIP_DATA = window.TRIP_DATA || {};
window.TRIP_DATA.belongings = [
  {
    id: "must",
    eyebrow: "MUST",
    title: "必須",
    items: ["着替え・下着", "財布", "スマホ", "充電器", "洗面用品"]
  },
  {
    id: "useful",
    eyebrow: "USEFUL",
    title: "あると便利",
    items: ["モバイルバッテリー", "常備薬・酔い止め", "折りたたみ傘", "日焼け止め", "虫よけ"]
  },
  {
    id: "shared",
    eyebrow: "SHARED",
    title: "担当者",
    items: ["カメラ三脚", "ETCカード", "車内充電器", "トランプ等"]
  }
];
