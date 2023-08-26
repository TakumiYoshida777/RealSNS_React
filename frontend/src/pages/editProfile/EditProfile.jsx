import React, { useContext, useRef, useState } from 'react';
import './EditProfile.css';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Resizer from "react-image-file-resizer";

const EditProfile = ({ handleEditBtn, editTextState, newText, setNewText, profileUser }) => {
    const { user } = useContext(AuthContext);
    const editDesc = useRef();
    const editCity = useRef();
    const editAge = useRef();
    const username = useParams().username;
    const { updateUser } = useContext(AuthContext);

    const [file, setFile] = useState(user.profilePicture);

    //選択中の画像をエンコードしたデータ
    const [selectedImage, setSelectedImage] = useState(null);

    //圧縮後の画像サイズ（キロバイト）
    // const [resizedImageSize, setResizedImageSize] = useState(30);

    const handleImageChange = (event) => {
        const selectFile = event.target.files[0];
        const fileSizeInBytes = selectFile.size;
        const fileNameParts = selectFile.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase().toString();
        console.log("拡張子:", fileExtension);
        console.log("元ファイルのバイト数:", fileSizeInBytes, "bytes");
        if (selectFile.size < 50000) {
            if (selectFile) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    setSelectedImage(e.target.result);
                    setFile(selectFile); // ここでfileをセットする
                };
                reader.readAsDataURL(selectFile);//エンコードする
            }
        } else {
            // 取得した画像データが51キロバイト以上
            var resizedImageSize = 30;
            if (selectFile.size < 1000000) {
                // setResizedImageSize(40); // 圧縮後サイズ
                if (fileExtension === "webp") {
                    resizedImageSize = 15;
                } else {
                    resizedImageSize = 50;
                }
                console.log("圧縮後==>", resizedImageSize, "KB");
            } else if (selectFile.size < 3000000) {
                // setResizedImageSize(30); // 圧縮後サイズ
                if (fileExtension === "webp") {
                    resizedImageSize = 15;
                } else {
                    resizedImageSize = 30;
                }
                console.log("圧縮後==>", resizedImageSize, "KB");
            } else if (selectFile.size < 5000000) {
                // setResizedImageSize(20); // 圧縮後サイズ
                if (fileExtension === "webp") {
                    resizedImageSize = 15;
                } else {
                    resizedImageSize = 20;
                }
                console.log("圧縮後==>", resizedImageSize, "KB");
            } else {
                // setResizedImageSize(10); // 圧縮後サイズ
                resizedImageSize = 10;
                console.log("圧縮後==>", resizedImageSize, "KB");
            }
            Resizer.imageFileResizer(
                selectFile, // アップロードされたファイル
                300, // リサイズ後の幅
                300, // リサイズ後の高さ
                'JPEG', // フォーマット
                resizedImageSize, // 圧縮後のファイルサイズ（キロバイト）
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
                        // console.log("リサイズ", uri);
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

    const updateProfile = async (e) => {
        e.preventDefault();
        const profileData = new FormData();
        // const filename = Date.now() + file.name;

        const updatedUser = {
            userId: user._id,
            profilePicture: selectedImage,
            desc: editDesc.current.value,
            city: editCity.current.value,
            age: editAge.current.value,
        };

        console.log("onSubmitStart!!");
        if (file) {
            // profileData.append("name", filename);
            // profileData.append("file", file);
            profileData.append("imageBase64", selectedImage);
            profileData.append("userId", user._id);

            // console.log(selectedImage, "selectedImageエンコード済みのはず");
            updatedUser.img = selectedImage;


            try {
                const res = await axios.post('/upload', profileData);
                console.log(res);
            } catch (error) {
                console.error('Error!!! uploading image:', error);
                alert("予期せぬエラー：対象の画像データがアップロードできません。別の画像をアップロードしてください。\n※画像サイズを小さくするとアップロードができることがあります。");
            }
        }

        const res = await axios.get(`/users?username=${username}`);

        if (user._id === res.data._id) {
            //テキストの更新
            try {
                console.log("プロフィールとログイン者が同一人物");

                const updateResponse = await axios.put(`/users/${user._id}`, updatedUser);
                setNewText(updateResponse.data.desc);
                // console.log(updateResponse.data.profilePicture, "profile picture");

                //ローカルストレージ保管されてるログイン情報を変更する
                if (updateResponse.data.profilePicture === null || updateResponse.data.profilePicture === undefined) {
                    const newProfilePicture = user.profilePicture;
                    const newDesc = updateResponse.data.desc;
                    updateUser(newProfilePicture, newDesc);
                } else {
                    const newProfilePicture = updateResponse.data.profilePicture;
                    const newDesc = updateResponse.data.desc;
                    updateUser(newProfilePicture, newDesc);
                }

            } catch (err) {
                console.log(err.message, "リクエストの送信に失敗しました");
            }
        } else {
            console.log("プロフィールとログイン者が別人です");
        }

        handleEditBtn();
    };
    return (
        <div className="modal" >
            <form className="container" onSubmit={(e) => updateProfile(e)} encType="multipart/form-data">
                <div className="editProfilePicture">
                    <div className="editTitleWrapper">
                        <h3 className="editTitle">プロフィール写真</h3>
                        <label className="shareOption" htmlFor="profilePictureFile">
                            <div>
                                <span className="editButton">編集</span>
                                <input type="file"
                                    id="profilePictureFile"
                                    accept="*"
                                    style={{ display: "none" }}
                                    onChange={handleImageChange} />
                            </div>
                        </label>
                        {/* 選択中の画像をリアルタイムで表示 */}
                        <div className="selectImage">
                            {selectedImage && <img src={selectedImage} alt="Selected" />}
                        </div>
                    </div>
                    <img src="" alt="" />
                </div>
                <div className="editProfile">
                    <h3 className="editTitle">自己紹介</h3>
                    <div className="profile">
                        <textarea className="editInput textarea"
                            rows="10"
                            onChange={(e) => editTextState(e)}
                            ref={editDesc}
                            defaultValue={newText}></textarea>
                    </div>
                </div>
                <div className="editDetail">
                    <h3 className="editTitle">詳細</h3>
                    <div className="detail">
                        <div>住まい</div>
                        <input className="editInput"
                            type="text"
                            ref={editCity}
                            defaultValue={profileUser.city}
                        />
                    </div>
                    <div className="detail">
                        <div>年齢</div>
                        <input className="editInput"
                            type="text"
                            ref={editAge}
                            defaultValue={profileUser.age}
                        />
                    </div>
                </div>
                <div className="submitBtn">
                    <button onClick={() => handleEditBtn()}>キャンセル</button>
                    <button type="submit">更新</button>
                </div>
            </form>

        </div>
    );
};

export default EditProfile;