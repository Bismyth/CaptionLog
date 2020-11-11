import React, { Fragment, useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";

import { ReactComponent as InfoButton } from "../../../icons/info-black-24dp.svg";
import { ReactComponent as NoButton } from "../../../icons/clear-black-24dp.svg";
import IconTooltip from "../../IconTooltip";

const OldLogInfo = ({ data, className }) => {
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    return (
        <Fragment>
            <IconTooltip
                tooltip="Info"
                id={"oInfo"}
                className={{ link: "p-0 d-inline-block", icon: `link-arrow ${className}` }}
                Icon={InfoButton}
            />
            <Popover target={"oInfo"} isOpen={pOpen} toggle={toggle} placement={"left-start"}>
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
