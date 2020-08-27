import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "reactstrap";

const LoginModal = (props) => {
    return (
        <div>
            <NavLink href={`${process.env.PUBLIC_URL}/login`}>Login</NavLink>
        </div>
    );
};

export default LoginModal;
