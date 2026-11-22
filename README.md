# Travel-Template

Awaji-Tripを原型にした旅行サイトの共通テンプレートです。HTML / CSS / Vanilla JavaScript、ビルド不要。

## 現在の状態（STEP 5-1）
トップページ・共通ナビゲーション・フッター・6テーマ・ページの表示切り替えを実装。旅のしおりも実装済み。その他6ページは準備中です。

## カスタマイズ
- config/trip.js: 旅行名・日程・ロゴ・背景画像・テーマ・機能の有効/無効
- config/schedule.js: 旅のしおり（日別タイムライン）
- その他の config/各ページ.js: ページ別データ（準備中）
- images/: 旅行画像。初期画像は汎用SVGです。実際の写真に変更する場合、trip.js のパスも変更してください。
- テーマ: classic / ocean / nature / urban / warm / luxury
- features の値を false にするとメニューから除外され、直接アクセス時も無効表示になります。アクセス制御ではありません。

## 旅のしおり
config/schedule.js の days 配列に日ごとの予定を記述します。日数は配列の要素数で決まるため、trip.js の終了日と合わせて編集してください。date を省略すると開始日から自動計算します。items は記載順に表示されます。
各予定には time、title、description、endTime、transport、notes（文字列配列）、image、imageAlt、mapQuery、detail（page、label、anchor）を設定できます。title 以外は任意です。mapQuery に施設名・住所を入力すると地図リンクが表示されます。detail は有効なサイト内ページのみリンクします。
map.embedUrl に公開可能な Google マイマップの HTTPS 埋め込みURLを指定すると、ページ下部に表示します。空なら非表示です。

## 確認・公開
index.html をブラウザで開くか、VS Code Live Serverで確認します。
GitHub Pages は Settings → Pages → Deploy from a branch → main / (root) → Save。
公開後は表示されたURLを確認してください。公開設定は別途必要です。

## 注意
公開リポジトリに個人情報、予約番号、秘密情報を入れないでください。写真共有・Cloudflare・独自ドメインは初期版の対象外です。
