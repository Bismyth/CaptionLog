import React from "react";
import { Link, useHistory } from "react-router-dom";
import { ReactComponent as BackArrow } from "../icons/arrow_back-black-24dp.svg";
import { useSelector, useDispatch } from "react-redux";
import { clearPage } from "../redux/actions/pageActions";
const BackButton = ({ className, back }) => {
    const style = `link-arrow mr-1 ${className}`;
    const { page, scrollPos } = useSelector((state) => state.page);
    const dispatch = useDispatch();
    const history = useHistory();
    if (back) {
        return (
            <BackArrow
                alt="Back"
                onClick={() => {
                    history.goBack();
                }}
                className={style}
            />
        );
    } else {
        return (
            <Link
                to={{ pathname: page, scroll: scrollPos }}
                onClick={() => {
                    dispatch(clearPage());
                }}
            >
                <BackArrow alt="Back" className={style} />
            </Link>
        );
    }
};

export default BackButton;
