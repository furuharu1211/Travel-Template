// クイズ設定：openAt は公開日時（空文字ならすぐ遊べます）。
// answer は choices の番号（0から開始）。問題数・カテゴリ数は自由です。
// detailUrl は結果画面の観光地リンク（省略可）。
window.TRIP_DATA = window.TRIP_DATA || {};
window.TRIP_DATA.quiz = {
  openAt: "",
  categories: {
    sample: {
      categoryName: "旅のサンプルクイズ",
      perfectTitle: "旅行マスター！",
      passMessage: "旅の予習はバッチリ！",
      detailUrl: "sightseeing.html#spot-01",
      questions: [
        { question: "日本で最も高い山は？", choices: ["富士山", "北岳", "奥穂高岳", "槍ヶ岳"], answer: 0, explanation: "富士山は標高3,776mで、日本で最も高い山です。" },
        { question: "日本の都道府県はいくつ？", choices: ["43", "45", "47", "49"], answer: 2, explanation: "日本には47の都道府県があります。" },
        { question: "北海道の道庁所在地は？", choices: ["函館市", "札幌市", "旭川市", "帯広市"], answer: 1, explanation: "北海道庁は札幌市にあります。" },
        { question: "日本で最も面積が大きい湖は？", choices: ["霞ヶ浦", "浜名湖", "諏訪湖", "琵琶湖"], answer: 3, explanation: "滋賀県の琵琶湖は日本最大の湖です。" },
        { question: "沖縄県の県庁所在地は？", choices: ["那覇市", "名護市", "石垣市", "宮古島市"], answer: 0, explanation: "沖縄県庁は那覇市にあります。" }
      ]
    }
  }
};
