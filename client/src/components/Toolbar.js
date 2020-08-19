import React, { useState, useEffect, Fragment } from "react";
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    Container,
    NavLink,
    Form,
} from "reactstrap";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../MainLogo.svg";
import SearchBar from "./log/SearchBar";

const Toolbar = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const user = useSelector((state) => state.auth.user);
    const [isOpen, toggle] = useState(false);
    const [value, setValue] = useState("");
    const [page, setPage] = useState(true);
    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        setPage(location.pathname.split("/")[1]);
    }, [location]);
    const authLinks = (
        <Fragment>
            <NavItem>
                <span className="navbar-text mr-3">{user ? `Welcome ${user.username}` : ""}</span>
            </NavItem>
            <NavItem>
                <NavLink tag={Link} to={"/newLog"} className="mr-3">
                    +New Log
                </NavLink>
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
                        {isLoading ? null : isAuthenticated ? authLinks : guestLinks}
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
                            <NavItem>
                                <NavLink tag={Link} to={`/`} active={page === ""}>
                                    Home
                                </NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to={`/atoz/a`} active={page === "atoz"}>
                                    #A-Z
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <Nav className="ml-auto">
                            {!["search", "atoz"].includes(page) ? (
                                <Form
                                    onSubmit={(e) => {
                                        setValue("");
                                        history.push(`/search/${encodeURIComponent(value)}/title`);
                                        e.preventDefault();
                                    }}
                                >
                                    <SearchBar value={value} update={setValue} />
                                </Form>
                            ) : null}
                        </Nav>
                    </Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
};
export default Toolbar;
