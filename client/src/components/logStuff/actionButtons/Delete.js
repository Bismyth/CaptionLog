import React, { Fragment, useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";

import deleteButton from "../../../icons/delete-black-24dp.svg";
import noButton from "../../../icons/clear-black-24dp.svg";
import yesButton from "../../../icons/done-black-24dp.svg";
import { useHistory } from "react-router-dom";

const Edit = (props) => {
    const token = useSelector((state) => state.auth.token);
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    const history = useHistory();
    const deleteLog = () => {
        var config = {
            method: "delete",
            url: `${process.env.PUBLIC_URL}/api/logs/${props.id}`,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token,
            },
            data: { old: props.old === true },
        };
        axios(config)
            .then(() => {
                if (props.update) props.update(props.id);
                else history.goBack();
            })
            .catch((err) => {
                console.error(err);
            });
    };
    return (
        <Fragment>
            <img
                id={`d-${props.id}`}
                src={deleteButton}
                alt="Delete"
                className={`link-arrow ${props.className}`}
            />
            <Popover target={`d-${props.id}`} isOpen={pOpen} toggle={toggle}>
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

export default Edit;
