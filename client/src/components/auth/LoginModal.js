import React from "react";
import { Link } from "react-router-dom";
import { NavLink } from "reactstrap";

const LoginModal = (props) => {
    return (
        <div>
            <NavLink tag={Link} to="/api/auth/login">
                Login
            </NavLink>
        </div>
    );
};

export default LoginModal;
