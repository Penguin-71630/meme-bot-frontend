{%hackmd @penguin71630/theme %}

# Go Final Project

主題：Discord 機器人，功能是存放一些梗圖，然後讓 Discord user 可以自行新增圖片、自定義 alias、根據 alias 叫出圖片。

除了 Discord bot 之外，還會有一個前端的網頁可以方便使用者查看、編輯這些圖片。



## Topology
<div style="text-align:center;">
    <img src="https://hackmd.io/_uploads/H1eUrs-f-l.png" width="70%"/>
</div>


## Discord Bot Command (Draft)

圖片與 alias 的對應：多對多，一張圖片可以有很多 aliases，一個 alias 也可以對應到很多張圖片。

輸出圖片是被動觸發的：只要在使用者的聊天訊息偵測到特定關鍵詞（聊天訊息包含任意一個 alias，以第一個匹配成功的為主，匹配方式我們打算使用 Aho-Corasick algorithm 因為我們準備 ICPC 的時候學過），假設該 alias 是 `<alias>`，bot 會從含有該 `<alias>` 的圖片隨機挑選一個輸出。

在 Discord 對話框輸入 `/image upload` 並附上一個圖片檔（可以是 JPG/PNG/GIF），bot 會為這張圖片生成隨機一個唯一的 ID（例：`670bc00e94fd77cf6852afc7`），並將這個圖片存在 Database。

在 Discord 對話框輸入 `/image link alias: <alias> image: <image_ID>`，會為該圖片新增一個 alias。



## Web Backend API (Draft)

- `GET /api/image/<image_ID>`：取得某張圖片檔案。
- `GET /api/image-list`：列出 db 內所有圖片檔案名稱。
- `GET /api/alias-list`：列出 db 內所有 alias。
- `/auth/gen-access-url`：預計使用 token-JWT exchange based authentication 來作為使用後端 API 的身分驗證。

其實應該還要有很多，還沒想清楚。


## Web Frontend

除了 Discord bot 之外，預計用 React + TypeScript（CSS 用 Tailwind）寫一個前端網頁。

前端網頁大概長這樣：
```
Memebot                                  [Upload-Image] [Login]
---------------------------------------------------------------
[ sadge        ]     ( Search Bar                             )
[ 不要吼我啦     ]
[ 什麼都願意做   ]     Alias: 什麼都願意做
[ 好時代來臨力   ]     [ 方形圖片框1 ] [ 方形圖片框2 ] [ 方形圖片框3 ]
[ 野獸         ]      [ 方形圖片框4 ]
[ poop         ]
[ rrrrr        ]     Alias: 好時代來臨力
[ 讓我看看      ]     [ 方形圖片框1 ] [ 方形圖片框2 ]
[ 我愛慕虛榮啦   ]
[ 一輩子        ]     Alias: 野獸
[ 是又怎樣      ]     [ 方形圖片框1 ] [ 方形圖片框2 ] [ 方形圖片框3 ]
[ Img w/o alias ]
```

上方是 Navbar：
- Navbar 左側是我們的 Bot 名稱。
- Navbar 右側是功能按鈕，目前只有 Upload Image、Login。

### Find

- 左側 sidebar 是所有 aliases 的 table of content。類似 HackMD、mdBook 瀏覽某篇文章的功能。
    - 最後一列是「尚未有暱稱的圖片」。
- 右側緊接在 Navbar 底下是 search bar
    - search bar 是即時反饋，使用者不需要按 enter 就會自動列出符合當前條件的圖片們。
- 右側在 search bar 下方是各個 alias 對應的圖片們。
    - 點一下圖片之後，會跳出一個浮動視窗，顯示這張圖片以及圖片相關資訊（包含誰upload 這張圖片、什麼時候 upload 這張圖片、alias 有哪些），以及可以在這裡編輯 alias、刪除圖片。

### Upload Image

使用者按下這個按鈕之後，跳出一個浮動視窗：

```
======================================
| |--------------------------------| |
| |                                | |
| |                                | |
| |      Drag your image here      | |
| |                                | |
| |                                | |
| |--------------------------------| |
|                                    |
| Aliases of this image:             |
| [ alias_01                       ] |
| [ alias_02                       ] |
| [+] [ (Add a new alias)          ] |
|                                    |
|                           <Upload> |
======================================
```

### Login

驗證當前操作前端的 Discord User，未登入的話只能使用查看相關的操作，不能編輯、上傳、刪除。

這個有空再來做。



