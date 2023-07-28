const mongoose = require("mongoose");
const User = require("../models/User");

const UserScema = new mongoose.Schema({
    username: {
        type: String,   //文字列のみ
        required: true, //必ず必要なデータ
        min: 1,         //最小の文字数
        max: 25,        //最大の文字数
        unique: true,   //重複していないデータ
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 50,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: ""
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    //概要欄
    desc: {
        type: String,
        max: 70,
    },
    city: {
        type: String,
        max: 50,
        default: "未設定"
    },
    age: {
        type: String,
        default: "未設定"
    },

},
    { timestamps: true }
);

module.exports = mongoose.model("User", UserScema);
