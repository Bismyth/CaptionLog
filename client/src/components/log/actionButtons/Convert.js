import React from "react";
import { ReactComponent as ConvertButton } from "../../../icons/build-black-24dp.svg";
import { Link } from "react-router-dom";

const Convert = ({ id, className }) => {
    return (
        <Link to={`/convert/${id}`}>
            <ConvertButton alt="Convert" className={`link-arrow ${className}`} />
        </Link>
    );
};

export default Convert;
