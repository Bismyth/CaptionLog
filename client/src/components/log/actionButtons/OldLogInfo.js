import React, { Fragment, useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";
import { useSelector } from "react-redux";

import { ReactComponent as InfoButton } from "../../../icons/info-black-24dp.svg";
import { ReactComponent as NoButton } from "../../../icons/clear-black-24dp.svg";
import { useQuery } from "react-query";
import { fetchLog } from "../../../queries/log";

const OldLogInfo = ({ id, className }) => {
    const token = useSelector((state) => state.auth.token);
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    const { isLoading, data } = useQuery(["oldLog", { token, id, old: true }], fetchLog);
    if (isLoading) return <Fragment />;
    return (
        <Fragment>
            <InfoButton id={`d-${id}`} alt="Info" className={`link-arrow ${className}`} />
            <Popover target={`d-${id}`} isOpen={pOpen} toggle={toggle} placement={"left-start"}>
                <PopoverHeader>
                    Old Log Data: <NoButton className="link-arrow" alt="No" onClick={toggle} />
                </PopoverHeader>
                <PopoverBody>
                    {Object.entries(data).map(([key, value]) => {
                        return <p key={key}>{`${key}: ${value}`}</p>;
                    })}
                </PopoverBody>
            </Popover>
        </Fragment>
    );
};

export default React.memo(OldLogInfo);
