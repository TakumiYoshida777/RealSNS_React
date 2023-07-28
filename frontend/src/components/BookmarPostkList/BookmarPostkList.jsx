import React, { useContext, useEffect } from 'react';
import './BookmarPostkList.css';
import { AuthContext } from '../../State/AuthContext';
import axios from 'axios';

const BookmarPostkList = () => {
    const { user } = useContext(AuthContext);
    console.log(user._id, "user._id");

    useEffect(() => {
        const getBookmarkPosts = async () => {
            try {
                const response = await axios.get(`posts/${user._id}/bookmarked-posts`);
                const data = response.data;
                const jsonData = JSON.stringify(data);
                console.log(response, "response ");
                console.log(jsonData, "jsonData ");
            } catch (err) {
                console.log(err, "ブックマークの取得リクエストに失敗しました");
            }
        };
        getBookmarkPosts();
    }, []);

    return (
        <div>BookmarPostkList</div>
    );
};

export default BookmarPostkList;