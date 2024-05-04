import React from 'react';
import './Bookmark.css';
import Topbar from '../../components/Topbar/Topbar';
import Timeline from '../../components/Timeline/Timeline';
import Rightbar from '../../components/Rightbar/Rightbar';
import Hamburger from "../../components/Hamburger/Hamburger";
import { useMediaQuery } from 'react-responsive';
import { useLocation } from 'react-router-dom';

const Bookmark = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

    const location = useLocation();
    const pathName = location.pathname;
    console.log(pathName);
    return (
        <div className="Home">
            <Topbar />
            <div className="homeContainer">
                <Hamburger />
                {/* <BookmarkPostList /> */}
                <Timeline pathName={pathName} />
                {/* {!isMobile && <Rightbar />} */}
            </div>
        </div>
    );
};

export default Bookmark;