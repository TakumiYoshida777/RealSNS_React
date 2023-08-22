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
    const [file, setFile] = useState(user.profilePicture);
    const { updateUser } = useContext(AuthContext);

    //選択中の画像をエンコードしたデータ
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
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
                    setSelectedImage(uri);
                    setFile(uri); // ここでfileをセットする
                }
            },
            'base64' // データURIの形式
        );
        // if (file) {
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //         setSelectedImage(e.target.result);
        //         setFile(file); // ここでfileをセットする
        //     };
        //     reader.readAsDataURL(file);//エンコードする
        // }
    };

    const updateProfile = async (e) => {
        e.preventDefault();
        const profileData = new FormData();
        // const filename = Date.now() + file.name;

        const updatedUser = {
            userId: user._id,
            // profilePicture: filename ? filename : profileUser.profilePicture,
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

            console.log(selectedImage, "selectedImageエンコード済みのはず");
            updatedUser.img = selectedImage;
            // updatedUser.img = filename;

            // const reader = new FileReader();
            // reader.onload = (e) => {
            //     setSelectedImage(e.target.result);
            // };
            // reader.readAsDataURL(file);
            // try {
            //     //画像APIを叩く
            //     const res = await axios.post("/upload", profileData);
            //     console.log(res, "画像データ");
            // } catch (err) {
            //     console.log("画像のuploadに失敗しました", err);
            // }

            try {
                const res = await axios.post('/upload', profileData);
                console.log(res);
            } catch (error) {
                console.error('Error!!! uploading image:', error);
            }
        }

        const res = await axios.get(`/users?username=${username}`);

        if (user._id === res.data._id) {
            //テキストの更新
            try {
                console.log("プロフィールとログイン者が同一人物");

                const updateResponse = await axios.put(`/users/${user._id}`, updatedUser);
                setNewText(updateResponse.data.desc);
                console.log(updateResponse.data.profilePicture, "profile picture");

                //ローカルストレージ保管されてるログイン情報を変更する
                const newProfilePicture = updateResponse.data.profilePicture;
                const newDesc = updateResponse.data.desc;
                updateUser(newProfilePicture, newDesc);
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
                            <span className="editButton">編集</span>
                            <input type="file"
                                id="profilePictureFile"
                                accept="*"
                                style={{ display: "none" }}
                                onChange={handleImageChange} />
                            {/* TODO:テスト */}
                            <div className="selectImage">
                                {selectedImage && <img src={selectedImage} alt="Selected" />}
                            </div>
                            {/* テストここまで */}
                        </label>
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