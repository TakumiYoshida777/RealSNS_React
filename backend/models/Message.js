const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({

    /** 送信者 */
    userId: {
        type: String,
        required: true,
    },

    /** 受信者 */
    recipientId: {
        type: String,
        required: true,
    },

    /** 送信者の名前 */
    userName: {
        type: String,
        default: ""
    },

    /** 受信者の名前 */
    recipientName: {
        type: String,
        default: ""
    },

    /** 送信者の写真 */
    profilePicture: {
        type: String,
        default: "/person/noAvatar.png"
    },
    //日付
    date: {
        type: Date,
        default: Date.now
    },
    //既読(trueで既読)
    read: {
        type: Boolean,
        default: false
    },
    //タイトル
    title: {
        type: String,
        max: 20,
        default: ""
    },
    //内容
    message: {
        type: String,
        required: true,
        max: 300
    },
    //送り主の画像
    sendPicture: {
        type: String,
        default: ""
    }

});

module.exports = mongoose.model("Message", MessageSchema);