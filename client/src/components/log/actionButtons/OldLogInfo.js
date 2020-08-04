import React, { Fragment, useState, useEffect } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useSelector } from "react-redux";
import axios from "axios";

import { ReactComponent as InfoButton } from "../../../icons/info-black-24dp.svg";
import { ReactComponent as NoButton } from "../../../icons/clear-black-24dp.svg";

const OldLogInfo = ({ id, className }) => {
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState({});
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    useEffect(() => {
        if (id) {
            var config = {
                method: "get",
                url: `/api/logs/${id}?type=old`,
            };
            if (token) {
                config.headers = {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                };
            }
            axios(config)
                .then((result) => {
                    console.log(result);
                    setData(result.data);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [id, token]);
    return (
        <Fragment>
            <InfoButton id={`d-${id}`} alt="Info" className={`link-arrow ${className}`} />
            <Popover target={`d-${id}`} isOpen={pOpen} toggle={toggle} placement={"left-start"}>
                <PopoverHeader>
                    Old Log Data: <NoButton className="link-arrow" alt="No" onClick={toggle} />
                </PopoverHeader>
                <PopoverBody>
                    {console.log(data)}
                    {Object.entries(data).map((v) => (
                        <p key={v[0]}>{`${v[0]}: ${v[1]}`}</p>
                    ))}
                </PopoverBody>
            </Popover>
        </Fragment>
    );
};

export default React.memo(OldLogInfo);
