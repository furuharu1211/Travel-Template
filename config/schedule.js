// 旅のしおり：日数・予定数は自由に追加・削除できます。
// date は YYYY-MM-DD。省略すると trip.js の開始日から順に計算します。
// time は "09:00"、"午前"、"未定" など自由記述。配列の順番で表示します。
// image, transport, notes, mapQuery, detail, endTime は任意です。
window.TRIP_DATA = window.TRIP_DATA || {};
window.TRIP_DATA.schedule = {
  lead: "集合・移動・観光・食事まで、旅行の流れをまとめました。",
  days: [
    {
      title: "出発・観光",
      items: [
        { time: "09:00", title: "集合・出発", description: "集合場所で合流して出発。", transport: "電車", notes: ["出発10分前に集合"] },
        { time: "12:00", endTime: "13:00", title: "昼食", description: "旅先でランチを楽しむ。" },
        { time: "14:00", title: "観光スポット", description: "旅先の風景を楽しむ。", image: "images/hero/hero-01.svg", detail: { page: "sightseeing", label: "観光地を見る" } },
        { time: "16:00", title: "チェックイン", description: "宿泊施設に到着。", detail: { page: "hotel", label: "宿の詳細を見る" } }
      ]
    },
    {
      title: "観光・帰宅",
      items: [
        { time: "08:00", title: "朝食" },
        { time: "10:00", title: "チェックアウト" },
        { time: "11:00", title: "散策・お土産", image: "images/hero/hero-02.svg" },
        { time: "17:00", title: "帰宅", transport: "電車" }
      ]
    }
  ],
  // 任意：Google マイマップの共有用埋め込みURL。空なら非表示。
  // embedUrl: "https://www.google.com/maps/d/embed?mid=YOUR_MAP_ID"
  map: { title: "旅のマップ", description: "今回巡るスポットをまとめてチェック", embedUrl: "" }
};
