import React from "react";
import { NavLink } from "reactstrap";

const LoginModal = (props) => {
    return (
        <div>
            <NavLink href="/api/auth/login">Login</NavLink>
        </div>
    );
};

export default LoginModal;
