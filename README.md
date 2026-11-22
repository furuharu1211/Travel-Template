# Travel-Template

Awaji-Tripを原型にした旅行サイトの共通テンプレートです。HTML / CSS / Vanilla JavaScript、ビルド不要。

## 現在の状態（STEP 4）
トップページ・共通ナビゲーション・フッター・6テーマ・ページの表示切り替えを実装。その他7ページは準備中で、設定データの仕様と表示機能はSTEP 5以降に実装します。

## カスタマイズ
- config/trip.js: 旅行名・日程・ロゴ・背景画像・テーマ・機能の有効/無効
- config/各ページ.js: ページ別データ（準備中）
- images/: 旅行画像。初期画像は汎用SVGです。実際の写真に変更する場合、trip.js のパスも変更してください。
- テーマ: classic / ocean / nature / urban / warm / luxury
- features の値を false にするとメニューから除外され、直接アクセス時も無効表示になります。アクセス制御ではありません。

## 確認・公開
index.html をブラウザで開くか、VS Code Live Serverで確認します。
GitHub Pages は Settings → Pages → Deploy from a branch → main / (root) → Save。
公開後は表示されたURLを確認してください。公開設定は別途必要です。

## 注意
公開リポジトリに個人情報、予約番号、秘密情報を入れないでください。写真共有・Cloudflare・独自ドメインは初期版の対象外です。
