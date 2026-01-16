# Web公開（デプロイ）の手順書

作成した「ライフプラン・シミュレーター」をWeb上に公開し、他の人に見てもらえるようにするための手順です。
Next.jsで作られたアプリの公開には、**Vercel（バーセル）** というサービスを使うのが最も簡単で推奨されています。

## 手順概要
1. GitHub（ギットハブ）にコードを保存する
2. VercelとGitHubを連携して公開する

---

## ステップ1: GitHubにコードをアップロードする
（すでにGitHubを使っている場合は、リポジトリを作成してプッシュしてください）

1. [GitHub](https://github.com/)のアカウントを作成（またはログイン）します。
2. 右上の「+」アイコンから「**New repository**」を選択します。
3. `money-simulation` などのリポジトリ名を入力し、「Public」（公開）または「Private」（非公開）を選んで「**Create repository**」をクリックします。
4. 作成後の画面に表示されるコマンドを使って、手元のPCからコードをアップロード（プッシュ）します。

```bash
# ターミナルで以下のコマンドを実行（ユーザー名やリポジトリ名は自分のものに置き換えてください）
git remote add origin https://github.com/あなたのユーザー名/money-simulation.git
git branch -M main
git push -u origin main
```
※ Gitの設定がまだの場合は、別途Gitの初期設定が必要です。

## ステップ2: Vercelで公開する

1. [Vercel](https://vercel.com/)にアクセスし、「**Sign Up**」をクリックします。
2. 「**Continue with GitHub**」を選択して、GitHubアカウントでログインします。
3. ダッシュボードの「**Add New...**」から「**Project**」を選択します。
4. "Import Git Repository" のリストに、先ほど作成した `money-simulation` が表示されるので、「**Import**」ボタンを押します。
5. 設定画面が表示されますが、通常はそのまま「**Deploy**」ボタンを押すだけでOKです。
   - Framework Preset: `Next.js` が自動選択されているはずです。
   - Root Directory: `./` (そのままでOK)
6. 1分ほど待つと、紙吹雪が舞ってデプロイ完了画面になります。
7. 表示されたURL（例: `https://money-simulation-xxxxx.vercel.app`）をコピーして、知人に共有できます！

---

## 補足: 別の方法（Vercel CLI）
もしGitHubを使わずに公開したい場合は、Vercelのコマンドラインツールを使う方法もあります。

1. ターミナルで `npm i -g vercel` を実行してツールをインストール。
2. プロジェクトのフォルダで `vercel login` を実行してログイン。
3. `vercel` と入力してEnterを押していくだけでデプロイされます。

ご不明な点があれば聞いてください！


## 登録情報
- Vercel Username: ynishimura24
