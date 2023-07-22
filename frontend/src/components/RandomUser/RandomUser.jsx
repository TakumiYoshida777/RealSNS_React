import React, { useContext } from 'react';
import { AuthContext } from '../../State/AuthContext';
import { Link } from 'react-router-dom';
import './RandomUser.css';

const RandomUser = ({ user, onClickMenu }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);
    const myFollowings = currentUser.followings;

    return (
        <>
            {currentUser._id !== user._id && !myFollowings.includes(user._id) &&
                <Link to={`/profile/${user.username}`} className="friendLink" onClick={() => onClickMenu()}>
                    <li className="sidebarFriend">
                        <img src={user.profilePicture !== "" && PUBLIC_FOLDER + user.profilePicture || PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className="sidebarFriendImg" />
                        <span className="sidebarFriendName">
                            {user.username}
                        </span>
                    </li>
                </Link>
            }
        </>

    );
};

export default RandomUser;;