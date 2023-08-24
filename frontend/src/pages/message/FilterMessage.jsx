import React, { useContext, useEffect, useRef } from 'react';
import './FilterMessage.css';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';

const FilterMessage = ({ targetMessageData, targetMessageUserName, setOpenFilterMessage, sendUserData, setSendCatch }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);

    const title = useRef();
    const message = useRef();
    const noRead = targetMessageData.filter(data => data.read === false);
    console.log(noRead, "noRead");


    useEffect(() => {
        //未読を既読にする
        const editReadMessage = async () => {
            try {
                const res = await axios.put(`/messages/${user._id}/read`, noRead);
            } catch (error) {
                console.log(error, "リクエストに失敗しました。");
            }
        };

        editReadMessage();

    }, []);

    const sendMessage = async (e) => {
        e.preventDefault();
        const semdData = {
            userId: user._id,
            userName: user.username,
            recipientId: sendUserData.userId,
            recipientName: sendUserData.userName,
            profilePicture: user.profilePicture,
            date: Date.now,
            title: title.current.value,
            message: message.current.value,
            sendPicture: "",
        };
        console.log(semdData, "semdData");
        console.log(user, "user");
        try {
            await axios.put(`/messages/${user._id}/send`, semdData);
        } catch (error) {
            console.log(error.message, "リクエストに失敗しました");
        }
        setSendCatch((prevState) => !prevState);
        setOpenFilterMessage(prevState => !prevState);
    };
    return (
        <div className="modal">
            <div className="modalHeader">
                <h3 className="targetUserName">{targetMessageUserName}</h3>
                <div className="close" onClick={() => setOpenFilterMessage(prevState => !prevState)}>close</div>
            </div>
            {targetMessageUserName !== "AllMessages"
                && <form onSubmit={(e) => sendMessage(e)} className="sendMessage">
                    <input className="sendInput" type="text" name="" id="" placeholder="タイトル" ref={title} />
                    <div className="wrapper">
                        <textarea className="textarea" ref={message} required placeholder="メッセージ"></textarea>
                        <button className="modalSubmitBtn" type="submit">送信</button>
                    </div>
                </form>}

            <div className="messageInnerContainer">
                {targetMessageData.map(data => {
                    return (
                        <div key={data._id} className={data.userName === user.username ? "messageRight" : "message"} >
                            <div className="messageCard">
                                <div className="sendUser">
                                    <div className="sender">
                                        <Link to={`/profile/${data.userName}`}>
                                            <img src={data.profilePicture} className="senderPicture" />
                                        </Link>
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
                                        <span className="date">{data.date}</span>
                                        <span className="time"></span>
                                        <div className="read">{!data.read && data.userId !== user._id && <span>new</span>}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div >
    );
};

export default FilterMessage;