import React, { useState } from "react";
import { NavLink, Tooltip } from "reactstrap";

const IconTooltip = ({ Icon, className: { link, icon }, tooltip, id, onClick, tag, to }) => {
    const [isOpen, setIsOpen] = useState(false);
    const toggle = () => {
        setIsOpen((v) => !v);
    };
    return (
        <NavLink onClick={onClick} tag={tag} to={to} id={id} className={link}>
            <Icon alt={tooltip} className={icon} />
            <Tooltip target={id} toggle={toggle} isOpen={isOpen}>
                {tooltip}
            </Tooltip>
        </NavLink>
    );
};

export default IconTooltip;
