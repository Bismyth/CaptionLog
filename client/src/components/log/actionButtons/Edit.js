import React from "react";
import { ReactComponent as EditButton } from "../../../icons/edit-black-24dp.svg";
import { Link } from "react-router-dom";

const Edit = ({ id, className }) => {
    return (
        <Link to={`/edit/${id}`}>
            <EditButton alt="Edit" className={`link-arrow ${className}`} />
        </Link>
    );
};

export default Edit;
