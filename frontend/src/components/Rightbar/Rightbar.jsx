/**
 * 親コンポーネント
 *      Home
 *      Profile   
 */

import React, { useEffect } from 'react';
import "./Rightbar.css";
import Follows from '../Follows/Follows';
import Followers from '../Followers/Followers';

const Rightbar = ({ profileUser, userFollowers, userFollowings }) => {

    const HomeRightbar = () => {

        return (
            <>
                <div className="iventContainer">
                    <img src="assets/star.png" alt="" className="starImg" />
                    <span className="evenText">
                        <b>フォロワー限定</b>イベント開催中！
                    </span>
                </div>
                <img src="./assets/event.jpeg" alt="" className="eventImg" />
                {/* <h4 className="rightbarTitle">オンラインの友達</h4>
                <ul className="rightbarFriendList">
                    {Users.map((user) => (
                        <Online user={user} key={user.id} />
                    ))}
                </ul> */}
                <p className="promotionTitle">
                    プロモーション広告
                </p>
                <img src="assets/promotion/promotion1.jpeg" alt="" className="rightbarPromotionImg" />
                <p className="promotionName">ショッピング</p>
                <img src="assets/promotion/promotion2.jpeg" alt="" className="rightbarPromotionImg" />
                <p className="promotionName">カーショップ</p>
                <img src="assets/promotion/promotion3.jpeg" alt="" className="rightbarPromotionImg" />
                <p className="promotionName">Takumi株式会社</p>
            </>
        );
    };

    const ProfileRightbar = () => {
        return (
            <div className="ProfileRightbarContainer">
                <h4 className="rightbarTitle">
                    ユーザー情報
                </h4>
                <div className="rightbarInfo">
                    <div className="rightbarInfoItem">
                        <div className="followArea">
                            <div>フォロー数：{userFollowings.length}</div>
                            <div>フォロワー数：{userFollowers.length}</div>
                        </div>
                        <div>
                            <span className="rightbarInfoKey">住まい：</span>
                            <span className="rightbarInfoKey">{profileUser.city}</span>
                        </div>
                        <div>
                            <span className="rightbarInfoKey">年齢：</span>
                            <span className="rightbarInfoKey">{profileUser.age ? profileUser.age : "未設定"}</span>
                        </div>
                    </div>
                    <h3>フォローした人</h3>
                    <Follows profileUser={profileUser} />
                    <h3>フォローされた人</h3>
                    <Followers profileUser={profileUser}
                        userFollowers={userFollowers} />
                    {/* <Friends /> */}
                </div>
            </div>
        );
    };

    return (
        <div className="rightbar">
            <div className="rightbarWrapper">
                {profileUser ? <ProfileRightbar /> : <HomeRightbar />}
            </div>
        </div>
    );
};

export default Rightbar;;