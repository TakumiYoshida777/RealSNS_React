/**
 * 親コンポーネント
 *      Rightbar
 * props
 *      profileUser:プロフィールのユーザーデータ
 *      userFollowers:
 */

import React, { useEffect, useState } from 'react';
import './Followers.css';
import axios from 'axios';

const Followers = ({ profileUser, userFollowers }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    const [follower, setFollower] = useState([]);
    const followers = userFollowers;

    useEffect(() => {
        // フォローされた全てのUserDataを取得
        const getFollowersUserData = async () => {
            try {
                const res = await axios.get(`/users/${profileUser._id}/${followers}`);
                if (Array.isArray(res.data)) {
                    setFollower(res.data);
                } else {
                    setFollower([]);
                }
            } catch (error) {
                console.log(error, "フォロー中のユーザーデータの取得リクエストの送信に失敗しました");
            }
        };
        getFollowersUserData();
    }, [followers]);

    const screenTransitionProfile = (path) => {
        window.location.href = `/profile/${path}`;
    };
    return (
        <div className="followerWrap">
            {
                follower.map((user) => {
                    return (
                        <div key={user._id} className="follower">
                            <div className="followUser" onClick={() => screenTransitionProfile(user.username)}>
                                <img src={
                                    user.profilePicture === "" || !user.profilePicture
                                        ? "/person/noAvatar.png"
                                        : user.profilePicture
                                } alt="" className="followerImg" />
                                <h4 className="username">{user.username}</h4>
                            </div>
                        </div>

                    );
                })
            }
        </div>
    );
};

export default Followers;