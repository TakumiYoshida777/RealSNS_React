import React, { useContext, useEffect, useState } from 'react';
import Hamburger from '../../components/Hamburger/Hamburger';
import Topbar from '../../components/Topbar/Topbar';
import Timeline from '../../components/Timeline/Timeline';
import Rightbar from '../../components/Rightbar/Rightbar';
import "./Profile.css";
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../State/AuthContext';
import EditProfile from '../editProfile/EditProfile';
import Message from '../message/Message';
import { useMediaQuery } from 'react-responsive';
import ModalFollows from '../../components/ModalFollows/ModalFollows';
import { filterDuplicatesById } from '../../common/array';
import Resizer from "react-image-file-resizer";

const Profile = () => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    //ログインユーザー情報
    const { user: currentUser } = useContext(AuthContext);
    const username = useParams().username;
    //プロフィールの対象ユーザー情報を保持
    const [user, setUser] = useState({});
    //ボタンの切り替え
    const [followState, setFollowState] = useState(false);
    //ユーザーのフォロワーを配列で保持
    const [userFollowers, setUserFollowers] = useState([]);
    //ユーザーのフォローした人をを配列で保持
    const [userFollowings, setUserFollowings] = useState([]);
    //編集modal表示toggle
    const [editState, setEditState] = useState(false);
    //編集　自己紹介文
    const [newText, setNewText] = useState(currentUser.desc);
    //選択中の画像パス
    const [file, setFile] = useState(user.coverPicture);
    //選択中の画像をエンコードしたデータ
    const [selectedImage, setSelectedImage] = useState(null);


    //プロフィールモーダルのトグル
    const [profileModal, setProfileModal] = useState(false);
    const [targetFollow, setTargetFollow] = useState("");
    //カバー画像変更ボタンの状態
    const [coverImgBtn, setCoverImgBtn] = useState(false);

    //メッセージのモーダルの表示制御
    const [messageAreaState, setMessageAreaState] = useState(false);

    //圧縮後の画像サイズ（キロバイト）
    // const [resizedImageSize, setResizedImageSize] = useState(30);

    const params = useParams();

    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    useEffect(() => {
        //プロフィールの表示対象のユーザー情報を取得
        const fhechUser = async () => {
            const response = await axios.get(`/users?username=${username}`);
            setUser(response.data);
            // ユーザー情報の取得後にフォロー済みかチェック
            if (response.data.followers.includes(currentUser._id)) {
                setFollowState(true);
            } else {
                setFollowState(false);
            }
            //ユーザーのフォローリスト
            setUserFollowings(response.data.followings);
            //ユーザーのフォロワーリスト
            setUserFollowers(response.data.followers);
        };

        fhechUser();
    }, [params]);
    // console.log(`/users/${user._id}/follow`);

    //フォローボタンの押下処理
    const handleFollow = async (e) => {
        e.preventDefault();

        const currentUserId = {
            userId: currentUser._id
        };

        try {
            await axios.put(`/users/${user._id}/follow`, currentUserId);
        } catch (error) {
            console.log(error.message, "リクエストに失敗しました");
        };

        //配列に自分のuserIdを追加
        setUserFollowers([...userFollowers, currentUser._id]);

        setFollowState(true);
        /**
         * ローカルストレージのユーザー情報を更新
         */
        //ローカルストレージに格納されているログイン中のユーザー情報を取得
        const localStorageUserData = await JSON.parse(localStorage.getItem('user'));
        //follow対象（閲覧しているプロフィール）のユーザーIDwo
        const followUserId = user._id;
        //自分のフォロワーに対象のユーザーIDを追加
        localStorageUserData.followings = [...localStorageUserData.followings, followUserId];
        const updatedUser = JSON.stringify(localStorageUserData);
        await localStorage.setItem('user', updatedUser);
    };
    //フォロー解除ボタンの押下処理
    const handleUnFollow = async (e) => {
        e.preventDefault();


        const currentUserId = {
            userId: currentUser._id
        };
        try {
            await axios.put(`/users/${user._id}/unfollow`, currentUserId);
        } catch (error) {
            console.log(error.message, "リクエストに失敗しました");
        }
        setUserFollowers(filterDuplicatesById(userFollowers, currentUser._id));
        /**
         * ローカルストレージのユーザー情報を更新
         */
        //ローカルストレージに格納されているログイン中のユーザー情報を取得
        const localStorageUserData = await JSON.parse(localStorage.getItem('user'));
        //follow対象（閲覧しているプロフィール）のユーザーIDwo
        const followUserId = user._id;
        // followings内のfollowUserIdに該当する要素を除外
        localStorageUserData.followings = localStorageUserData.followings
            .filter(id => id !== followUserId);

        const updatedUser = JSON.stringify(localStorageUserData);
        await localStorage.setItem('user', updatedUser);
        setFollowState(false);
    };

    //編集/キャンセルボタン/更新ボタン　押下
    const handleEditBtn = () => {
        setEditState(prevState => prevState = !prevState);
        if (!editState) {
            setNewText(user.desc);
        }
    };

    const editTextState = (e) => {
        if (e) {
            const newText = e.target.value;
            setNewText(newText);
        } else {
            return;
        }
    };

    //カバー画像の変更ボタン押下時
    const onclickCoverImgBtn = (val) => {
        if (val == "change") {
            setCoverImgBtn(true);
        }
        if (val === "register") {
            setCoverImgBtn(false);
        }
        if (coverImgBtn) {
            updateCoverImg();
        }
    };

    /**
     * 選択された背景画像をリサイズする
     * @param {*} event 
     */
    const handleImageChange = (event) => {
        const selectFile = event.target.files[0];
        const fileSizeInBytes = selectFile.size;
        const fileNameParts = selectFile.name.split('.');
        const fileExtension = fileNameParts[fileNameParts.length - 1].toLowerCase().toString();
        console.log("拡張子:", fileExtension);
        console.log("元ファイルのバイト数:", fileSizeInBytes, "bytes");
        if (fileSizeInBytes < 50000) {
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
                    resizedImageSize = 40;
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
                1000, // リサイズ後の幅
                700, // リサイズ後の高さ
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
    // console.log("圧縮後【外】==>", resizedImageSize, "KB");

    //背景画像を更新する
    const updateCoverImg = async () => {

        if (file) {
            const profileData = new FormData();
            const filename = Date.now() + file.name;
            const updatedUser = {
                userId: currentUser._id,
                coverPicture: selectedImage,
            };
            profileData.append("imageBase64", selectedImage);
            // profileData.append("name", filename);
            // profileData.append("file", file);
            updatedUser.img = filename;
            try {
                //画像APIを叩く
                await axios.post("/upload/cover", profileData);
            } catch (err) {
                console.log(err);
            }
            const res = await axios.get(`/users?username=${username}`);

            if (user._id === res.data._id) {
                // console.log("プロフィールとログイン者が同一人物");
                try {
                    const updateResponse = await axios.put(`/users/${user._id}`, updatedUser);
                    setNewText(updateResponse.data.desc);

                } catch (err) {
                    console.log(err.message, "リクエストの送信に失敗しました");
                }
            } else {
                console.log("プロフィールとログイン者が別人です");
            }
        } else {
            if (coverImgBtn) {
                alert("画像ファイルが選択されませんでした");
            } else {
                return;
            }

            return;
        }


        window.location.reload();
    };

    const openFollowModal = (targetBool) => {
        setProfileModal(prevState => !prevState);
        setTargetFollow(targetBool);
    };
    // console.log(user);
    // console.log(user.profilePicture, "プロフィール画像");
    return (
        <>
            <Topbar />
            <div className="Profile">
                <Hamburger />
                {profileModal && <ModalFollows
                    setProfileModal={setProfileModal}
                    targetFollow={targetFollow}
                    user={user}
                    userFollowers={userFollowers} />}

                <div className="profileRight">
                    <div className="profileRightTop">
                        {/* 表示画像 */}
                        <div className="profileCover">
                            <img src={user.coverPicture
                                ? user.coverPicture
                                : PUBLIC_FOLDER + "post/3.jpeg"} alt=""
                                className="profileCoverImg" />
                            {/* <img src={user.profilePicture !== "" && user.profilePicture || "/person/noAvatar.png"
                            } alt="" className="profileUserImg" /> */}

                            {/* <img src={`data:image/jpeg;base64,${user.profilePicture}`} alt="Profile" /> */}

                            {/* エンコードした画像を取得し表示 */}

                            <img src={user.profilePicture
                                ? user.profilePicture
                                : PUBLIC_FOLDER + "person/noAvatar.png"} alt="Profile" className="profileUserImg" />


                            {currentUser._id === user._id && (
                                <>
                                    <label className="shareOption" htmlFor="coverPictureFile">
                                        <span className="profileCoverEditBtn editBtn"
                                            onClick={() => onclickCoverImgBtn("change")}>カバー画像の変更</span>
                                        <input type="file"
                                            id="coverPictureFile"
                                            accept=".png, .jpg,.jpeg, .webp"
                                            style={{ display: "none" }}
                                            onChange={handleImageChange} />
                                    </label>
                                    {coverImgBtn && <span className="profileCoverRegisterBtn editBtn "
                                        style={{ backgroundColor: " rgb(207, 147, 147)" }}
                                        onClick={() => onclickCoverImgBtn("register")}>カバー画像を登録</span>}
                                </>
                            )
                            }

                        </div>
                        <div className="profileInfo">
                            <h4 className="profileInfoName">{user.username}</h4>
                            {!editState &&
                                <span className="profileInfoDesc">{user.desc}</span>
                            }
                            <span>{editState && newText}</span>
                            {user._id === currentUser._id &&
                                <button onClick={() => handleEditBtn()}>
                                    {!editState && <span className="editBtn">編集</span>}
                                </button>
                            }
                            {editState &&
                                <>
                                    <EditProfile
                                        handleEditBtn={handleEditBtn}
                                        editTextState={editTextState}
                                        newText={newText}
                                        setNewText={setNewText}
                                        profileUser={user}
                                    />
                                </>
                            }

                            {user._id !== currentUser._id
                                && <>
                                    {followState
                                        ?
                                        <div className="followStateWrap">
                                            <button className="sendMessageBtn" onClick={() => setMessageAreaState(prevState => !prevState)}>メッセージを送る</button>
                                            <button className="followBtn"
                                                style={{ backgroundColor: "rgb(207, 147, 147)" }}
                                                onClick={(e) => handleUnFollow(e)}>フォロー解除</button>
                                        </div>
                                        : <button className="followBtn" onClick={(e) => handleFollow(e)}>フォローする</button>}
                                </>
                            }
                            {messageAreaState && <Message
                                setMessageAreaState={setMessageAreaState}
                                messageAreaState={messageAreaState}
                                profileUser={user} />}
                        </div>
                        {isMobile &&
                            <div className="profileFlexWrap">
                                <div className="followsWrap">
                                    <div className="follow"
                                        onClick={() => openFollowModal(true)}>
                                        <span>フォロー数</span> {userFollowings.length}
                                    </div>
                                    <div className="followers"
                                        onClick={() => openFollowModal(false)}>
                                        <span>フォロワー数</span> {userFollowers.length}
                                    </div>
                                </div>
                                <div className="profileWrap">
                                    <div>
                                        <span className="rightbarInfoKey">住まい：</span>
                                        <span className="rightbarInfoKey">{user.city}</span>
                                    </div>
                                    <div>
                                        <span className="rightbarInfoKey">年齢：</span>
                                        <span className="rightbarInfoKey">{user.age ? user.age : "未設定"}</span>
                                    </div>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="profileRightBottom">
                        <Timeline username={username} />
                        {!isMobile && <Rightbar
                            profileUser={user}
                            userFollowers={userFollowers}
                            userFollowings={userFollowings} />}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Profile;