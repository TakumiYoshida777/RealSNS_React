const express = require("express");
const WebSocket = require('ws');
const app = express();
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
const uploadRoute = require("./routes/upload");
const searchRoute = require("./routes/search");
const messagesRoute = require("./routes/messages");
const PORT = 5000;
const mongoose = require("mongoose");
const path = require("path");

require("dotenv").config();

function closeChangeStream(timeInMs = 60000, changeStream) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Closing the change stream");
            resolve(changeStream.close());
        }, timeInMs);
    });
};

// MONGOURL環境変数からURIを取得
const uri = process.env.MONGOURL;

// DB接続
mongoose
    .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDBに接続しました");
        // サーバーの起動などの追加のコード
    })
    .catch((error) => {
        console.error("MongoDBへの接続に失敗しました:", error.message);
        // エラーハンドリングなど必要な処理
    });

// ミドルウェア
app.use("/images", express.static(path.join(__dirname, "public/images")));
app.use(express.json());
// ルートディレクトリを作成する　他から呼ぶときは"/"でアクセスできる
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);
app.use("/api/upload", uploadRoute);
app.use("/api/search", searchRoute);
app.use("/api/messages", messagesRoute);
app.use(express.static(path.join(__dirname, '../frontend/build')));

/**
 * @param req
 *        ユーザー側から受け取ったリクエスト
 * @param res
 *        サーバーから受け取った値をユーザー側に返す
 */
app.get("/", (req, res) => {
    res.send("hello,express");
});

const server = app.listen(PORT, () => console.log("サーバーが起動しました"));

/**
 * /api以外のアクセスは全てReactに渡す
 */
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});
/**
 * messageコレクションに変更が加わった際に通知する（ストリームを使用）
 */
const wss = new WebSocket.Server({ server });
if (wss) {
    console.log("WebSocketサーバーが起動しました");

} else {
    console.log("WebSocketサーバーが起動に失敗しました");
}

/**
 * WebSocket
 */
wss.on('connection', (socket) => {
    //監視するテーブル（collection）
    const collectionMessages = mongoose.connection.db.collection("messages");
    const collectionPosts = mongoose.connection.db.collection("posts");

    //監視を宣言
    const changeStreamMessages = collectionMessages.watch();
    const changeStreamPosts = collectionPosts.watch();

    /**
     * リアルタイム通信処理
     */
    //メッセージ
    changeStreamMessages.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newMessage = change.fullDocument;
            socket.send(JSON.stringify(newMessage));
        }
    });
    //投稿
    changeStreamPosts.on('change', (change) => {
        if (change.operationType === 'insert') {
            const newPost = change.fullDocument;
            socket.send(JSON.stringify(newPost));
        }
    });

    //２分おきにソケットをクローズする
    socket.on('close', async () => {
        await closeChangeStream(120000, changeStreamMessages);
        await closeChangeStream(120000, changeStreamPosts);
    });
});
