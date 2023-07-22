const router = require("express").Router();
const User = require("../models/User");

/**
 * 検索に該当したユーザー情報を部分一致で取得
 * @req 検索条件
 */
router.get("/:key", async (req, res) => {
    let searchKeyword = {
        username: { $regex: `${req.params.key}`, $options: "i" }
    };
    try {
        let users = await User.find(searchKeyword);
        return res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});

/**
 * 検索に該当したユーザー情報を完全一致で取得
 * @req 検索条件
 */
router.get("/:key/perfect", async (req, res) => {
    let searchKeyword = {
        username: { $regex: `${req.params.key}` }
    };
    try {
        let users = await User.find(searchKeyword);
        return res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;