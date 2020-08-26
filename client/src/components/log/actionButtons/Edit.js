import React from "react";
import { ReactComponent as EditButton } from "../../../icons/edit-black-24dp.svg";
import { Link } from "react-router-dom";
import { setPage } from "../../../redux/actions/pageActions";
import { useDispatch } from "react-redux";

const Edit = ({ id, className, page }) => {
    const dispatch = useDispatch();
    return (
        <Link
            onClick={() => {
                dispatch(
                    setPage({
                        page,
                        scrollPos: document.getElementById("scroll").scrollTop,
                    })
                );
            }}
            to={`/edit/${id}`}
        >
            <EditButton alt="Edit" className={`link-arrow ${className}`} />
        </Link>
    );
};

export default Edit;
