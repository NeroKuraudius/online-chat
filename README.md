# Online-Chat (簡易多人聊天室)
![/public/images/chat-preview.jpg]([https://github.com/NeroKuraudius/Beagle-Pos-System/blob/main/public/icon/beagle-index.jpg?raw=true](https://github.com/NeroKuraudius/online-chat/blob/main/public/image/%E8%81%8A%E5%A4%A9%E5%AE%A4.jpg?raw=true))

## 安裝與使用

### ※事前準備
### 確認已安裝 [Node.js](https://nodejs.org/zh-tw/download) 與 [MongoDB](https://www.mongodb.com/zh-cn)


### 1. 下載至本機並安裝套件
開啟cmd並輸入下方指令
```js
git clone 網址
```
繼續在cmd中輸入指令
```js
cd online-chat
```
進入本機資料夾後接著輸入
```js
npm install
```

### 2. 設定環境變數並啟用
輸入以下指令建立環境變數
```js
touch .env
```
至.env的檔案中將環境變數存入

回到cmd輸入
```js
npm run start
```
如出現`App is listening on 3000.`表示已成功啟動

啟動後點選下方連結進入(建議以全螢幕瀏覽)

[http://localhost:3000](http://localhost:3000)

請直接以下方預設帳號登入
※前後台分開登入，可點選右下角按鈕切換登入頁

1. 帳號 testUser1@test.com  密碼 12345678

2. 帳號 testUser2@test.com  密碼 abc987

3. 帳號 testUser4@test.com  密碼 srz7htx

(testUser3已因故殉職)



### 3. 功能

#### 左側：
1. 當前登入使用者名稱
2. 當前在線人數
3. 當前在線使用者

#### 中央：
1. 聊天區：所有聊天對話紀錄都會呈現在此(※紀錄不會保存，若重新整理將會消失)
2. 輸入區：下方為訊息輸入欄，不可為空或輸入全空白


### 使用套件與版本
- express: 4.18.2
- express-handlebars: 7.1.2
- express-session: 1.17.3
- connect-flash: 0.1.1
- bcryptjs: 2.4.3
- passport: 0.6.0
- passport-local: 1.0.0
- passport-facebook: 3.0.0
- passport-google-oauth20: 2.0.0
- passport-github2: 0.1.12
- socket.io: 2.5.0
- mongoose: 7.5.0
- dotenv: 16.3.1

