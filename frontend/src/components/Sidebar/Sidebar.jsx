import React, { useContext, useEffect, useState } from 'react';
import "./Sidebar.css";
import { Bookmark, Home, Logout, MessageRounded, Notifications, Person, Search, Settings } from '@mui/icons-material';
import { useMediaQuery } from 'react-responsive';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';
import RandomUser from '../RandomUser/RandomUser';
import Rightbar from '../Rightbar/Rightbar';


const Sidebar = ({ onClickMenu }) => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    const { user } = useContext(AuthContext);
    const [randomUser, setRandomUser] = useState([]);

    useEffect(() => {
        //すべてのユーザーからrandomにデータを１０に取得
        const getRandomUsers = async () => {

            try {
                const randomUsers = await axios.get("/users/randomusers");
                setRandomUser(randomUsers.data);
            } catch (err) {
                console.log(err.message, "ランダムデータの取得リクエストの送信に失敗しました");
            }
        };
        getRandomUsers();
    }, []);

    const logoutConfirm = () => {
        const res = window.confirm("ログアウトしますか？");
        if (res === true) {
            localStorage.removeItem("user");
            window.location.href = "/login";
        } else {
            return;
        }
    };

    return (
        <div className="sidebar">
            {isMobile && <div className="mask"></div>}

            <div className="sidebarWrapper">
                <ul className="sidebarList"
                    onClick={() => {
                        onClickMenu();
                    }
                    }
                >
                    <li >
                        <Link to="/" style={{ textDecoration: "none", color: "black" }} className="sidebarListItem">
                            <Home className="sidebarIcon" />
                            <span className="sidebarListItemText">ホーム</span>
                        </Link>
                    </li>
                    {/* <li className="sidebarListItem">
                        <Search className="sidebarIcon" />
                        <span className="sidebarListItemText">検索</span>
                    </li> */}
                    {/* <li className="sidebarListItem">
                        <Notifications className="sidebarIcon" />
                        <span className="sidebarListItemText">通知</span>
                    </li> */}
                    <li>
                        <Link to={`/mymessage/${user.username}`} style={{ textDecoration: "none", color: "black" }} className="sidebarListItem">
                            <MessageRounded className="sidebarIcon" />
                            <span className="sidebarListItemText">メッセージ</span>
                        </Link>

                    </li>
                    <li>
                        <Link to={`/bookmark`} style={{ textDecoration: "none", color: "black" }} className="sidebarListItem">
                            <Bookmark className="sidebarIcon" />
                            <span className="sidebarListItemText">ブックマーク</span>
                        </Link>
                    </li>
                    <li>
                        <Link to={`/profile/${user.username}`} style={{ textDecoration: "none", color: "black" }} className="sidebarListItem">
                            <Person className="sidebarIcon" />
                            <span className="sidebarListItemText">プロフィール</span>
                        </Link>
                    </li>
                    {/* <li className="sidebarListItem">
                        <Settings className="sidebarIcon" />
                        <span className="sidebarListItemText">設定</span>
                    </li> */}
                    <li className="sidebarListItem" onClick={() => logoutConfirm()}>
                        <Logout className="sidebarIcon" />
                        <span className="sidebarListItemText">ログアウト</span>
                    </li>
                </ul>
                <hr className="sidebarHr" />
                <h3 className="sidebarButtomTitle">おすすめのユーザー</h3>
                <ul className="sidebarFriendList">
                    {randomUser.map((user) => (
                        <RandomUser user={user} key={user._id} onClickMenu={onClickMenu} />
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;