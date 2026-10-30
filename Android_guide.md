# 指毛ぬき を Google Play に出す手順(Android版)

パソコン(Windows でも Mac でも可)で作業します。全体の流れは次のとおりです。

1. 道具を入れる(初回だけ)
2. このフォルダを Android アプリに変換する
3. 自分のスマホで動作確認する
4. 提出用ファイル(.aab)を作る
5. Google Play Console に登録してアップロードする
6. 12人のテスターに14日間テストしてもらう(個人アカウントの必須ルール)
7. 本番公開を申請する

---

## 1. 道具を入れる(初回だけ)

- **Node.js**:https://nodejs.org から「LTS」版をダウンロードしてインストール。
- **Android Studio**:https://developer.android.com/studio からダウンロードしてインストール。初回起動時のセットアップは「Standard」を選んで、最後まで進めればOK(Android SDK も一緒に入ります)。

## 2. Android アプリに変換する

1. このフォルダ(`yubinuki`)を「ドキュメント」など分かりやすい場所に置く。
2. このフォルダでコマンド画面を開く。
   - Windows:フォルダを開き、上のアドレスバーに `cmd` と入力して Enter。
   - Mac:Finder でフォルダを右クリック →「フォルダに新規ターミナル」。
3. 次のコマンドを、1行ずつ貼り付けて Enter。

```
npm install @capacitor/core @capacitor/cli @capacitor/android @capacitor/assets @fontsource/dela-gothic-one @fontsource/zen-kaku-gothic-new
npm run fonts
npx cap add android
npx capacitor-assets generate --android
npx cap sync android
```

4. 最後にこれで Android Studio が開きます。

```
npx cap open android
```

初回は Android Studio の下の方で「Gradle sync」が数分動きます。終わるまで待ちます。

### (任意)画面を縦向きに固定する

Android Studio の左側で `app > manifests > AndroidManifest.xml` を開き、`<activity` で始まる部分の中に次の1行を足します。

```
android:screenOrientation="portrait"
```

## 3. 自分のスマホで動作確認する

1. スマホの「設定 > デバイス情報」で「ビルド番号」を7回タップ → 開発者向けオプションが出る。
2. 「開発者向けオプション」で「USBデバッグ」をオン。
3. USBケーブルでパソコンとつなぐ。
4. Android Studio 上部でスマホが選ばれていることを確認して ▶(Run)を押す。

ゲームが起動すればOKです。ストア用のスクリーンショットもこのとき撮っておきます(最低2枚)。

## 4. 提出用ファイル(.aab)を作る

1. Android Studio のメニュー `Build > Generate Signed App Bundle or APK`。
2. 「Android App Bundle」を選んで Next。
3. 「Key store path」の下の「Create new...」で鍵ファイルを作る。
   - 保存場所:このフォルダの外(例:ドキュメント直下)に `yubinuki-key.jks`。
   - パスワードと Alias(例:`upload`)を決めて入力。
   - **鍵ファイルとパスワードは絶対になくさないこと**。アップデートを出すたびに使います。
4. 「release」を選んで Create。
5. 完成したファイルは `android/app/release/app-release.aab` にできます。

## 5. Google Play Console に登録する

1. https://play.google.com/console で開発者アカウントを作る(登録料 25米ドル、1回のみ)。本人確認があります。
2. 「アプリを作成」→ アプリ名「指毛ぬき」、ゲーム、無料。
3. ダッシュボードの「アプリのセットアップ」を上から順に埋める。
   - **ストアの掲載情報**:`store/googleplay-listing.txt` をコピペ。アイコンは `store/play-icon-512.png`、フィーチャーグラフィックは `store/play-feature-graphic.png`、スクリーンショットは手順3で撮ったもの。
   - **プライバシーポリシー**:`store/privacy-policy.html` をネット上に置いて、そのURLを入れる(Google サイトや GitHub Pages なら無料で置けます)。
   - **データセーフティ**:「データを収集しない」「共有しない」で回答。
   - **ターゲットユーザー**:13歳以上にしておくと、子ども向けアプリの追加審査を避けられます。
   - **広告**:「広告なし」。
   - **コンテンツのレーティング**:アンケートに正直に答える(暴力・性的表現などは全部「いいえ」)。

## 6. クローズドテスト(12人・14日間)

2023年11月13日以降に作った個人アカウントは、本番公開の前に必ずこれが必要です。

1. 「テスト > クローズドテスト」でトラックを作り、手順4の `.aab` をアップロード。
2. テスターのリストを作り、**12人以上**の Gmail アドレスを登録。
3. 表示される「参加用リンク」をテスターに送り、参加してアプリを入れてもらう。
4. **12人以上が14日間連続で参加したまま**にしてもらう(途中で抜けた人はカウントがやり直し)。

友達や家族に頼むのがいちばん確実です。期間中に何度か遊んでもらうと審査が通りやすくなります。

## 7. 本番公開を申請する

14日たったら、ダッシュボードの「製品版へのアクセスを申請」から申請します。審査は通常7日以内です。通ったら本番トラックに同じ `.aab` を出して公開です。

---

## アップデートを出すとき

1. `www/index.html` を書き換える。
2. `android/app/build.gradle` の `versionCode` を1つ増やす(例:1 → 2)。`versionName` も "1.1" などに変える。
3. コマンド画面で `npx cap sync android`。
4. 手順4と同じやり方で、**同じ鍵ファイル**を使って新しい `.aab` を作り、アップロード。

## 補足

- `capacitor.config.json` の `appId`(`com.yubinuki.game`)は世界で1つだけの ID です。Play Console で「すでに使われている」と出たら、`com.あなたの名前.yubinuki` のように変えてから手順2をやり直してください。一度公開すると変更できません。
- `npm run fonts` でゲームのフォントをアプリの中に入れているので、オフラインでも同じ見た目で遊べます。
