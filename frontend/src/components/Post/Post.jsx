/**
 * 親コンポーネント
 *      Timeline post
 *       
 */
import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Post.css";
import { MoreVert } from '@mui/icons-material';
import axios from 'axios';
import { format } from 'timeago.js';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../State/AuthContext';
import PostMoreMenu from '../PostMoreMenu/PostMoreMenu';
import ModalComment from '../ModalComment/ModalComment';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkAddedIcon from '@mui/icons-material/BookmarkAdded';

const Post = ({ post, setPostCatch }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);

    //いいねの数を取得
    const [like, setLike] = useState(post.likes.length);
    //コメントの数
    const [commentLength, setCommentLength] = useState(post.comment.length);

    const [isLiked, setIsLiked] = useState(false);
    // const [isLiked, setIsLiked] = useState(true);
    const [user, setUser] = useState({});
    const [moreMenu, setMoreMenu] = useState(false);
    const [edit, setEdit] = useState(false);
    const [openComment, setOpenComment] = useState(false);
    const [bookmark, setBookmark] = useState(false);

    const editText = useRef();
    useEffect(() => {
        const fhechUser = async () => {
            //ユーザーデータを取得
            const response = await axios.get(`/users?userId=${post.userId}`);
            setUser(response.data);
        };
        fhechUser();
    }, [post.userId]);

    //お気に入り登録済みの投稿はブックマーク済みのアイコンを表示
    useEffect(() => {
        if (post.bookmarks.includes(currentUser._id)) {
            setBookmark(true);
        }
    }, []);

    const handleLike = async () => {
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
        try {
            /*TODO:
            バグ
            再現方法
            いいねを押していない投稿にいいねを押す
            リロードした後、先ほど既に自分でいいねをしている投稿に、再度いいねを押すと、
            いいねが追加されてしまう。（画面上の表示のみ）→想定している結果は１減算される
            ※サーバー側の処理は問題ない。＋ＤＢの動きも問題ない。
            問題ない証拠に、もう一度リロードをすると正しく１減産されている。
            原因：isLikedをstateで管理しているため、リロードするとデフォルト値が初期値のfalseになるため、falseだったら＋１の処理があたり、１加算される表示となる。
            実際は１減産されている
            */
            //いいねのAPIを叩く
            const response = await axios.put(`/posts/${post._id}/like`, { userId: currentUser._id });
            if (response.data === true) {
                setIsLiked(response.data);
            }
            // debugger;
            // setIsLiked(response.data);
            // console.log("-----------------------");
            // console.log(response.data, "response");
            // console.log(isLiked, "isLiked");
            // console.log("-----------------------");
        } catch (err) {
            console.log(err);
        }
    };

    //編集・削除メニューの表示
    const moreVert = () => {
        setMoreMenu(!moreMenu);
    };

    const closeMenu = () => {
        if (moreMenu) {
            setMoreMenu(false);
        }
    };
    /**
     * 投稿を編集する処理
     */
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const edit = {
            userId: currentUser._id,
            desc: editText.current.value
        };
        try {
            //編集のAPIを叩く
            await axios.put(`/posts/${post._id}`, edit);
        } catch (err) {
            console.log(err);
        }
        setPostCatch(postCatch => !postCatch);
        setEdit(false);
    };

    //投稿を削除する処理
    const handleDeleteSubmit = async () => {
        const res = window.confirm("本当に削除しますか？");
        if (res === true) {
            try {
                //削除のAPIを叩く
                // await axios.delete(`/posts/${post._id}`, deletePost);
                await axios.delete(`/posts/${post._id}/delete`, { data: { userId: user._id } });
                setPostCatch(postCatch => !postCatch);
            } catch (err) {
                console.log(err);
            }
        } else {
            return;
        }
    };

    //投稿のお気に入り登録
    const onBookmarkBtn = async () => {
        try {
            await axios.put(`/posts/${post._id}/bookmark`, { userId: currentUser._id });
            setBookmark(true);
        } catch (err) {
            console.log(err, "お気に入り登録のリクエストに失敗しました");
        }
    };

    // お気に入りを解除
    const onUnBookmarkBtn = async () => {
        try {
            await axios.put(`/posts/${post._id}/unbookmark`, { userId: currentUser._id });
            setBookmark(false);
        } catch (err) {
            console.log(err, "お気に入り解除のリクエストに失敗しました");
        }
    };
    return (
        <div className="post" onClick={() => closeMenu()}>
            {openComment && <ModalComment
                setOpenComment={setOpenComment}
                openComment={openComment}
                post={post}
                setCommentLength={setCommentLength}
                commentLength={commentLength} />}
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img src={
                                user.profilePicture} alt="" className="postProfileImg" />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRigtht">
                        <form>
                            {moreMenu && currentUser._id === user._id && < PostMoreMenu
                                setEdit={setEdit}
                                handleDeleteSubmit={handleDeleteSubmit}
                            />}
                            <div className="bookmarkBtn">
                                {bookmark
                                    ? <BookmarkAddedIcon onClick={() => onUnBookmarkBtn()} />
                                    : <BookmarkBorderIcon onClick={() => onBookmarkBtn()} />}
                            </div>
                            {currentUser._id === user._id &&
                                <div className="moreVert" onClick={() => moreVert()}>
                                    <MoreVert />
                                </div>
                            }
                        </form>
                    </div>
                </div>
                <div className="postCenter">
                    <div className="postText">
                        {post.desc}
                    </div>
                    {edit &&
                        <form className="postEdit"
                            onSubmit={(e) => handleEditSubmit(e)}>
                            <input type="text"
                                className="postEditErea"
                                placeholder="編集してください"
                                ref={editText} />
                            <button className="updateBtn" type="submit">更新</button>
                        </form>
                    }

                    <img src={post.img} alt="" className="postImg" />
                </div>
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img src={PUBLIC_FOLDER + "/heart.png"} alt="" className="likeIcon" onClick={() => handleLike()} />
                        <span className="postLikeCounter">
                            {like}人がいいねを押しました
                        </span>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText" onClick={() => setOpenComment(prevState => !prevState)}>
                            コメント: {commentLength}件
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Post;