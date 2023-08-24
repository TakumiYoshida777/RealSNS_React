import React from 'react';

const Online = ({ user }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    return (
        <li className="rightbarFriend">
            <div className="rightbarProfileImgContainer" >
                <img src={user.profilePicture} alt="" className="rihgtbarProfileImg" />
                <span className="rightbarOnline"></span>
            </div>
            <span className="rightbarUsername">
                {user.username}
            </span>
        </li>
    );
};

export default Online;