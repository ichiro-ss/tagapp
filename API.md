# APIリファレンス

このページはバックエンドAPIの使用について説明するページです


## ログイン関係

### エントリポイント : __/api/login__

### パラメータ

 |名前      | 説明               |   
 | -------- | ------------------ | 
 | username | ユーザの名前       |  
 | password | ユーザのパスワード |

例 : /api/login?username=Tarou&password=Pasword <br>
 (\* いずれかのパラメータがない場合はエラーを返します)

### 仕様
いずれのメソッドも、application/x-www-form-urlencodedを前提としています

#### POSTメソッド
指定したパラメータでアカウントの作成を行います。<Br>

 - アカウントを作成できた場合:<br>
 Header : 200ステータス<br>
 Body   : なし 

 - アカウントを作成できなかった場合:<br>
 Header : 対応するBadステータス<br>
 Body : errorMessageを含む json

<br>

#### PUTメソッド
指定したパラメータでログインを行います。<br>
- ログインできた場合<br>
Header : 200ステータス<br>
Body : ログインできたユーザの情報をもつ json

- ログインできなかった場合<br>
Header : 対応するBadステータス<br>
Body : errorMessageを含む json

<br>

#### GETメソッド(POST, PUTメソッド以外)
現在ログインしているユーザを取得します。<br>

- ログインしている場合<br>
Header : 200ステータス<br>
Body : ログインしているユーザの情報をもつjson

- ログインしていない場合<br>
Header : 対応するBadステータス<br>
Body : errorMessageを含ふjson

## ログアウト関係

### エントリポイント: /api/logout

### パラメータ
現状では、パラメータはないです

### 仕様
#### 全てのメソッド
現在ログインしているアカウントからログアウトします。<br>
Header ; 200ステータス<br>
Body : なし<br>
(*) ログインしていない状態でも、200ステータスが返ります


## メモ関係
メモの新規作成、更新、単体取得、削除に関するAPIです。

### エントリポイント： /api/memo

 ### 仕様
 
 ### GETメソッド
　指定したmemoidのメモを取得します
 #### パラメータ


 |名前      | 説明               |   
 | -------- | ------------------ | 
 | memoid | 取得したメモのID       |  

- リクエストに成功時<br>
Header : 200<br>
Body : 取得したメモのjson

- リクエストに失敗時<br>
Header : 対応するBadStatus<br>
Body : エラーメッセージのテキスト 

<br>

### POSTメソッド

メモを新規作成します。<br>
注意：multi/data-formを前提としてます。

#### パラメータ

 |名前      | 説明               |   
 | -------- | ------------------ | 
 | username | メモ作成ユーザの名前       |  
 | memotitle| メモのタイトル |
 | memoContent| メモのコンテンツ  |  
 | tags| タグの値(文字列) |
 | thumbnail| サムネイルとなる画像ファイル |  
 | dateiso | メモの作成日付(ISO規格) |

 (※)tagsは複数の値を含められます<br>
 セッション(バックエンド側)のログインユーザとusernameが一致しないと作成できません


- リクエストに成功時<br>
Header : 200<br>
Body : なし

- リクエストに失敗時<br>
Header : 対応するBadStatus<br>
Body : エラーメッセージのテキスト 

<br>

### PUTメソッド

メモの更新を行います(未完成なので省略)

<br>

### DELTEメソッド
memoidで指定したメモを削除します<br>
指定したメモのuseridとセッションログインユーザが等しくないとできません


#### パラメータ

 |名前      | 説明               |   
 | -------- | ------------------ | 
 | memoid| 削除するメモのID       |

 
- リクエストに成功時<br>
Header : 200<br>
Body : なし

- リクエストに失敗時<br>
Header : 対応するBadStatus<br>
Body : エラーメッセージのテキスト 

<br>