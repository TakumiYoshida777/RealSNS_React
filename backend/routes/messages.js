const router = require("express").Router();
const Message = require("../models/Message");

/**
 * 送られてきたメッセージリストを取得
 * @param {string} 閲覧する人のID
 */
router.get("/:id/read", async (req, res) => {
    try {
        const messages = await Message.find({
            $or: [
                { recipientId: req.params.id },
                { userId: req.params.id }
            ]
        });
        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json("メッセージの取得に失敗しました");
    }
});

/**
 * メッセージリストからやり取りのあるUserを抽出
 * @param {string} 閲覧する人のID
 */
router.get("/:id/chats", async (req, res) => {
    try {
        const messages = await Message.aggregate([
            {
                $match: {
                    $or: [
                        { recipientId: req.params.id },
                        { userId: req.params.id }
                    ],
                }
            },
            {
                $group: {
                    _id: "$userName",
                    message: { $last: "$$ROOT" } // 最初に出現するメッセージを選択
                }
            },
            {
                $replaceRoot: { newRoot: "$message" } // messageドキュメントをルートにする
            }
        ]);


        return res.status(200).json(messages);
    } catch (err) {
        return res.status(500).json("メッセージの取得に失敗しました");
    }
});

/**
 * メッセージを送信する
 */
router.put("/:id/send", async (req, res) => {
    // return res.status(200).json(req.body.message);

    const { userId, userName, recipientId, recipientName, profilePicture, date, read, title, message } = req.body;

    try {
        const newMessage = new Message({ userId, userName, recipientId, recipientName, profilePicture, date, read, title, message });
        await newMessage.save();
        return res.status(200).json("メッセージの送信に成功しました");
    } catch (err) {
        return res.status(500).json("メッセージの送信に失敗しました");
    }
});

/**
 * メッセージを既読にする
 */
// router.put("/:id/read", async (req, res) => {
//     const update = { recipientId: req.params.id, read: false };
//     try {
//         const message = await Message.updateMany(
//             { recipientId: req.params.id, read: false },
//             { read: true });
//         return res.status(200).json("メッセージの既読に成功しました");
//     } catch (err) {
//         return res.status(500).json("メッセージの既読に失敗しました");
//     }
// });
router.put("/:id/read", async (req, res) => {
    const messageIds = req.body.map((message) => message._id);
    try {
        await Message.updateMany(
            { _id: { $in: messageIds } },
            { read: true }
        );
        return res.status(200).json("メッセージの既読に成功しました");
    } catch (err) {
        return res.status(500).json("メッセージの既読に失敗しました");
    }
});


module.exports = router;
