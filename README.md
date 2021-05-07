<div align="center" style="vertical-align: center;">
  <img src="https://cdn.rpaka.dev/icon/poica.png" height="80px" />
  <h1>POICA-CORE</h1>
  <h1>電子ポイントカード作成サービス</h1>
  <h2>バックエンド</h2><br / >
  <img src="https://cdn.rpaka.dev/logo/js.png" height="80px" style="padding-right: 15px;" />
  <img src="https://cdn.rpaka.dev/logo/vue.svg" height="80px" style="padding-right: 15px;" />
  <img src="https://cdn.rpaka.dev/logo/vuetify.svg" height="80px" style="padding-right: 15px;" />
  <br / ><br / >
</div>

![動作イメージ](https://cdn.rpaka.dev/useimage/poica/0_top.png)

<div align="center" style="vertical-align: center;">
<b>POICA-WEB(フロントエンド)</b> | <a href="https://github.com/ritsu2891/POICA-CORE">POICA-CORE(バックエンド)</a>
</div>

<div align="center" style="vertical-align: center;">
<a href="https://poica.rpaka.dev">poica.rpaka.dev</a>（試験公開）
</div>

# 概要
電子ポイントカードを作成できるサービスです。ロゴ画像と配色でオリジナルデザインの電子ポイントカードを作成し、SNS等で共有することにより配布できます。現在はポイントの付与しかできませんが、ポイントを利用することもできるようにしたいと考えています。

# 背景・考え
PayPayやLINEペイ等のQRコード決済の登場によって電子決済が急速に普及しましたよね。便利に使ってるんですが、今まで現金という実物に価値を委ねていたのが画面上に表示される目には見えない電子的な値に委ねる形に変わって、価値を委ねるのに実物は必要ないんだなと言う事が認識させられました。つまり現金に価値があるのは、現金という対象に対して皆が価値がある物として認めているからであって別に実体がなくたって構わないという事ですよね。
別にお金じゃなくても似たような物があって、それはお店とかがやってる「ポイント」なんじゃないでしょうか。その店と店の利用者の間でのみ価値があるという認識があり、成り立っている物という見方が出来ます。ただ、ポイントはお金のように国全体で普遍的に価値が認められていないという「範囲」の違いでしかないのだと思います。

このように、価値を代替する存在としてのお金やポイントですが、あまり価値を代替する存在としての認識は薄いですよね。まぁ生活をしていくのに何の気なしに使ってるので、それも当然と思います。一方でこの「価値を代替する存在」という側面は興味深いところがあります。価値は目に見えませんが、価値を代替する存在たる現金やポイントは「数値として」はっきりと目に見える形にすることが出来ます。

上記のような考えの基、お店のような商業的な利用でなくとも、感謝や頑張りなどに感じた「価値」を目に見える形、すなわち「ポイント」で共有できれば･･･と思い、個人レベルでも簡単に利用できる電子ポイントカードサービスを作成したという次第であります。お金のような広範囲にはならずとも狭い範囲での経済圏ができるかもしれませんね。

# 機能

**アカウント**

アカウントはGoogleアカウントによる認証で作成・ログインできます。

**ポイントカードの作成**

名前を付けてポイントカードを作成できます。デザイン・色を選び、ロゴ画像を1つ付ける事が出来ます。デザインは今のところ3種類実装しています。

ポイントカードの表示はVutによるコンポーネントとして実装されており、DOMで描画してCSSのtransformで表示位置や大小を調整しています。

![カードの作成](https://cdn.rpaka.dev/useimage/poica/2_masteradd.png)

**ポイントカードの共有** 

作成したポイントカードはリンクで共有して、発行してもらうことができます。

![カードのリンク取得](https://cdn.rpaka.dev/useimage/poica/9_share.png)

バックエンドでOGP画像を生成しているためTwitterでいい感じに表示されます。

![Twitter OGP](https://cdn.rpaka.dev/useimage/poica/8_twitter.png)

**ポイントカードの発行**

ポイントカード利用者はリンクを開いてポイントカードを追加できます。

![カードの発行](https://cdn.rpaka.dev/useimage/poica/4_cardadd.png)

追加したカードは一覧で表示されます。

![カード一覧](https://cdn.rpaka.dev/useimage/poica/5_cardlist.png)

**ポイントの付与**

ポイントカード管理者はユーザを指定してポイントを付与するカードを選び、ポイントを付与できます。ポイントカード所有者にQRコードを表示してもらい、それを読み取ることでもポイントを付与するカードを指定することが出来ます。

※QRコードの読み取りは現在Mobile Safari（iPhone）上では動作しません。<<既知の不具合; 修正予定>>

![ポイント付与](https://cdn.rpaka.dev/useimage/poica/6_pointop.png)

# 利用

本サービスは私の趣味のサービスですので、商用利用は想定しておりません。また、私以外の方がWEB上にサービスとして公開することは辞めてください。

本サービスはPOICA-CORE（バックエンド）との利用を想定しています。

POICA-WEBはPOICAのフロントエンドプログラムです。ブラウザ上で所持/管理しているポイントカードの表示・追加・削除などをPOICA-COREを使って行います。

# 構成

## 動作環境
- Google Chrome 90.0.4430.93（動作確認環境）
- Safari 14.1（動作確認環境）
- Mobile Safari 14.1（動作確認環境）
※カメラなど一部機能に制約あり

## 利用ライブラリ
- cookie-universal 2.1.4
- element-resize-event 3.0.3
- jsqr 1.4.0
- lodash 4.17.21
- nuxt 2.15.4
- qrcode 1.4.4
- url-join 4.0.1
- vue-svg-filler 1.0.6
- vuetify 2.4.11
- jest 26.6.3
- axios

Nuxt.js + Vue.jsを使っています。Material DesignなUIを実現するためにVuetify.jsを使っています。ポイントカードの指定などのためにQRコードを表示するためにqrcodeを使っています。

# 導入
(1) `.env.example` をコピーし `.env` という名前にする。

|項目|内容|例|
|---|---|---|
|API_URL|POICA-COREのHTTP URL|http://localhost:4000|
|SELF_URL|POICA-WEBのHTTP URL|http://localhost:3000|

(2) 以下のコマンドを実行してフロントのコードを生成する。
```
$ npm run install
$ npm run build
```

# 実行
## 一時的に実行
```
$ npm run start
```

## UbuntuのServiceとして登録
`POICA-WEB.service` 内の `ExecStart` のパスを `run.sh` のフルパスに変更後以下を実行する。
```
$ zsh Install.sh
```

<!-- ## テストの実行
導入の手順が全て終わっている状態で以下を実行
```
$ npm run test
``` -->

# フォルダの説明
- `components` : UIの小さなひとかたまり（コンポーネント）が格納されています。
- `layouts` : ページのレイアウトを指定するファイルが格納されています。
- `middleware` : ページ遷移の前に実行されるスクリプトが格納されています。
- `models` : データのモデル定義が格納されています。
- `pages` : 各ページを表示するファイルが格納されています。
- `plugins` : Vueインスタンスで共通で使える処理が入っているスクリプトが格納されています。
- `static` : ロゴ画像などの静的ファイルが格納されています。
- `utils` : アプリケーション全体で使用するスクリプトが格納されています。

# 課題
- テストが書かれていない。Vueコンポーネントのユニットテストから書いていきたい。
- カード作成の結果などを表示しておらず、処理が完了したのか失敗したのか分かりにくい。
- エラー処理が不十分な気が何となくしている。テストがないからですね。

# 自己評価・感想
ひとまずの作成なので、ポイントがただ増減するだけのポイントカードしか表現できていないですが、カスタマイズ可能なポイントカードを作成して簡単に共有できるという自分の考えの一番コアな部分は実装できていると思います。