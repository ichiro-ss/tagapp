# tagapp
this repository is for hackathon vol.8

---
## 実行方法
tagappフォルダのcompose.ymlで実行環境を管理しています。<br>
よって、以下のコマンドでプログラムを実行することができます。<br>

``` tagappフォルダ
docker compose up -d
```

その後、データベースとの接続が完了したことを表す以下のメッセージが表示されると、バックエンドのプログラムの実行準備が完了します。

```
app-plate-go        | db connected!
app-plate-go        | Start Listen 0.0.0.0:5000
```

### 接続URL
現状ではどちらもLocalhostでリクエストを待機しています。<br>
フロントエンド、バックエンドには以下のURLで接続できます。<br>

フロントエンド：localshot:9000<br>
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
(多分)front-appフォルダで以下のコマンドを実行することで追加されると思います。

```
npm install [追加いライブラリ名]
```