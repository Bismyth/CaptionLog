import React, { useState } from "react";
import { ReactComponent as CircleUp } from "../icons/arrow_circle_up-black-24dp.svg";

const ScrollArrow = ({ scroll }) => {
    const [showScroll, setShowScroll] = useState(false);
    const checkScrollTop = () => {
        console.log("check");
        if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
        } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
        }
    };

    const scrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <CircleUp
            className="scrollTop"
            onClick={scrollTop}
            style={{ height: 40, display: showScroll ? "flex" : "none" }}
        />
    );
};

export default ScrollArrow;
