
import React from 'react';
import "./Home.css";
import Topbar from '../../components/Topbar/Topbar';
import Timeline from '../../components/Timeline/Timeline';
import Rightbar from '../../components/Rightbar/Rightbar';
import Hamburger from "../../components/Hamburger/Hamburger";
import { useMediaQuery } from 'react-responsive';

const Home = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 767px)' });
    return (
        <div className="Home">
            <Topbar />
            <div className="homeContainer">
                <Hamburger />
                <Timeline />
                {!isMobile && <Rightbar />}
            </div>
        </div>
    );
};

export default Home;