import React, { Fragment, useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";

import deleteButton from "../../../icons/delete-black-24dp.svg";
import noButton from "../../../icons/clear-black-24dp.svg";
import yesButton from "../../../icons/done-black-24dp.svg";
import { useHistory } from "react-router-dom";

const Delete = ({ id, old, update, className }) => {
    const token = useSelector((state) => state.auth.token);
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    const history = useHistory();
    const deleteLog = () => {
        var config = {
            method: "delete",
            url: `${process.env.PUBLIC_URL}/api/logs/${id}`,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token,
            },
            data: { old: old === true },
        };
        axios(config)
            .then(() => {
                if (update) update(id);
                else history.goBack();
            })
            .catch((err) => {
                console.error(err);
            });
    };
    return (
        <Fragment>
            <img
                id={`d-${id}`}
                src={deleteButton}
                alt="Delete"
                className={`link-arrow ${className}`}
            />
            <Popover target={`d-${id}`} isOpen={pOpen} toggle={toggle} placement={"left"}>
                <PopoverHeader>Delete</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete?
                    <br />
                    <img src={yesButton} className="link-arrow" alt="Yes" onClick={deleteLog} />
                    <img src={noButton} className="link-arrow" alt="No" onClick={toggle} />
                </PopoverBody>
            </Popover>
        </Fragment>
    );
};

export default Delete;
