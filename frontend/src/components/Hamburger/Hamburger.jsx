import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
import Sidebar from '../Sidebar/Sidebar';
import "./Hamburger.css";

const humRota = {
    span1: 0,
    span1y: 0,
    span2: 0,
    span3: 0,
    span3y: 0,
};
const Hamburger = () => {
    const isDesktop = useMediaQuery({ query: '(min-width: 601px)' });
    const [boolToggle, setBoolToggle] = useState(false);
    const [hamburgerRotate, setHamburgerRotate] = useState(humRota);
    const onHamburgerMenu = () => {
        setBoolToggle(prevState => !prevState);
        if (!boolToggle) {
            console.log("in boolToggle");
            setHamburgerRotate({
                ...hamburgerRotate,
                span1: 135,
                span1y: 10,
                span2: 200,
                span3: -135,
                span3y: -10,
            });

        } else {
            setHamburgerRotate({
                ...hamburgerRotate,
                span1: 0,
                span1y: 0,
                span2: 0,
                span3: 0,
                span3y: 0,
            });
        }
    };
    const onClickMenu = () => {
        setBoolToggle(prevState => !prevState);
        setHamburgerRotate({
            ...hamburgerRotate,
            span1: 0,
            span1y: 0,
            span2: 0,
            span3: 0,
            span3y: 0,
        });
    };
    return (
        // <HamburgerMenu />
        <div className="hamburgerMenuContainer">
            {(isDesktop && <Sidebar onClickMenu={onClickMenu} boolToggle={boolToggle} />)
                || (boolToggle && <Sidebar onClickMenu={onClickMenu} boolToggle={boolToggle} />)}
            {!isDesktop &&
                // <HamburgerMenu />
                <div className="hamburgerMenu" onClick={onHamburgerMenu}>
                    <motion.span animate={{
                        y: hamburgerRotate.span1y,
                        rotate: hamburgerRotate.span1
                    }}
                        transition={{ duration: 0.5 }}>
                    </motion.span>
                    <motion.span animate={{ x: `-${hamburgerRotate.span2}px` }}
                        transition={{ duration: 0.5 }}>
                    </motion.span>
                    <motion.span animate={{
                        rotate: hamburgerRotate.span3,
                        y: hamburgerRotate.span3y
                    }}
                        transition={{ duration: 0.5 }}>
                    </motion.span>
                </div>
            }
        </div>
    );
};

export default Hamburger;