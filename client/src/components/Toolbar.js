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
import { ReactComponent as SLogo } from "../SLogo.svg";
import { ReactComponent as SMLogo } from "../SmallLogo.svg";
import SearchBar from "./log/SearchBar";
import { useWindowDimensions } from "../config";

const Toolbar = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const isLoading = useSelector((state) => state.auth.isLoading);
    const user = useSelector((state) => state.auth.user);
    const [isOpen, toggle] = useState(false);
    const [value, setValue] = useState("");
    const [page, setPage] = useState(true);
    const { width } = useWindowDimensions();
    const history = useHistory();
    const location = useLocation();
    useEffect(() => {
        setPage(location.pathname.split("/")[1]);
    }, [location]);
    const closeNav = () => {
        if (isOpen) {
            toggle(!isOpen);
        }
    };
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
        <div className="sticky-top">
            <Navbar className="topbar p-0" dark color="sBlue">
                <Container>
                    <Nav navbar className="flex-row ml-auto">
                        <Container>
                            {isLoading ? (
                                <p style={{ color: "var(--sBlue)" }}>fill</p>
                            ) : isAuthenticated ? (
                                authLinks
                            ) : (
                                guestLinks
                            )}
                        </Container>
                    </Nav>
                </Container>
            </Navbar>
            <Navbar color="light" light expand="md">
                <Container>
                    <NavbarBrand tag={Link} to={"/"}>
                        {width > 420 ? (
                            <Logo className="logo w-auto" alt="logo" />
                        ) : width > 280 ? (
                            <SLogo className="logo w-auto" alt="logo" />
                        ) : (
                            <SMLogo className="logo w-auto" alt="logo" />
                        )}
                    </NavbarBrand>
                    <NavbarToggler onClick={() => toggle(!isOpen)} />
                    <Collapse isOpen={isOpen} navbar>
                        <Nav className="mr-auto" navbar>
                            <NavLink tag={Link} to={`/`} active={page === ""} onClick={closeNav}>
                                Home
                            </NavLink>
                            <NavLink
                                tag={Link}
                                to={`/atoz/a`}
                                active={page === "atoz"}
                                onClick={closeNav}
                            >
                                #A-Z
                            </NavLink>
                        </Nav>
                    </Collapse>
                    {!["search", "atoz"].includes(page) ? (
                        <Form
                            onSubmit={(e) => {
                                setValue("");
                                history.push(`/search/${encodeURIComponent(value)}/title`);
                                e.preventDefault();
                            }}
                            inline
                            className="m-auto"
                            style={{ maxWidth: "240px" }}
                        >
                            <SearchBar value={value} update={setValue} />
                        </Form>
                    ) : null}
                </Container>
            </Navbar>
        </div>
    );
};
export default Toolbar;
