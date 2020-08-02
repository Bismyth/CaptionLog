import React from "react";
import { useHistory } from "react-router-dom";
import backArrow from "../icons/arrow_back-black-24dp.svg";
const BackButton = ({ className }) => {
    const history = useHistory();
    return (
        <img
            src={backArrow}
            alt="Back"
            onClick={() => {
                history.goBack();
            }}
            className={`link-arrow ${className}`}
        />
    );
};

export default BackButton;
