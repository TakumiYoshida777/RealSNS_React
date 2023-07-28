//ユーザー情報を格納するファイル
//server.jsにどんどん内容を記述すると分かりにくくなってしまうので、ファイルを分割することで後々の開発で役に立つ
const router = require("express").Router();
const User = require("../models/User");

//CRUD
//ユーザー情報の更新
router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set: req.body,
            });
            const editedDesc = await User.findById(req.body.userId);
            res.status(200).json(editedDesc
            );
        } catch (err) {
            return res.status(500).json(err);
        }
    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を更新できます");
    }
});


//ユーザー情報の削除
router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);

            res.status(200).json("ユーザー情報が削除されました");
        } catch (err) {
            return res.status(500).json(err);
        }

    } else {
        return res.status(403).json("あなたは自分のアカウントの時だけ情報を削除できます");
    }
});



//クエリでユーザー情報を取得
router.get("/", async (req, res) => {
    const userId = req.query.userId;
    const username = req.query.username;
    try {
        const user = userId
            ? await User.findById(userId)
            : await User.findOne({ username: username });

        const { password, updatedAt, ...other } = user._doc;
        return res.status(200).json(other);
    } catch (err) {
        return res.status(500).json(err);
    }
});



/**
 * ユーザーのフォロー
 * 
 * @param {string} フォロー対象のユーザーID
 * @param {*} req フォローする本人のユーザー情報
 */
router.put("/:id/follow", async (req, res) => {
    //自分自身じゃない場合
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォロワーリストに自分のIDが入っていなければフォローできる
            if (!user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $push: {
                        followers: req.body.userId
                    },
                });
                await currentUser.updateOne({
                    $push: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォローに成功しました。");
            } else {
                return res.status(403).json("あなたはすでにこのユーザーをフォローしています。");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    //自分自身の場合
    else {
        return res.status(500).json("自分自身をフォローできません。");
    }
});

//ユーザーのフォローを外す
router.put("/:id/unfollow", async (req, res) => {
    //自分自身じゃない場合
    if (req.body.userId !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);
            //フォロワーに存在したらフォローを外せる
            if (user.followers.includes(req.body.userId)) {
                await user.updateOne({
                    $pull: {
                        followers: req.body.userId
                    },
                });
                await currentUser.updateOne({
                    $pull: {
                        followings: req.params.id,
                    },
                });
                return res.status(200).json("フォロー解除しました！");
            } else {
                return res.status(403).json("このユーザーはフォロー解除できません");
            }
        } catch (err) {
            return res.status(500).json(err);
        }
    }
    //自分自身の場合
    else {
        return res.status(500).json("自分自身をフォロー解除できません。");
    }
});


//フォロー中のユーザー取得
router.get("/:id/:followings", async (req, res) => {
    // return res.status(200).json(req.params.followings);
    const followings = req.params.followings.split(",");
    try {
        const users = await User.find({ _id: { $in: followings } });

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json("フォロー中のユーザーデータ取得に失敗しました");
    }
});


//フォロワーのユーザーを全権取得
router.get("/:id/:followers", async (req, res) => {
    // return res.status(200).json(req.params.followings);
    const followings = req.params.followers.split(",");
    try {
        const users = await User.find({ _id: { $in: followings } });

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json("フォロー中のユーザーデータ取得に失敗しました");
    }
});

//全てのユーザーからランダムに１０人取得
router.get("/randomusers", async (req, res) => {

    try {
        const users = await User.aggregate([
            { $sample: { size: 10 } }, // ランダムに10人選択
        ]);

        return res.status(200).json(users);
    } catch (err) {
        return res.status(500).json({ error: "ランダムなユーザーを取得できませんでした" });
    }
});




//お気に入りの投稿一覧を取得
router.get('/:id/bookmarkpostlist', async (req, res) => {
    // return res.status(200).json("OKOKおーけ")
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ error: '指定されたユーザーが見つかりません' });
        }

        const bookmarkPostsId = user.bookmarkPosts;
        const bookmarkPostList = await Post.find({
            _id: { $in: bookmarkPostsId }
        });
        return res.status(200).json(bookmarkPostList);
    } catch (err) {
        return res.status(500).json({ error: 'お気に入りの投稿一覧の取得に失敗しました' });
    }
});
module.exports = router;