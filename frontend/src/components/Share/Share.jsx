import React, { useRef, useState } from 'react';
import "./Share.css";
import { Analytics, Face, Gif, Image } from '@mui/icons-material';
import { useContext } from 'react';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';

const Share = ({ setPostCatch }) => {
    const PUBLIC_FOLDER = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);
    const desc = useRef();
    const [file, setFile] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = {
            userId: user._id,
            desc: desc.current.value
        };

        if (file) {
            const data = new FormData();
            const filename = Date.now() + file.name;
            data.append("name", filename);
            data.append("file", file);
            newPost.img = filename;
            try {
                //画像APIを叩く
                await axios.post("/upload", data);
            } catch (err) {
                console.log(err);
            }
        }

        try {
            if (newPost.desc === "") {
                alert("何も入力されていません。");
            } else {
                await axios.post("/posts", newPost);
                desc.current.value = "";

            }

        } catch (err) {
            console.log(err);
        }
        setPostCatch((postCatch) => !postCatch);
        setFile(null);
    };
    return (
        <div className="share">
            <div className="shareWrapper">
                <div className="shareTop">
                    <img src={
                        user.profilePicture
                            ? PUBLIC_FOLDER + user.profilePicture
                            : PUBLIC_FOLDER + "/person/noAvatar.png"
                    } alt="" className="shareProfileImg" />
                    <input type="text"
                        className="shareInput"
                        placeholder="今何してるの？"
                        ref={desc} />
                </div>
                <hr className="shareHr" />
                <form className="shareButtons" onSubmit={(e) => handleSubmit(e)}>
                    <div className="shareOptions">
                        <label className="shareOption" htmlFor="file">
                            <Image className="shareIcon" htmlColor="blue" />
                            <span className="shareOptionText">写真</span>
                            <input type="file"
                                id="file"
                                accept=".png, .jpg, .webp"
                                style={{ display: "none" }}
                                onChange={(e) => setFile(e.target.files[0])} />
                        </label>
                        {/* <div className="shareOption">
                            <Gif className="shareIcon" htmlColor="hotpink" />
                            <span className="shareOptionText">Gif</span>
                        </div>
                        <div className="shareOption">
                            <Face className="shareIcon" htmlColor="green" />
                            <span className="shareOptionText">気持ち</span>
                        </div>
                        <div className="shareOption">
                            <Analytics className="shareIcon" htmlColor="red" />
                            <span className="shareOptionText">投票</span>
                        </div> */}
                    </div>
                    <button className="shareButton"
                        type="submit">
                        投稿
                    </button>
                </form>
            </div>

        </div>
    );
};

export default Share;