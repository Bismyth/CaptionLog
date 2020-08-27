import React from "react";
import { NavLink } from "reactstrap";

const Logout = (props) => {
    return <NavLink href={`${process.env.PUBLIC_URL}/logout`}>Logout</NavLink>;
};

export default Logout;
