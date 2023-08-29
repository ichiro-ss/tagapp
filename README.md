# tagapp
this repository is for hackathon vol.8

---
## 実行方法
tagappフォルダのcompose.ymlで実行環境を管理しています。<br>
よって、以下のコマンドでプログラムを実行することができます。<br>

``` tagappフォルダ
docker compose up
```

その後、データベースとの接続が完了したことを表す以下のメッセージが表示されると、バックエンドのプログラムの実行準備が完了します。

```
app-plate-go        | db connected!
app-plate-go        | Start Listen 0.0.0.0:5000
```

### 接続URL
現状ではどちらもLocalhostでリクエストを待機しています。<br>
フロントエンド、バックエンドには以下のURLで接続できます。<br>

フロントエンド：localhost:9000<br>
バックエンド：localhost:5000<br>

---
## フォルダ構成
大別して __back-end__ と __front-end__ の二つに分けられ、それぞれその名の通りバックエンドプログラムとフロントエンドプログラムに関連するファイルが保存されています。

## back-end

back-endフォルダの簡易ツリー<br>
(ツリーの一部を表示)
```
back-end
  |---app-plate
  |   |---cmd
  |   |---data
  |   |--handler
  |
  |---build
  |   |---.go_env
  |   |---.DockerFile
  |
  |---mysql
      |---sqls
      |---.env_mysql
      |---DockerFile
```

#### app-plate フォルダ
バックエンドで走るgolangのソースコードの保存フォルダ
 - cmd : プログラムの実行ソースコード用のフォルダ
 - data : データベース操作関連のライブラリフォルダ
 - handler : ハンドラー関数関連のライブラリフォルダ

#### build フォルダ
 - .go_env : golang実行環境の環境変数の設定ファイル<br>
 - DockerFile : golang実行環境のコンテナファイル

#### mysql フォルダ
mysqlに関連するファイルのフォルダ
 - sqls : データベースの初期化用sqlを保存するフォルダ
 - .env_mysql : mysql実行環境の環境変数設定ファイル
 - DockerFile : mysql実行環境のコンテナファイル

## front-end

front-endフォルダの簡易ツリー<br>
(ツリーの一部を表示)
```
front-end
  |--- front-app
  |     |--- public
  |     |--- src
  |           |--- pages
  |           |--- styles
  |
  |--- DockerFile
```

#### front-app フォルダ

フロントエンドのアプリケーションフォルダ<br>
(主に編集するのは以下のフォルダだと思います。)

 - __src/pages__ : フロントエンドのページを構成するコンポーネント関連のフォルダ
 - __src/styles__ : 各コンポーネントのスタイルを操作するcss関連のフォルダ

 (あと多分 __public__ フォルダ)

 #### DockerFile
フロントエンドの実行環境用(Node.js)のコンテナファイル

----


## Golangのライブラリ追加
Golangで追加のライブラリを利用したい場合は、__app_plate__フォルダで以下のコマンドを実行することでgo.modが変更されて適用されます。

```
go get [追加したいライブラリのURL]
```

## Node.jsのライブラリ追加
dockerのtagapp-front-appコンテナに入り，以下のコマンドを実行することで追加されます。

```
npm install [追加したいライブラリ名]
```

## CORS(Cross-Origin Rsource Sharing対策)
CORS対策のために、クロスエンド側にはリクエストに対して以下のような設定を追加してください。<br>
これらの設定が適用されていないと、バックエンド側でCookieが利用できず一部のAPIが機能しません。<br>
リクエストにこれらの設定を追加する関数をライブラリに用意しとくと便利かなと思います。

```ts
 const request = {
  creadentials:"include",
  headers: {
    "Access-Control-Allow-Credentials": "true",
  }
 }
```
