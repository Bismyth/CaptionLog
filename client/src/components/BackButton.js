import React from "react";
import { useHistory } from "react-router-dom";
import backArrow from "../icons/arrow_back-black-24dp.svg";
const BackButton = (props) => {
    const history = useHistory();
    return (
        <img
            src={backArrow}
            alt="Back"
            onClick={() => {
                history.goBack();
            }}
            className={`link-arrow ${props.className}`}
        />
    );
};

export default BackButton;
