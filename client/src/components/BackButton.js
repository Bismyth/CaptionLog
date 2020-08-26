import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as BackArrow } from "../icons/arrow_back-black-24dp.svg";
import { useSelector } from "react-redux";
const BackButton = ({ className }) => {
    const { page, scrollPos } = useSelector((state) => state.page);
    return (
        <Link to={{ pathname: page, scroll: scrollPos }}>
            <BackArrow alt="Back" className={`link-arrow ${className}`} />
        </Link>
    );
};

export default BackButton;
