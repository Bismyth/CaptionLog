import React from "react";
import { useHistory } from "react-router-dom";
import { ReactComponent as BackArrow } from "../icons/arrow_back-black-24dp.svg";
const BackButton = ({ className }) => {
    const history = useHistory();
    return (
        <BackArrow
            alt="Back"
            onClick={() => {
                history.goBack();
            }}
            className={`link-arrow ${className}`}
        />
    );
};

export default BackButton;
