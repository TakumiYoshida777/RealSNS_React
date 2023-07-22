import React, { useState } from 'react';
import './ModalFollows.css';
import Follows from '../Follows/Follows';
import Followers from '../Followers/Followers';

const ModalFollows = ({ setProfileModal, targetFollow, user, userFollowers }) => {
    //初期表示で使用　trueがわたって着たらなフォローしている人を表示
    const [isFollowing, setFollow] = useState(targetFollow);
    return (
        <div className="modal">
            <div className="modalHeader">
                <div className="close" onClick={() => setProfileModal(prevState => !prevState)}>close</div>
                <div className="followWrap">
                    <div className="followTitleWrap">
                        <h3
                            className={isFollowing ? 'followTitle active' : 'followTitle'}
                            onClick={() => setFollow(true)}
                        >
                            フォローしてる人
                        </h3>
                        <h3
                            className={!isFollowing ? 'followTitle active' : 'followTitle'}
                            onClick={() => setFollow(false)}
                        >
                            フォローされた人
                        </h3>
                    </div>
                    {isFollowing
                        ? <Follows profileUser={user} />
                        : <Followers profileUser={user}
                            userFollowers={userFollowers} />}
                </div>

            </div>
        </div>
    );
};

export default ModalFollows;