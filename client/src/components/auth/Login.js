import React from "react";
import { NavLink } from "reactstrap";

const Login = (props) => {
    return (
        <div>
            <NavLink href={`${process.env.PUBLIC_URL}/login`}>Login</NavLink>
        </div>
    );
};

export default Login;
