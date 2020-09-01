import React from "react";
import { NavLink } from "reactstrap";

const Login = (props) => {
    return <NavLink href={`${process.env.PUBLIC_URL}/login`}>Login</NavLink>;
};

export default Login;
