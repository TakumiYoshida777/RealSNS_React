const router = require("express").Router();
const Message = require("../models/Message");

/**
 * メッセージリストを取得
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

/**
 * 送信者が自分以外の全てのメッセージを未読にする 
 */
router.put("/:id/noread", async (req, res) => {
    try {
        // req.params.id === recipientIdの条件がなりたつメッセージのMessageスキーマのreadをfalseにする

        // const messages = await Message.find({ recipientId: req.params.id });
        // messages.forEach((message) => {
        //     if (message.recipientId === recipientId) {
        //         message.read = false;
        //     }
        // });

        // req.params.id が受信者の ID であることを確認し、それ以外のメッセージを未読にする
        const recipientId = req.params.id;
        await Message.updateMany({ recipientId: recipientId }, { read: false });
        return res.status(200).json("メッセージを未読にしました");
    } catch (err) {
        return res.status(500).json("メッセージを未読にできませんでした");
    }
});

router.put("/", async (req, res) => {
    return res.status(200).json("テストに成功しました");

});

/**
 * 送信したメッセージの画像を更新
 */
router.put("/:id/update_send_pictures", async (req, res) => {
    try {
        const messageId = req.params.id; // パラメータからメッセージIDを取得
        const newProfilePicture = req.body.profilePicture; // リクエストボディから新しいプロフィール画像を取得

        // メッセージIDに基づいてデータベースからメッセージを取得
        const message = await Message.findById(messageId);

        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }

        // メッセージのuserIdがリクエストのIDと一致する場合、profilePictureを更新
        if (message.userId === req.params.id) {
            message.profilePicture = newProfilePicture;
            await message.save(); // 変更を保存

            return res.status(200).json({ message: "Profile picture updated successfully" });
        } else {
            return res.status(403).json({ error: "Unauthorized" });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = router;
