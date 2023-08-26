import React, { useContext, useEffect, useState } from 'react';
import './MyMessage.css';
import Topbar from '../../components/Topbar/Topbar';
import Hamburger from '../../components/Hamburger/Hamburger';
import axios from 'axios';
import { AuthContext } from '../../State/AuthContext';
import { Link } from 'react-router-dom';
import FilterMessage from './FilterMessage';
import Chatlist from '../../components/ChatList/Chatlist';
import { useMediaQuery } from 'react-responsive';

const MyMessage = () => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const [messageData, setMessageData] = useState([]);
    const [targetMessageData, setTargetMessageData] = useState([]);
    const [targetMessageUserName, setTargetUserName] = useState("");
    const [openFilterMessage, setOpenFilterMessage] = useState(false);
    const [sendUserData, setSendUserData] = useState([]);
    //新着メッセージ受信時に切り替わる
    const [sendCatch, setSendCatch] = useState(false);

    const mobileMediaQuery = useMediaQuery({ minWidth: "415px" });
    useEffect(() => {

        // メッセージデータを取得
        const getMessage = async () => {
            try {
                const response = await axios.get(`/messages/${user._id}/read`);
                setMessageData(response.data.sort((message1, message2) => {
                    return new Date(message2.date) - new Date(message1.date);
                }));

            } catch (error) {
                console.log(error, "リクエストに失敗しました。");
                return;
            }
        };
        getMessage();


    }, [sendCatch]);
    /** TODO:共通化したい */

    //新着メッセージが届いた場合
    useEffect(() => {
        // const socket = new WebSocket('ws://localhost:5000'); // WebSocketサーバーのURLに適宜変更する
        const socket = new WebSocket('wss://real-sns-app-66036cba7bab.herokuapp.com'); // WebSocketサーバーのURLに適宜変更する

        socket.onmessage = (event) => {
            const newMessageData = JSON.parse(event.data);
            if (newMessageData.userId !== user._id && newMessageData.recipientId === user._id) {
                //メッセージが届いたらステートに変更を加える　useEffectがそれをキャッチして再度受信データを取得、ステートを更新してリアルタイムでレンダリング
                if (!mobileMediaQuery) {
                    //mobileだった時
                    alert("新着メッセージが届きました");
                }
                setSendCatch((prevState) => !prevState);
            }
        };

        // コンポーネントのクリーンアップ時にWebSocket接続を閉じる
        return () => {
            socket.close();
        };
    }, []);
    /** TODO:共通化したい END*/

    //クリックしたチャットのやりとりのみをmodalに抽出
    const filterChat = (targetMessageData) => {
        if (mobileMediaQuery) {
            if (user._id !== targetMessageData.userId) {
                setSendUserData(targetMessageData);
                const newMessageData = messageData.filter((message) => {
                    if (targetMessageData.userId === message.userId || message.recipientId === targetMessageData.userId) {
                        return message;
                    }
                });
                setTargetMessageData(newMessageData);
                setTargetUserName(targetMessageData.userName);
                setOpenFilterMessage(prevState => !prevState);
            }
        } else {
            setSendUserData(targetMessageData);
            const newMessageData = messageData.filter((message) => {
                if (targetMessageData.userId === message.userId || message.recipientId === targetMessageData.userId) {
                    return message;
                }
            });
            setTargetMessageData(newMessageData);
            if (targetMessageData.userName === user.username) {
                setTargetUserName("AllMessages");
            } else {
                setTargetUserName(targetMessageData.userName);
            }

            setOpenFilterMessage(prevState => !prevState);
        }

    };
    // console.log(messageData, "messageData");
    return (
        <div className="MyMessage">
            <Topbar openFilterMessage={openFilterMessage} />

            <div className="myMessageContainer">
                <Hamburger />
                {mobileMediaQuery &&
                    <div className="myMessageInnerContainer">
                        <h3 className="MyMessageHeader">
                            AllMessage
                        </h3>
                        {messageData.map(data => {
                            return (
                                <div key={data._id} className={data.userName === user.username ? "messageContainerRight"
                                    : "messageContainer"}>
                                    <div className="messageCard" onClick={() => filterChat(data)} >
                                        <div className="sendUser">
                                            <div className="sender">
                                                <Link to={`/profile/${data.userName}`}>
                                                    <img src={data.profilePicture} className="senderPicture" />
                                                </Link>

                                                {data.userName === user.username
                                                    ? <div className="fromAndTo">
                                                        <div className="from">From：自分</div>
                                                        <div className="to">To:{data.recipientName}</div>
                                                    </div>
                                                    : <div className="from">From：{data.userName}</div>}
                                            </div>
                                        </div>
                                        <div className="messageWrap">

                                            {data.title && <>
                                                <h3 className="title">Title:{data.title}</h3>
                                                <hr />
                                            </>
                                            }
                                            <div className="message">{data.message}</div>
                                            <div className="dateTime">
                                                <div>
                                                    <span className="date">{data.date}</span>
                                                    <span className="time"></span>
                                                </div>
                                                <div className="newMessage">{!data.read && data.userId !== user._id && <span>new</span>}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                }
                <Chatlist filterChat={filterChat}
                    sendCatch={sendCatch}
                    openFilterMessage={openFilterMessage} />
                {openFilterMessage && <FilterMessage
                    targetMessageData={targetMessageData}
                    targetMessageUserName={targetMessageUserName}
                    setOpenFilterMessage={setOpenFilterMessage}
                    sendUserData={sendUserData}
                    setSendCatch={setSendCatch} />}
                {/* メッセージを送った人送られてきた人 */}
                {/* 新しいcomponentを用意する　DBのメッセージリストに格納されてるIDと照合してユーザー一覧を取得する */}
            </div>

        </div>
    );
};

export default MyMessage;