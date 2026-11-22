// 宿泊施設：hotels に施設を追加できます。不要な項目は省略してください。
// id は旅のしおりの detail.anchor と対応します。以下は架空のサンプルです。
window.TRIP_DATA = window.TRIP_DATA || {};
window.TRIP_DATA.hotel = {
  lead: "今回の宿泊先をご紹介します。",
  hotels: [
    {
      id: "hotel-01",
      name: "サンプルホテル",
      description: "旅の疲れを癒やし、ゆっくり過ごす宿泊施設です。",
      checkIn: "15:00",
      checkOut: "10:00",
      parking: "あり",
      images: ["images/hero/hero-01.svg", "images/hero/hero-02.svg"],
      website: "",
      room: {
        description: "客室の紹介文を入力します。",
        images: []
      },
      dining: {
        description: "朝食・夕食の情報を入力します。",
        images: []
      },
      bath: {
        description: "お風呂の紹介文を入力します。",
        images: []
      },
      amenities: ["Wi-Fi", "タオル", "シャンプー・リンス", "歯ブラシ", "ドライヤー", "冷蔵庫"],
      access: {
        address: "",
        transport: "",
        googleMaps: "",
        appleMaps: ""
      }
    }
  ]
};
