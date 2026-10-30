# 指毛ぬき を App Store に出す手順

iPhone 版には Android のような「12人・14日間テスト」はありません。準備ができたらすぐ審査に出せます。

全体の流れ:

1. Apple Developer Program に登録する(最初にやる。承認に1〜2日かかることがある)
2. App Store Connect にアプリの枠を作る
3. アプリを組み立てて提出する(**A:Mac がある** / **B:Mac がない** のどちらか)
4. ストア情報を埋めて審査に出す

---

## 1. Apple Developer Program に登録する

- iPhone に **Apple Developer アプリ**(App Store で無料)を入れて、「今すぐ登録」から進むのがいちばん簡単です。
- 個人として登録します。年会費はアプリ経由で 12,800円(米国価格は 99ドル)。
- Apple ID に**2ファクタ認証**が必要です。本名で登録します。
- 承認メールが来るまで待ちます(通常は数時間〜2日)。

## 2. App Store Connect にアプリの枠を作る

### 2-1. Bundle ID を登録する

1. https://developer.apple.com/account にログイン →「Certificates, IDs & Profiles」→「Identifiers」→「+」。
2. 「App IDs」→「App」を選んで Continue。
3. Description に `Yubinuki`、Bundle ID は「Explicit」で `com.yubinuki.game` と入力して登録。
   - 「すでに使われている」と出たら `com.あなたの名前.yubinuki` などに変えて、`capacitor.config.json` の `appId` と `codemagic.yaml` の `bundle_identifier` も同じものに書き換えます。

### 2-2. アプリを作る

1. https://appstoreconnect.apple.com →「アプリ」→「+」→「新規App」。
2. プラットフォーム:iOS/名前:`指毛ぬき`/プライマリ言語:日本語/バンドルID:さっき登録したもの/SKU:`yubinuki`/アクセス:フルアクセス。
3. 作成後、「App情報」に出る **Apple ID(10桁くらいの数字)** をメモ。B ルートで使います。

---

## 3-A. Mac がある場合

### 道具を入れる(初回だけ)

- **Xcode**:Mac の App Store から無料でインストール(大きいので時間がかかります)。インストール後に一度起動して、追加コンポーネントを入れます。
- **Node.js**:https://nodejs.org から LTS 版。

### iOS プロジェクトを作る

`yubinuki` フォルダを Finder で右クリック →「フォルダに新規ターミナル」を開き、1行ずつ実行:

```
npm install @capacitor/core @capacitor/cli @capacitor/ios @capacitor/assets @fontsource/dela-gothic-one @fontsource/zen-kaku-gothic-new
npm run fonts
npx cap add ios
npx capacitor-assets generate --ios
npx cap sync ios
npx cap open ios
```

Xcode が開きます。

### Xcode での設定

左のファイル一覧の一番上「App」をクリック →「TARGETS」の「App」を選んで:

1. **Signing & Capabilities** タブ
   - 「Automatically manage signing」にチェック。
   - Team:自分の名前(出なければ「Add an Account…」で Apple ID を追加)。
   - Bundle Identifier が `com.yubinuki.game`(2-1 で登録したもの)になっているか確認。
2. **General** タブ
   - Supported Destinations:**iPad を削除して iPhone だけ**にする(iPad 用のスクリーンショットが不要になります)。
   - Deployment Info の iPhone Orientation:**Portrait だけ**チェック。
3. **Info** タブ
   - 一覧の「+」で `App Uses Non-Exempt Encryption` を追加し、値を **NO** にする(提出のたびに聞かれる暗号化の質問が省けます)。

### 自分の iPhone で試す

1. iPhone をケーブルでつなぐ。iPhone の「設定 > プライバシーとセキュリティ > デベロッパモード」をオン(再起動あり)。
2. Xcode 上部で自分の iPhone を選んで ▶ を押す。

### 提出する

1. Xcode 上部の端末選択を「Any iOS Device (arm64)」にする。
2. メニュー `Product > Archive`。
3. 終わると Organizer が開くので「Distribute App」→「App Store Connect」→ そのまま進めて Upload。
4. 15〜30分ほどで App Store Connect にビルドが表示されます。→ 手順 4 へ。

---

## 3-B. Mac がない場合(Codemagic を使う)

Codemagic はクラウドの Mac を貸してくれるサービスです。個人なら毎月 500分まで無料で、1回のビルドは10〜20分くらいです。

