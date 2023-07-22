import React, { useContext, useEffect, useRef, useState } from 'react';
import './ModalComment.css';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';
import CommentList from '../CommentList/CommentList';
import { useLocation } from 'react-router-dom';

const ModalComment = ({ setOpenComment, openComment, post, setCommentLength, commentLength }) => {
    const comment = useRef();
    const { user } = useContext(AuthContext);
    //取得してきたコメント一覧
    const [commentListData, setCommentListData] = useState([]);
    const location = useLocation();

    //コメントを送信する
    const sendComment = async (e) => {
        e.preventDefault();
        const commentData = {
            targetPostId: post._id,
            comment: comment.current.value,
            commentUserName: user.username,
            commentUserProfilePicture: user.profilePicture,
            date: Date.now(),
        };

        try {
            await axios.put(`/posts/${post._id}/sendcomments`, commentData);
        } catch (error) {
            console.log(error, "コメントの送信リクエストに失敗しました。");
        }
        setCommentLength(commentLength + 1);
        setOpenComment(prevState => !prevState);
        if (location.pathname.includes('profile')) {
            //TODO:データ取得バグによりプロフィールからの送信時はリアルタイム通信ができないためリロードを挟む必要がある
            window.location.reload();
        }
    };

    //コメントを取得
    useEffect(() => {
        const getCommentList = async () => {

            try {
                const response = await axios.get(`posts/${post._id}/comments`);

                /*TODO:プロフィールから取得するとエラーになる　文字列が返ってくるため一旦回避するための対策として下記分岐を記述し渡ってきたデータから取得してる。
プロフィールから送信時にリロードする対策もしている*/
                if (typeof response.data === "string") {
                    setCommentLength(post.comment.length);
                    setCommentListData(post.comment.sort((post1, post2) => {
                        return new Date(post2.date) - new Date(post1.date);
                    }));
                } else {
                    setCommentLength(response.data.length);
                    setCommentListData(response.data.sort((post1, post2) => {
                        return new Date(post2.date) - new Date(post1.date);
                    }));
                }

            } catch (error) {
                console.log(error, "コメントの取得リクエストに失敗しました。");
            }
        };
        getCommentList();
    }, [openComment]);

    const reply = (commentData) => {
        comment.current.value = `@${commentData.commentUserName}さん:\n`;
    };

    return (
        <div className="ModalComment">
            <div className="modalHeader">
                <div className="close" onClick={() => setOpenComment(prevState => !prevState)}>close</div>
            </div>
            <div className="targetPost">
                {post.desc}
            </div>
            <hr />

            <form action="" className="comment" onSubmit={(e) => sendComment(e)}>
                <textarea className="textarea"
                    ref={comment}
                    placeholder="コメントを書いてください"></textarea>
                <button className="commentBtn" type="submit">送信</button>
            </form>
            <div className="commentList">
                {commentListData.map(data => <CommentList commentData={data} key={data.date} reply={reply} />)}

            </div>

        </div >
    );
};

export default ModalComment;