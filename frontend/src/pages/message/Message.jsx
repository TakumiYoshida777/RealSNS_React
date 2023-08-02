import React, { useContext, useEffect, useRef, useState } from 'react';
import './Message.css';
import axios from 'axios';
import { AuthContext } from '../../State/AuthContext';

const Message = ({ messageAreaState, setMessageAreaState, profileUser }) => {
    const { user } = useContext(AuthContext);

    /** TODO:共通化したい */

    //メッセージが届いたらアラートを出してトップバーの新着メッセージ数を更新する
    useEffect(() => {
        // const socket = new WebSocket('ws://localhost:5000'); // WebSocketサーバーのURLに適宜変更する
        const socket = new WebSocket('wss://real-sns-app-66036cba7bab.herokuapp.com'); // WebSocketサーバーのURLに適宜変更する

        socket.onmessage = (event) => {
            const newMessageData = event.data;
            const newMessageDataJson = JSON.parse(newMessageData);
            if (newMessageDataJson.userId != user._id) {
                alert("新しいメッセージが届きました");
            }
        };

        // コンポーネントのクリーンアップ時にWebSocket接続を閉じる
        return () => {
            socket.close();
        };
    }, []);
    /** TODO:共通化したい END*/

    //ログインユーザー情報
    const { user: currentUser } = useContext(AuthContext);
    const title = useRef();
    const message = useRef();

    const sendMessage = async (e) => {
        e.preventDefault();
        const semdData = {
            userId: currentUser._id,
            userName: currentUser.username,
            recipientId: profileUser._id,
            recipientName: profileUser.username,
            profilePicture: currentUser.profilePicture,
            date: Date.now,
            title: title.current.value,
            message: message.current.value,
            sendPicture: "",
        };
        try {
            const response = await axios.put(`/messages/${currentUser._id}/send`, semdData);
        } catch (error) {
            console.log(error.message, "リクエストに失敗しました");
        }
        setMessageAreaState(prevState => !prevState);
    };

    return (
        <div className="modal">
            <form onSubmit={(e) => sendMessage(e)} className="messageForm">
                <input className="messageTitle" type="text" name="" id="" placeholder="タイトル" ref={title} />
                <textarea className="mainMessage" name="" id="" cols="30" rows="10" ref={message} placeholder="メッセージ"></textarea>
                <div className="btnContainer">
                    <button type="button"
                        onClick={() => setMessageAreaState(prevState => !prevState)}
                        className="cancelBtn btn">キャンセル</button>
                    <button className="sendBtn btn" type="submit">送信</button>
                </div>
            </form>
        </div >

    );
};
export default Message;