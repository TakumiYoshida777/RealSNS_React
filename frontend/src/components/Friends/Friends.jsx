import React, { useContext, useEffect } from 'react';
import { AuthContext } from '../../State/AuthContext';
import "./Friends.css";

const Friends = () => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <>
            <h4 className="rightbarTitle">あなたの友達</h4>
            <div className="rightbarFollowings">
                <div className="rightbarFollowing">
                    <img src={"/person/1.jpeg"} alt="" className="rightbarFollowingImg" />
                    <span className="rightbarFollowingName">takumi</span>
                </div>

                {/* <div className="rightbarFollowing">
                            <img src={"/person/2.jpeg"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">tanaka</span>
                        </div>
                        <div className="rightbarFollowing">
                            <img src={"/person/3.jpeg"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">yamaki</span>
                        </div>
                        <div className="rightbarFollowing">
                            <img src={"/person/4.jpeg"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">sato</span>
                        </div>
                        <div className="rightbarFollowing">
                            <img src={"/person/5.jpeg"} alt="" className="rightbarFollowingImg" />
                            <span className="rightbarFollowingName">kikukawa</span>
                        </div> */}
            </div>
        </>
    );
};

export default Friends;