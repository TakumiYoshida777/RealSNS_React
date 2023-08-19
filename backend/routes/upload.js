const router = require("express").Router();
const multer = require("multer");

// const storage = multer.diskStorage({

//     destination: (req, file, cb) => {
//         cb(null, "../real-sns/backend/public/images");
//     },
//     filename: (req, file, cb) => {
//         // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
//         // cb(null, file.fieldname + "-" + uniqueSuffix);
//         cb(null, req.body.name);
//     }
// });

// const upload = multer({ storage: storage });

// router.post("/", upload.single("file"), (req, res) => {
//     try {
//         return res.status(200).json("画像アップロードに成功しました！");
//     } catch (err) {
//         return res.status(500).json("画像アップロードに失敗しました！");
//     }
// });



// 画像のbase64データを受け取るエンドポイント
router.post('/', async (req, res) => {
    try {
        const { userId, imageBase64 } = req.body;

        // Userモデルを使用してprofilepictureを更新
        await User.findByIdAndUpdate(userId, { profilepicture: imageBase64 });

        res.status(200).json({ message: 'Image uploaded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;
