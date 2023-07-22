import React from 'react';
import './PostMoreMenu.css';


const PostMoreMenu = ({ setEdit, handleDeleteSubmit }) => {

    return (
        <ul className="moreMenu">
            <li className="moreMenuItem" onClick={() => setEdit(true)}>編集</li>
            <li className="moreMenuItem" onClick={() => handleDeleteSubmit()}>
                <button className="deleteBtn" type="submit">削除</button>
            </li>
        </ul>
    );
};

export default PostMoreMenu;