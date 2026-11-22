// 旅行メモ：配列にメモを追加・削除してください。
// title は見出し、text は文章、links は任意のリンクです。
// 公開サイトには予約番号や個人情報などを記載しないでください。
window.TRIP_DATA = window.TRIP_DATA || {};
window.TRIP_DATA.memo = [
  {
    title: "集合について",
    text: "出発時刻の10分前までに集合しましょう。\n遅れる場合は旅行メンバーに連絡してください。"
  },
  {
    title: "旅行中の注意事項",
    text: "天候や交通状況に応じて、予定を変更する場合があります。"
  },
  {
    title: "参考リンク",
    text: "出発前に天気を確認しておきましょう。",
    links: [
      { label: "気象庁の天気予報を見る", url: "https://www.jma.go.jp/bosai/forecast/" }
    ]
  }
];
