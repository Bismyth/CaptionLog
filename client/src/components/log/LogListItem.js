import React, { Fragment, useCallback } from "react";
import { Alert } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { setPage } from "../../redux/actions/pageActions";
import LogCard from "./LogCard";
import { getRoles } from "../../config";

const LogListItem = ({ data, page }) => {
    const userRoles = {
        ...useSelector(getRoles),
    };
    const dispatch = useDispatch();
    const updatePage = useCallback(() => {
        dispatch(
            setPage({
                page,
                scrollPos: document.getElementById("scroll").scrollTop,
            })
        );
    }, [dispatch, page]);
    return (
        <Fragment>
            {data.length > 0 ? (
                data.map((log) => <LogCard {...{ ...log, userRoles, updatePage }} key={log._id} />)
            ) : (
                <Alert color="info">No Results Found</Alert>
            )}
        </Fragment>
    );
};

export default React.memo(LogListItem);
