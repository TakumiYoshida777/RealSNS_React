import React, { useEffect, useState } from 'react';
import "./Follows.css";
import axios from 'axios';
const Follows = ({ profileUser }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    const [follows, setFollows] = useState([]);

    const followings = profileUser.followings;

    useEffect(() => {

        // フォローした人全てのUserDataを取得
        const getFollowingsUserData = async () => {
            try {
                const res = await axios.get(`/users/${profileUser._id}/${followings}`);
                if (Array.isArray(res.data)) {
                    setFollows(res.data);
                } else {
                    setFollows([]);
                }
            } catch (error) {
                console.log(error, "フォロー中のユーザーデータの取得リクエストの送信に失敗しました");
            }
        };
        getFollowingsUserData();

    }, []);

    const screenTransitionProfile = (path) => {
        window.location.href = `/profile/${path}`;
    };

    return (
        <div className="followerWrap">
            {
                follows.map((user) => {
                    return (
                        <div key={user._id} className="follower">
                            <div className="followUser" onClick={() => screenTransitionProfile(user.username)}>
                                {/* <img src={PUBLIC_FOLDER + user.profilePicture !== "" && PUBLIC_FOLDER + user.profilePicture || PUBLIC_FOLDER + "/person/noAvatar.png"
                                } alt="" className="followerImg" /> */}

                                <img
                                    src={
                                        user.profilePicture === "" || !user.profilePicture
                                            ? PUBLIC_FOLDER + "/person/noAvatar.png"
                                            : PUBLIC_FOLDER + user.profilePicture
                                    }
                                    alt=""
                                    className="followerImg"
                                />
                                <h4 className="username">{user.username}</h4>
                            </div>
                        </div>

                    );
                })
            }
        </div>
    );
};

export default Follows;