> この方法は最初の設定が多く、1回目でエラーが出ることもあります。エラーが出たら、Codemagic の画面のログをそのまま Claude に貼ってください。

### B-1. GitHub にフォルダを上げる

1. https://github.com で無料アカウントを作る。
2. 右上「+」→「New repository」→ 名前 `yubinuki`、**Private** を選んで作成。
3. 「uploading an existing file」のリンクから、`yubinuki` フォルダの**中身**(`www`、`assets`、`scripts`、`store`、`capacitor.config.json`、`package.json`、`codemagic.yaml` など)をまとめてドラッグして「Commit changes」。

### B-2. App Store Connect の API キーを作る

1. App Store Connect →「ユーザとアクセス」→「統合」→「App Store Connect API」→「チームキー」。
2. 「+」で新しいキーを作る。名前 `codemagic`、アクセス **App Manager**。
3. 表示される **Issuer ID** と **キーID** をメモし、`.p8` ファイルをダウンロード(**1回しかダウンロードできません**)。

### B-3. Codemagic を設定する

1. https://codemagic.io に GitHub でサインアップし、`yubinuki` リポジトリを追加。
2. **API キーを登録**:左下の自分の名前 →「Integrations」→「Developer Portal」→「Connect」。名前に **`codemagic`**(codemagic.yaml と同じ名前)、Issuer ID、キーID、`.p8` を入れて保存。
3. **証明書を作る**:同じ設定画面の「Code signing identities」→「iOS certificates」→「Generate certificate」→ 種類は **Apple Distribution**、API キーは `codemagic` を選んで作成。
4. **プロビジョニングプロファイルを作る**(Apple のサイトで):
   - https://developer.apple.com/account →「Profiles」→「+」→「App Store Connect」→ App ID に `com.yubinuki.game` → 証明書はさっき Codemagic で作ったもの → 名前 `yubinuki appstore` で作成。
5. Codemagic に戻り「iOS provisioning profiles」→「Fetch profiles」→ `yubinuki appstore` を選んで取り込む。

### B-4. Apple ID を書き込んでビルド

1. GitHub 上で `codemagic.yaml` を開き、鉛筆アイコンで編集。`APP_STORE_APPLE_ID: 0000000000` を 2-2 でメモした数字に変えて「Commit changes」。
2. Codemagic でアプリを開き、「Start new build」→ ワークフロー `指毛ぬき iOS` を選んで開始。
3. 緑のチェックになれば、ビルドは App Store Connect に自動でアップロードされています。→ 手順 4 へ。

---

## 4. ストア情報を埋めて審査に出す

App Store Connect のアプリページで、`store/appstore-listing.txt` の内容を順にコピペします。

- **スクリーンショット**(「iPhone」の欄):`store/appstore-screenshots/` の画像を使います。
  - 6.9インチ欄 → `6.9inch-1〜5.png`
  - 6.5インチ欄を求められたら → `6.5inch-1〜5.png`
  - 6.3インチ欄を求められたら → `6.3inch-1〜5.png`
- **プライバシーポリシーURL** と **サポートURL**:`store/privacy-policy.html` をネット上に置いた URL が必要です(Claude に頼めば公開ページを作れます)。
- **Appのプライバシー**:「データを収集していません」を選ぶ。
- **年齢制限**:質問にすべて「なし」で答えると 4+ になります。
- **価格**:無料。
- **ビルド**:「ビルド」の欄の「+」から、アップロードしたビルドを選ぶ。
- 右上の「審査用に追加」→「審査に提出」。

審査は早ければ1日以内に終わります。初回は少し長めにみてください。通ったら「配信準備完了」になり、App Store に並びます。

---

## アップデートを出すとき

- `www/index.html` を書き換える。
- **A**:`npx cap sync ios` → Xcode で General タブの Version(例 1.1)を上げる → Archive → Upload。
- **B**:GitHub の `www/index.html` を差し替えて、Codemagic で「Start new build」(ビルド番号は自動で上がります)。
- App Store Connect で新しいバージョンを作って、ビルドを選んで審査に出す。

## 補足

- 最初の `npm run fonts` で、ゲームのフォントをアプリの中に入れています。これで電波がなくても同じ見た目で遊べます。Apple の審査で「ウェブページを包んだだけ」と見なされにくくする意味もあります。
- 審査で落ちた場合も、理由が書かれたメッセージが届きます。直して出し直せば大丈夫です。内容を Claude に貼ってくれれば対応を一緒に考えます。
