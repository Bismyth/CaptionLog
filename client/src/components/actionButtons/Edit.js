import React from "react";
import { ReactComponent as EditButton } from "../../icons/edit-black-24dp.svg";
import { Link } from "react-router-dom";

const Edit = ({ className, action, id }) => {
    if (typeof action === "function") {
        return (
            <EditButton alt="Edit" className={`link-arrow ${className}`} onClick={action} id={id} />
        );
    } else if (action.link) {
        return (
            <Link to={action.link}>
                <EditButton alt="Edit" className={`link-arrow ${className}`} />
            </Link>
        );
    }
    return null;
};

export default Edit;
