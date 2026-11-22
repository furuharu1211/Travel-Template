// 観光地の設定。groups や spots の追加・削除は自由です。
// id はページ内で一意にし、旅のしおりの detail.anchor と一致させます。
// title 以外のスポット情報は任意です。サンプルは架空の施設です。
window.TRIP_DATA = window.TRIP_DATA || {};
window.TRIP_DATA.sightseeing = {
  lead: "今回訪れる場所と、時間があれば立ち寄りたいスポットを紹介します。",
  groups: [
    {
      id: "main-spots",
      eyebrow: "MAIN SPOTS",
      title: "今回行く観光地",
      spots: [
        {
          id: "spot-01",
          title: "観光スポット",
          description: "旅先の風景を楽しむスポットです。散策や写真撮影におすすめ。",
          images: [
            { src: "images/hero/hero-01.svg", alt: "山と水辺のサンプルイラスト" }
          ],
          website: "",
          googleMaps: "",
          appleMaps: "",
          mapQuery: "" // 実際の施設名・住所を設定すると両地図リンクを生成
        }
      ]
    },
    {
      id: "around",
      eyebrow: "AROUND",
      title: "周辺のおすすめ観光地",
      description: "時間に余裕があったら立ち寄りたい場所。",
      spots: [
        {
          id: "spot-02",
          title: "散策・お土産スポット",
          description: "旅の思い出になるお土産を探したり、のんびり散策したりする候補です。",
          images: [{ src: "images/hero/hero-02.svg", alt: "夕景のサンプルイラスト" }]
        }
      ]
    }
  ]
};
