import React from "react";
import editButton from "../../../icons/edit-black-24dp.svg";
import { Link } from "react-router-dom";

const Edit = ({ id, className }) => {
    return (
        <Link to={`/edit/${id}`}>
            <img src={editButton} alt="Edit" className={`link-arrow ${className}`} />
        </Link>
    );
};

export default Edit;
