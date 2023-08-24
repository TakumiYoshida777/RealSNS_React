import React, { useContext, useEffect, useState } from 'react';
import './CommentList.css';
import { Link } from 'react-router-dom';

const CommentList = ({ commentData, reply }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    return (
        <div className="commentCard">
            <Link to={`/profile/${commentData.commentUserName}`}>
                <img src={commentData.commentUserProfilePicture} className="senderPicture" />
            </Link>
            <div className="commentWrap" onClick={() => reply(commentData)}>
                <div className="commentUserName">@ {commentData.commentUserName}</div>
                <hr />
                <div>{commentData.comment}</div>
            </div>
        </div>

    );
};

export default CommentList;