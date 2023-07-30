import React, { useContext, useEffect, useRef, useState } from 'react';
import './EditProfile.css';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const EditProfile = ({ handleEditBtn, editTextState, newText, setNewText, profileUser }) => {
    const { user } = useContext(AuthContext);
    const editDesc = useRef();
    const editCity = useRef();
    const editAge = useRef();
    const username = useParams().username;
    const [file, setFile] = useState(user.profilePicture);
    const { updateUser } = useContext(AuthContext);

    const updateProfile = async (e) => {
        e.preventDefault();
        const profileData = new FormData();
        const filename = Date.now() + file.name;
        const updatedUser = {
            userId: user._id,
            profilePicture: filename ? filename : profileUser.profilePicture,
            desc: editDesc.current.value,
            city: editCity.current.value,
            age: editAge.current.value,
        };

        console.log("onSubmitStart!!");
        if (file) {
            profileData.append("name", filename);
            profileData.append("file", file);
            updatedUser.img = filename;
            // console.log("name", filename);
            // console.log("file", file);
            // console.log(updatedUser.img = filename);
            try {
                //画像APIを叩く
                await axios.post("/upload", profileData);
            } catch (err) {
                console.log("画像のuploadに失敗しました", err);
            }
        }

        const res = await axios.get(`/users?username=${username}`);

        if (user._id === res.data._id) {
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
            <form className="container" onSubmit={(e) => updateProfile(e)}>
                <div className="editProfilePicture">
                    <div className="editTitleWrapper">
                        <h3 className="editTitle">プロフィール写真</h3>
                        <label className="shareOption" htmlFor="profilePictureFile">
                            <span className="editButton">編集</span>
                            <input type="file"
                                id="profilePictureFile"
                                accept=".png, .jpg,.jpeg, .webp"
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])} />
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