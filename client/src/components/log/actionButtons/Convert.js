import React from "react";
import { ReactComponent as ConvertButton } from "../../../icons/build-black-24dp.svg";
import { Link } from "react-router-dom";
import { setPage } from "../../../redux/actions/pageActions";
import { useDispatch } from "react-redux";

const Convert = ({ id, className, page }) => {
    const dispatch = useDispatch();
    return (
        <Link to={`/convert/${id}`}>
            <ConvertButton
                onClick={() => {
                    dispatch(
                        setPage({
                            page,
                            scrollPos: document.getElementById("scroll").scrollTop,
                        })
                    );
                }}
                alt="Convert"
                className={`link-arrow ${className}`}
            />
        </Link>
    );
};

export default Convert;
