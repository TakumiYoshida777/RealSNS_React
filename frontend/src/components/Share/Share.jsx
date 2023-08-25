import React, { useRef, useState } from 'react';
import "./Share.css";
import { Analytics, Face, Gif, Image } from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';
import Resizer from "react-image-file-resizer";

const Share = ({ setPostCatch }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const desc = useRef();
    const [file, setFile] = useState(null);
    //選択した画像の元のデータサイズを保持
    const [selectedImageSize, setSelectedImageSize] = useState(null);
    //選択中の画像をエンコードしたデータ
    const [selectedImage, setSelectedImage] = useState(null);

    /**
     * 選択された背景画像をリサイズする
     * @param {*} event 
     */
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        // const fileSizeInBytes = file.size;
        setSelectedImageSize(file.size);
        if (selectedImageSize < 50000) {
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setSelectedImage(e.target.result);
                    setFile(file); // ここでfileをセットする
                };
                reader.readAsDataURL(file);//エンコードする
            }
        } else {
            Resizer.imageFileResizer(
                file, // アップロードされたファイル
                1000, // リサイズ後の幅
                1000, // リサイズ後の高さ
                'JPEG', // フォーマット
                30, // 圧縮後のファイルサイズ（キロバイト）
                0, // 回転（0度）
                (uri) => {
                    // リサイズされた画像のデータURIが渡されるので、これを保存または表示する処理を行う
                    // console.log("※URL1※", uri);
                    if (uri) {
                        // Base64 エンコードされたデータのバイト数を求める
                        const base64Data = uri.split(',')[1];
                        const byteSize = Math.ceil(base64Data.length);
                        const kilobyteSize = byteSize / 1024;
                        console.log("------complete!! resized image------");
                        console.log("リサイズ", uri);
                        console.log("推定サイズ:", kilobyteSize, "KB");
                        if (kilobyteSize < 50) {
                            setSelectedImage(uri);
                            setFile(uri); // ここでfileをセットする
                        } else {
                            alert("画像サイズが大きすぎます");
                        }
                    }
                },
                'base64' // データURIの形式
            );
        }
    };
    // console.log("元ファイルのバイト数:", selectedImageSize, "bytes");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newPost = {
            userId: user._id,
            desc: desc.current.value,
        };

        if (file) {
            const data = new FormData();
            // const filename = Date.now() + file.name;
            // data.append("name", filename);
            // data.append("file", file);
            data.append("imageBase64", selectedImage);
            newPost.img = selectedImage;

        }
        try {
            if (newPost.desc === "") {
                alert("何も入力されていません。");
            } else {
                await axios.post("/posts", newPost);
                desc.current.value = "";

            }

        } catch (err) {
            console.log(err);
        }
        setPostCatch((postCatch) => !postCatch);
        setFile(null);
        setSelectedImage(null);
    };
    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={
                        user.profilePicture
                            ? user.profilePicture
                            : PUBLIC_FOLDER + "person/noAvatar.png"} alt="" className="shareProfileImg" />
                    <input type="text"
                        className="shareInput"
                        placeholder="今何してるの？"
                        ref={desc} />
                </div>
                <hr className="shareHr" />
                <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
                    <div className="shareOptions">
                        <label className="shareOption" htmlFor="file">
                            <Image className="shareIcon" htmlColor="blue" />
                            <span className="shareOptionText">写真</span>
                            <input type="file"
                                id="file"
                                accept=".png, .jpg, .webp"
                                style={{ display: "none" }}
                                onChange={handleImageChange} />
                        </label>
                        {selectedImage && <div className="selectedPostImage">
                            <img src={selectedImage} alt="" />
                        </div>}

                        {/* <div className="shareOption">
                            <Gif className="shareIcon" htmlColor="hotpink" />
                            <span className="shareOptionText">Gif</span>
                        </div>
                        <div className="shareOption">
                            <Face className="shareIcon" htmlColor="green" />
                            <span className="shareOptionText">気持ち</span>
                        </div>
                        <div className="shareOption">
                            <Analytics className="shareIcon" htmlColor="red" />
                            <span className="shareOptionText">投票</span>
                        </div> */}
                    </div>
                    <button className="shareButton"
                        type="submit">
                        投稿
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Share;