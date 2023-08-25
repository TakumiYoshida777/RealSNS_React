import React, { useContext, useEffect, useRef, useState } from 'react';
import "./Topbar.css";
import { Chat, Co2Sharp, Notifications, Search } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';
import SearchResult from '../SearchResult/SearchResult';
import { useLocation } from "react-router-dom";

const Topbar = ({ openFilterMessage }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;

    const { user } = useContext(AuthContext);
    const searchText = useRef();
    const [searchResult, setSearchResult] = useState([]);
    const [unReadessages, setUnreadMessages] = useState([]);
    const [onTimeMessage, setOnTimeMessage] = useState({});

    const [searchResultList, setSearchResultList] = useState(false);

    const location = useLocation();
    const currentURL = location.pathname;
    useEffect(() => {

        //未読のメッセージだけ取り出す
        const getMessages = async () => {
            try {
                const response = await axios.get(`/messages/${user._id}/read`);
                setUnreadMessages(response.data.filter(item => !item.read && item.userId !== user._id));

            } catch (error) {
                console.log(error, "未読のメッセージ取得リクエストに失敗しました。");
            }
        };
        getMessages();
    }, [onTimeMessage, openFilterMessage]);

    /** TODO:共通化したい */

    //メッセージが届いたらアラートを出してトップバーの新着メッセージ数を更新する
    useEffect(() => {
        // const socket = new WebSocket('ws://localhost:5000'); // WebSocketサーバーのURLに適宜変更する
        const socket = new WebSocket('wss://real-sns-app-66036cba7bab.herokuapp.com'); // WebSocketサーバーのURLに適宜変更する

        socket.onmessage = (event) => {
            const newMessageData = JSON.parse(event.data);
            if (newMessageData.userId !== user._id && newMessageData.recipientId === user._id) {
                setOnTimeMessage(newMessageData);
                if (!currentURL.includes("message")) {
                    alert("新しいメッセージが届きました");
                }
            }
        };

        // コンポーネントのクリーンアップ時にWebSocket接続を閉じる
        return () => {
            socket.close();
        };
    }, []);
    /** TODO:共通化したい END*/

    /**
     * 検索機能
     * @param {*} e
     *          入力フォームのイベント 
     */
    const handleSearch = async (e) => {
        e.preventDefault();

        console.log(searchText.current.value, "Search value");
        if (searchText.current.value === "") {
            alert("検索したいユーザー名を入力してください");
        } else {
            try {
                //入力された値で部分一致検索をしてヒットしたユーザー情報を取得
                const result = await axios.get(`/search/${searchText.current.value}`);
                setSearchResult(result);
                setSearchResultList(true);
            } catch (error) {
                console.log(error, "検索リクエストに失敗しました。");
            }
        }

    };
    return (
        <div className="topbarContainer">
            <div className="topbarLeft">
                <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                    <span className="logo">Real SNS</span>
                </Link>
            </div>
            <div className="topbarCenter">
                <form className="searchbar" onSubmit={(e) => handleSearch(e)}>
                    <button type="submit">
                        <Search className="searchIcon" />
                    </button>
                    <input type="text"
                        className="searchInput"
                        placeholder="search user"
                        ref={searchText}
                    />
                </form>
                {searchResultList && <SearchResult searchResult={searchResult} setSearchResultList={setSearchResultList} searchText={searchText} />}
            </div>
            <div className="topbarRight">
                <div className="topbarItemIcons">
                    <Link to={`/mymessage/${user.username}`} className="topbarIconItem">
                        <Chat />
                        {unReadessages.length > 0 && <span className="topbarIconBadge">{unReadessages.length}</span>}

                    </Link>
                    {/* <div className="topbarIconItem">
                        <Notifications />
                        <span className="topbarIconBadge">2</span>
                    </div> */}
                    <Link to={`/profile/${user.username}`}>
                        <img src={
                            user.profilePicture
                                ? user.profilePicture
                                : PUBLIC_FOLDER + "person/noAvatar.png"} alt="" className="topbarImg" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Topbar;