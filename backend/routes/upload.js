const router = require("express").Router();
const multer = require("multer");

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, "../real-sns/backend/public/images");
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
        // cb(null, file.fieldname + "-" + uniqueSuffix);
        cb(null, req.body.name);

    }
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
    try {
        return res.status(200).json("画像アップロードに成功しました！");
    } catch (err) {
        return res.status(500).json("画像アップロードに失敗しました！");
    }
});

module.exports = router;
