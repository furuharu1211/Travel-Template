# Travel-Template

Awaji-Tripを原型にした旅行サイトの共通テンプレートです。HTML / CSS / Vanilla JavaScript、ビルド不要。

## 現在の状態（STEP 8：利用手順整備）
トップページ・共通ナビゲーション・フッター・6テーマ・ページの表示切り替えを実装。旅のしおり・観光地・宿泊施設・持ち物・参加メンバー・観光地クイズ・旅行メモも実装済み。全8ページの実装とテーマ・デザインの共通化が完了しました（静的参照と主要機能の模擬DOMテストを実施済み。実ブラウザ確認は未実施）。

## 新しい旅行サイトの作り方

### 1. テンプレートからリポジトリを作成
テンプレート管理者は初回のみ [Settings → General](https://github.com/furuharu1211/Travel-Template/settings) の Template repository を有効にしてください。
1. [Travel-Template](https://github.com/furuharu1211/Travel-Template) を開く。
2. Use this template → Create a new repository を選択。
3. Owner、Repository name（例: Hakone-Trip）、公開範囲を指定して作成。
4. 作成先が Travel-Template ではなく新しい旅行用リポジトリであることを確認。

### 2. VS Code にクローン
Ctrl + Shift + P → Git: Clone を選択し、新しいリポジトリのURLを入力します。保存先を選んで開きます。ターミナルから行う場合は以下（例）です。
```bash
git clone https://github.com/furuharu1211/Hakone-Trip.git
cd Hakone-Trip
code .
```
編集前に `git remote -v` で新しい旅行用リポジトリが origin になっていることを確認します。

### 3. 旅行基本情報・テーマ・使用ページを設定
`config/trip.js` を編集します。旅行ごとに id を一意に変更し、旅行名、日程、写真、theme、features を設定してください。
```javascript
window.TRIP_CONFIG = {
  id: "hakone-2027",
  title: "箱根旅行",
  subtitle: "HAKONE TRIP 2027",
  startDate: "2027-03-20",
  endDate: "2027-03-21",
  theme: "nature",
  logo: "images/common/logo.svg",
  heroImages: ["images/hero/hero-01.svg"],
  features: {
    schedule: true, sightseeing: true, quiz: true, hotel: true,
    belongings: true, members: true, memo: false
  }
};
```
テーマは classic / ocean / nature / urban / warm / luxury の6種類。features を false にすれば不要なページを非表示にできます。

### 4. 各ページの内容・写真を差し替える
| 編集ファイル | 内容 |
|---|---|
| config/schedule.js | 日程・時刻・予定・詳細リンク |
| config/sightseeing.js | 観光地・写真・紹介・公式サイト / 地図リンク |
| config/hotel.js | 宿泊施設の紹介・写真 |
| config/belongings.js | 持ち物 |
| config/members.js | 参加メンバー |
| config/quiz.js | クイズ・正解・解説・公開日時 |
| config/memo.js | 共有事項・リンク |

写真は images/hero、images/sightseeing、images/hotel などに配置し、設定内の相対パスを変更します。ファイル名の大文字・小文字も一致させてください。サンプルデータは削除・差し替え、不要な項目は省略します。通常はHTML・CSS・表示用JavaScriptの変更は不要です。
旅のしおりの detail.anchor と観光地・宿泊施設の id を一致させてください。クイズの answer は0始まりです。クイズのリンク先も旅行内容に合わせて更新します。

### 5. ローカルで確認してコミット
VS Code の Live Server で index.html を開きます。各ページ、画像、リンク、スマートフォン表示、クイズ、持ち物チェックを確認してください。変更を保存したら以下を実行します。
```bash
git status
git add .
git commit -m "Customize travel site"
git push origin main
```
GitHub側で編集した場合はローカルで `git pull origin main` を実行して同期します。

### 6. GitHub Pagesで公開
新しい旅行用リポジトリの Settings → Pages → Build and deployment で Source を Deploy from a branch にし、main / (root) を選択して Save。デプロイ完了後、Settings → Pages に表示されるURLで動作確認します。
例: https://furuharu1211.github.io/Hakone-Trip/ （公開成功後の想定URL）
無料プランでは通常、公開リポジトリが必要です。非公開リポジトリのPages利用やサイト自体の公開範囲は契約プランと設定に依存します。

### 7. 必要な場合のみ独自ドメインを設定
通常の github.io URL で公開できます。既存の Cloudflare 管理ドメインを利用する場合は、旅行ごとに異なるサブドメイン（例: hakone.furune-trip.com）を用意します。GitHubのドメイン所有確認を推奨します。新しいリポジトリの Settings → Pages → Custom domain に設定し、Cloudflare DNSでそのサブドメインの CNAME を furuharu1211.github.io に向けます（DNS only 推奨）。DNS確認・証明書発行後に Enforce HTTPS を有効にします。既存旅行のDNSやCNAMEを変更・流用しないでください。

### 公開前チェック
- [ ] 新しいリポジトリにコミットしている（テンプレート本体ではない）
- [ ] 旅行ID・日付・参加者・サンプルデータを更新した
- [ ] 写真・リンク・詳細アンカーが正しい
- [ ] スマートフォン表示、クイズ採点・音声、持ち物保存を実機確認した
- [ ] 個人情報、予約番号、秘密情報を含めていない
- [ ] 公開URLから各ページを確認した

テンプレート本体の後日の更新は、作成済みの旅行用リポジトリへ自動反映されません。必要な変更だけ個別に取り込んでください。

## カスタマイズ
- config/trip.js: 旅行名・日程・ロゴ・背景画像・テーマ・機能の有効/無効
- config/schedule.js: 旅のしおり（日別タイムライン）
- config/sightseeing.js: 観光地（分類・写真・紹介・リンク）
- config/hotel.js: 宿泊施設（概要・部屋・食事・お風呂・設備・アクセス）
- config/belongings.js: 持ち物（分類・チェックリスト）
- config/members.js: 参加メンバー（名前・説明・役割）
- config/quiz.js: 観光地クイズ（カテゴリ・問題・公開日時）
- config/memo.js: 旅行メモ（見出し・文章・リンク）
- images/: 旅行画像。初期画像は汎用SVGです。実際の写真に変更する場合、trip.js のパスも変更してください。
- テーマ: classic / ocean / nature / urban / warm / luxury
- features の値を false にするとメニューから除外され、直接アクセス時も無効表示になります。アクセス制御ではありません。

## デザイン
全ページのカード・ボタン・余白は css/style.css の共通ルールを使用し、配色は css/themes.css で管理します。ページごとのCSSは主にレイアウトを担当します。テーマ変更は config/trip.js の theme のみ編集します。

## 旅のしおり
config/schedule.js の days 配列に日ごとの予定を記述します。日数は配列の要素数で決まるため、trip.js の終了日と合わせて編集してください。date を省略すると開始日から自動計算します。items は記載順に表示されます。
各予定には time、title、description、endTime、transport、notes（文字列配列）、image、imageAlt、mapQuery、detail（page、label、anchor）を設定できます。title 以外は任意です。mapQuery に施設名・住所を入力すると地図リンクが表示されます。detail は有効なサイト内ページのみリンクします。
map.embedUrl に公開可能な Google マイマップの HTTPS 埋め込みURLを指定すると、ページ下部に表示します。空なら非表示です。

## 観光地
config/sightseeing.js の groups 配列に分類を、各 groups の spots 配列に観光スポットを記述します。空の分類は非表示です。
スポットの title、id（ページ内で一意の英数字・ハイフン・アンダースコア、先頭は英字）、description、images（src/alt の配列） を設定できます。画像は複数枚なら横スクロールになります。
website、googleMaps、appleMaps に実際のURLを設定します。mapQuery を入力すると、個別の地図URLが未設定の場合に検索リンクを生成します。不要な項目は省略できます。営業時間・料金などの詳細は公式サイトへのリンクで案内します。
旅のしおりの detail に page: "sightseeing", anchor: "spot-01" のように設定すると、対応する id のカードへ移動します。サンプルの施設は架空であり、画像もイラストです。

## 宿泊施設
config/hotel.js の hotels 配列に宿泊施設を記述します。複数施設も同じ形式で追加できます。id はページ内で一意の英数字・ハイフン・アンダースコア（先頭は英字）にしてください。
概要は name、description、checkIn、checkOut、parking、images、website。部屋・食事・お風呂は room / dining / bath に description と images を設定します。設備は amenities の文字列配列、アクセスは access の address、transport、googleMaps、appleMaps です。
images は画像パスの文字列配列、または src / alt のオブジェクト配列です。複数枚は横スクロール。不要な項目・空の詳細セクションは非表示になります。公式サイトや地図は実際のURLを指定してください。
旅のしおりの detail に page: "hotel", anchor: "hotel-01" を設定すると対応する宿泊施設へ移動します。サンプル施設は架空です。

## 持ち物
config/belongings.js の配列に分類（id、eyebrow、title、items）を記述します。items は持ち物名の文字列配列です。分類・持ち物は自由に追加・削除でき、空の分類は非表示になります。
チェック状態は localStorage に保存され、同じブラウザ・同じサイト・旅行ID・開始日で再表示した場合に復元されます。端末間で共有されません。旅行ごとに trip.js の id を変更してください。ブラウザの保存制限がある場合はページ内だけでチェックできます。

## 参加メンバー
config/members.js の配列に name（名前）、description（集合・解散などの説明）、role（役割）を記述します。名前以外は任意です。説明は \n で改行できます。参加人数は有効な名前があるメンバー数から自動計算されます。
公開サイトには本人の了承を得た情報のみ掲載してください。サンプル名を使用しています。

## 観光地クイズ
config/quiz.js の categories にカテゴリを追加し、questions に question、choices、answer（0始まり）、explanation を記述します。categoryName、perfectTitle、passMessage、detailUrl はカテゴリ単位で設定します。detailUrl は sightseeing.html またはそのカードへのアンカーで、観光地ページが有効な場合のみ表示します。
問題数に応じて100点満点で採点（端数切り捨て）、80点以上で合格。最高得点は旅行ID・開始日・サイトパス別にブラウザに保存します。openAt は日時（例：2027-03-20T00:00:00+09:00）、空なら即時公開。公開日時は表示制御でありアクセス制御ではありません。
Awaji-Tripの猫の結果演出と効果音を継承しています。素材は images/quiz/ と sounds/ にあります。

## 旅行メモ
config/memo.js の配列に title（見出し）、text（文章）、links（リンクの配列）を記述します。見出し以外は任意です。文章は \n で改行できます。
links は label（ボタン名）と url（HTTP または HTTPS のURL）を指定します。リンクは別タブで開き、未設定のリンクは表示しません。メモは自由に追加・削除できます。
公開サイトには予約番号・個人情報などの機密情報を記載しないでください。

## 確認・公開
index.html をブラウザで開くか、VS Code Live Serverで確認します。
GitHub Pages は Settings → Pages → Deploy from a branch → main / (root) → Save。
公開後は表示されたURLを確認してください。公開設定は別途必要です。

## STEP 7 確認結果
- 全8ページのHTML・設定ファイル・読み込み順・画像・効果音・サンプル詳細アンカーを確認。
- 全8ページ×6テーマ（48通り）の模擬DOM描画、および7機能の無効化・メニュー除外を確認。
- クイズ100/80/0点、再挑戦、最高得点、公開ロック、効果音呼び出し、持ち物の保存復元、日付、トップ画像のエラー時切り替えを確認。
- 実ブラウザでの表示、タッチ操作、外部サイトへの接続、実音声再生はLive Serverで別途確認してください。

## 注意
公開リポジトリに個人情報、予約番号、秘密情報を入れないでください。写真共有は初期版の対象外です。Cloudflare・独自ドメインは任意の公開設定であり、テンプレート本体には設定していません。
