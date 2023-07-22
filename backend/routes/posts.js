const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//投稿を作成する
router.post("/", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        return res.status(200).json(savedPost);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//投稿を編集する
router.put("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            await post.updateOne({
                $set: req.body,
            });
            return res.status(200).json("投稿編集に成功しました！");
        } else {
            return res.status(403).json("あなたはほかの人の投稿を編集できません");
        }

    } catch (err) {
        return res.status(403).json(err);
    }
});

//投稿を削除する
router.delete("/:id/delete", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (post.userId === req.body.userId) {
            // await post.deleteOne({
            //     $set: req.body,
            // });
            await post.deleteOne();
            return res.status(200).json("投稿を削除しました！");
        } else {
            return res.status(403).json("あなたはほかの人の投稿を削除できません");
        }
    } catch (err) {
        return res.status(403).json(err);
    }
});

//投稿を取得する
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        return res.status(200).json(post);
    } catch (err) {
        return res.status(403).json(err);
    }
});

/**
 * 特定の投稿にいいねを押す
 * @endpoint 
 *          いいねの対象の投稿ID
 */
router.put("/:id/like", async (req, res) => {
    //自分自身じゃない場合
    try {
        const post = await Post.findById(req.params.id);
        //まだいいねが押されていなかったら
        if (!post.likes.includes(req.body.userId)) {
            await post.updateOne({
                $push: {
                    likes: req.body.userId
                },
            });
            return res.status(200).json("投稿にいいねを押しました！");

            //既に自分のいいねが押されていたら
        } else {
            //いいねを外す
            await post.updateOne({
                $pull: {
                    likes: req.body.userId
                }
            });
            return res.status(200).json("投稿のいいねを外しました");
            // return res.status(200).json(false);
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

//プロフィールの時のタイムライン取得（プロフィール対象者のみの投稿）
router.get("/profile/:username/:postcount/:initialgetposts", async (req, res) => {
    const initialGetPosts = req.params.initialgetposts;
    const startPostCount = parseInt(req.params.postcount) - initialGetPosts;

    try {
        const user = await User.findOne({ username: req.params.username });
        const posts = await Post.find({ userId: user._id })
            .sort({ createdAt: -1 }) // 投稿を降順に並び替える
            .skip(startPostCount) // 指定された開始位置までスキップする
            .limit(initialGetPosts); // 指定された数の投稿を取得する

        return res.status(200).json(posts);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//タイムラインの投稿を取得
router.get("/timeline/:userId/:postcount/:initialgetposts", async (req, res) => {
    const initialGetPosts = (req.params.initialgetposts);
    const endPointCount = (req.params.postcount);
    // const startPostCount = 0; // 0スタート
    const startPostCount = endPointCount - initialGetPosts; //initialGetPostsの件数分取得するため
    try {
        //自分の投稿内容を取得
        const currentUser = await User.findById(req.params.userId);
        const userposts = await Post.find({ userId: currentUser._id })
            .sort({ createdAt: -1 }); // 投稿を降順に並び替える

        const followingIds = currentUser.followings; // フォローしている友達のID配列を取得

        // フォローしている友達の投稿を取得
        const friendPosts = await Post.find({ userId: { $in: followingIds } })
            .sort({ createdAt: -1 });

        //自分とフレンドの投稿を結合
        const allPosts = [...userposts, ...friendPosts];

        //降順に並び替えて指定の投稿を20件取得する
        const sortedData = allPosts
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(startPostCount, endPointCount);

        return res.status(200).json(sortedData);
    } catch (err) {
        return res.status(500).json(err);
    }
});

//コメントを登録する
router.put("/:id/sendcomments", async (req, res) => {
    const commentData = {
        targetPostId: req.body.targetPostId,
        commentUserId: req.params.id,
        commentUserName: req.body.commentUserName,
        commentUserProfilePicture: req.body.commentUserProfilePicture,
        comment: req.body.comment,
        date: req.body.date
    };
    // return res.status(200).json(commentData);
    try {
        const targetPost = await Post.findOne({ _id: req.body.targetPostId });
        if (targetPost) {
            await Post.updateOne(
                { _id: req.body.targetPostId },
                { $push: { comment: commentData } }
            );
            return res.status(200).json(targetPost);
        } else {
            return res.status(404).json("対象の投稿が見つかりません。");
        }
    } catch (error) {
        return res.status(500).json("コメントの登録に失敗しました。");
    }
});


//コメントを取得する
router.get("/:postid/comments", async (req, res) => {
    try {
        const targetPost = await Post.findOne({ _id: req.params.postid });
        if (targetPost) {
            const comments = targetPost.comment;
            return res.status(200).json(comments);
        } else {
            return res.status(404).json("対象の投稿が見つかりません。");
        }
    } catch (error) {
        return res.status(500).json("コメントの取得に失敗しました。");
    }
});

//profileからコメントを登録する
router.put("/profile/:id/sendcomments", async (req, res) => {
    const commentData = {
        targetPostId: req.body.targetPostId,
        commentUserId: req.params.id,
        commentUserName: req.body.commentUserName,
        commentUserProfilePicture: req.body.commentUserProfilePicture,
        comment: req.body.comment,
        date: req.body.date
    };
    // return res.status(200).json(commentData);
    try {
        const targetPost = await Post.findOne({ _id: req.body.targetPostId });
        if (targetPost) {
            await Post.updateOne(
                { _id: req.body.targetPostId },
                { $push: { comment: commentData } }
            );
            return res.status(200).json(targetPost);
        } else {
            return res.status(404).json("対象の投稿が見つかりません。");
        }
    } catch (error) {
        return res.status(500).json("コメントの登録に失敗しました。");
    }
});

//profileでコメントを取得する
router.get("/profile/:username/:postid/comments", async (req, res) => {
    try {
        const targetPost = await Post.findOne({ _id: req.params.postid });
        if (targetPost) {
            const comments = targetPost.comment;
            return res.status(200).json(comments);
        } else {
            return res.status(404).json("対象の投稿が見つかりません。");
        }
    } catch (error) {
        return res.status(500).json("コメントの取得に失敗しました。");
    }
});
module.exports = router;