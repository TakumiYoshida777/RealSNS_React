import React, { useContext } from 'react';
import './SearchResult.css';
import { Link } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';

const SearchResult = ({ searchResult, setSearchResultList, searchText }) => {

    const onCloseBtn = () => {
        setSearchResultList(false);
        searchText.current.value = "";
    };
    return (
        <ul className="searchResultList">
            {searchResult && searchResult.data && searchResult.data.map(item => (
                <Link to={`/profile/${item.username}`} key={item._id}>
                    <li className="userData" onClick={() => onCloseBtn()}>{item.username}</li>
                </Link>
            ))}
            <li className="closeBtn"
                onClick={() => onCloseBtn()}>
                <div>閉じる</div>
                <CloseIcon />
            </li>
        </ul>
    );
};

export default SearchResult;