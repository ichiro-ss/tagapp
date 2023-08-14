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

#### PUSHメソッド
指定したパラメータでアカウントの作成を行います。<Br>

 - アカウントを作成できた場合:<br>
 Header : 200ステータス<br>
 Body   : なし 

 - アカウントを作成できなかった場合:<br>
 Header : 対応するBadステータス<br>
 Body : errorMessageを含む json

<br>

#### GETメソッド(PUSHメソッド以外)
指定したパラメータでログインを行います。<br>
- ログインできた場合<br>
Header : 200ステータス<br>
Body : ログインできたユーザの情報をもつ json

- ログインできなかった場合<br>
Header : 対応するBadステータス<br>
Body : errorMessageを含む json