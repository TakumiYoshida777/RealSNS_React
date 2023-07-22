import React, { useContext, useEffect, useState } from 'react';
import "./Timeline.css";
import Share from '../Share/Share';
import Post from '../Post/Post';
import axios from 'axios';
import { AuthContext } from '../../State/AuthContext';
import { removeDuplicatesById } from '../../common/array';

const Timeline = ({ username }) => {
    //表示している全ての投稿を保持
    const [posts, setPosts] = useState([]);

    const { user } = useContext(AuthContext);
    const [postCatch, setPostCatch] = useState(false);//メッセージが届いたらステートを変更する

    //取得する投稿数
    const initialGetPosts = 20;
    const [endPostCount, setEndPostCount] = useState(initialGetPosts);

    useEffect(() => {
        const fhechPosts = async () => {

            const response = username
                ? await axios.get(`/posts/profile/${username}/${endPostCount}/${initialGetPosts}`)//プロフィールの場合
                : await axios.get(`/posts/timeline/${user._id}/${endPostCount}/${initialGetPosts}`);//ホームの場合
            const getPosts = response.data.sort((post1, post2) => {
                return new Date(post2.createdAt) - new Date(post1.createdAt);
            });
            if (endPostCount <= initialGetPosts) {
                //初回読み込みだったら
                setPosts(getPosts);
            } else {
                //２回目以降の読み込みだったら新しく取得したpostデータを追加して新しい配列として渡す
                const newPosts = [...posts, ...getPosts];

                //重複したIDは削除
                setPosts(removeDuplicatesById(newPosts));
            }
        };
        fhechPosts();

    }, [username, user._id, postCatch, endPostCount]);


    //新着投稿が届いた場合
    //TODO:共通化したい
    useEffect(() => {
        const socket = new WebSocket('ws://localhost:5000'); // WebSocketサーバーのURLに適宜変更する

        socket.onmessage = (event) => {
            const newPostData = JSON.parse(event.data);
            if (user.followings.includes(newPostData.userId) || newPostData.userId === user._id) {
                //新着の投稿が届いたらステートに変更を加える　useEffectがそれをキャッチして再度受信データを取得、ステートを更新してリアルタイムでレンダリング
                setPostCatch((prevState) => !prevState);
            }
        };

        // コンポーネントのクリーンアップ時にWebSocket接続を閉じる
        return () => {
            socket.close();
        };
    }, []);

    const onPagination = () => {
        setEndPostCount(prevState => prevState + initialGetPosts);
    };
    return (
        <div className="timeline">
            <div className="timelineWrrapper">
                <Share
                    setPostCatch={setPostCatch}
                    postCatch={postCatch} />
                <>
                    {posts.length === 0
                        ? <div className="infoMessage">現在閲覧可能な投稿がありません。</div>
                        : <>
                            {posts.map((post) => (
                                <Post post={post} key={post._id}
                                    setPostCatch={setPostCatch}
                                    postCatch={postCatch}
                                />
                            ))}</>}
                </>

            </div>
            {/* ページネーション */}
            <div className="pagination">
                <div></div>
                <button className="next" onClick={() => onPagination()}>
                    {posts.length >= endPostCount ? <>{`次の${initialGetPosts}件`}</> : ''}
                </button>
            </div>
        </div>
    );
};

export default Timeline;