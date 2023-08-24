import React, { useContext, useEffect, useState } from 'react';
import './ChatList.css';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';

const Chatlist = ({ filterChat, sendCatch, openFilterMessage }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const [chatlist, setChatList] = useState([]);

    useEffect(() => {
        const getMessage = async () => {
            try {
                const response = await axios.get(`/messages/${user._id}/chats`);
                // 返ってきたデータから自分を除外し、更に新しいメッセージを持つデータを上位になるように並び替え
                const filteredData = response.data
                    // .filter((message) => message.userId !== user._id)
                    .sort((message1, message2) => {
                        return new Date(message2.date) - new Date(message1.date);
                    });

                setChatList(filteredData);

            } catch (error) {
                console.log(error, "リクエストに失敗しました。");
                return;
            }
        };
        getMessage();

    }, [sendCatch, openFilterMessage]);
    return (
        <div className="chatListContainer">
            <h2 className="listItem">ChatList</h2>
            {chatlist.length === 0
                ? <div>メッセージはありません。</div>
                : <ul className="chatList">
                    {chatlist.map((chat) => {
                        return (
                            <li key={chat._id}
                                onClick={() => filterChat(chat)}
                                className="chat" >
                                <div className="chatImgWrap">
                                    <img src={chat.profilePicture} className="senderPicture" />
                                    {!chat.read && user.username !== chat.userName && <div className="readMark"></div>}
                                </div>
                                {user.username === chat.userName
                                    ? <span>AllMessage</span>
                                    : <>{chat.userName}</>}
                            </li>
                        );
                    })}
                </ul>}
        </div >
    );
};

export default Chatlist;