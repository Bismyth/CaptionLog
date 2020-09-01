import React, { Fragment, useState } from "react";
import { Popover, PopoverBody, PopoverHeader } from "reactstrap";

import { ReactComponent as DeleteButton } from "../../icons/delete-black-24dp.svg";
import { ReactComponent as NoButton } from "../../icons/clear-black-24dp.svg";
import { ReactComponent as YesButton } from "../../icons/done-black-24dp.svg";

const Delete = ({ className, id, action }) => {
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    return (
        <Fragment>
            <DeleteButton id={`d-${id}`} alt="Delete" className={`link-arrow ${className}`} />
            <Popover target={`d-${id}`} isOpen={pOpen} toggle={toggle} placement={"left"}>
                <PopoverHeader>Delete</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete?
                    <br />
                    <YesButton className="link-arrow" alt="Yes" onClick={action} />
                    <NoButton className="link-arrow" alt="No" onClick={toggle} />
                </PopoverBody>
            </Popover>
        </Fragment>
    );
};

export default Delete;
