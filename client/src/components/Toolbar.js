import React, { useState, Fragment } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container,
    NavLink,
} from "reactstrap";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ReactComponent as Logo } from "../MainLogo.svg";

const Toolbar = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const page = useSelector((state) => state.page.page);
    const user = useSelector((state) => state.auth.user);
    const [isOpen, toggle] = useState(false);
    const authLinks = (
        <Fragment>
            <NavItem>
                <span className="navbar-text mr-3">{user ? `Welcome ${user.username}` : ""}</span>
            </NavItem>
            <NavItem>
                <Logout />
            </NavItem>
        </Fragment>
    );
    const guestLinks = (
        <Fragment>
            <NavItem>
                <LoginModal />
            </NavItem>
        </Fragment>
    );
    return (
        <Fragment>
            <Navbar className="topbar p-0" dark color="sBlue">
                <Container>
                    <Nav navbar className="flex-row ml-auto">
                        {isLoading ? <Fragment /> : isAuthenticated ? authLinks : guestLinks}
                    </Nav>
                </Container>
            </Navbar>
            <Navbar color="light" light expand="md">
                <Container>
                    <NavbarBrand tag={Link} to="./">
                        <Logo className="logo w-auto" alt="logo" style={{ height: "50px" }} />
                    </NavbarBrand>
                    <NavbarToggler onClick={() => toggle(!isOpen)} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavItem className="b1 bl">
                                <NavLink tag={Link} to={`/`} active={page === "Home"}>
                                    Home
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to={`/atoz/a`} active={page === "Logs"}>
                                    Logs
                                </NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
};
export default Toolbar;
