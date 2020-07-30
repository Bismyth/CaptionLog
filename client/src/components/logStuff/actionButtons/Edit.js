import React from "react";
import editButton from "../../../icons/edit-black-24dp.svg";
import { Link } from "react-router-dom";

const Edit = (props) => {
    return (
        <Link to={`/edit/${props.id}`}>
            <img src={editButton} alt="Edit" className={`link-arrow ${props.className}`} />
        </Link>
    );
};

export default Edit;
