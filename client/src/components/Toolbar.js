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
    Tooltip,
} from "reactstrap";
import Login from "./auth/Login";
import Logout from "./auth/Logout";
import { useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../logos/MainLogo.svg";
import { ReactComponent as SLogo } from "../logos/SLogo.svg";
import { ReactComponent as SMLogo } from "../logos/SmallLogo.svg";
import { ReactComponent as NewLog } from "../icons/post_add-black-24dp.svg";
import { ReactComponent as UserRole } from "../icons/supervisor_account-black-24dp.svg";
import SearchBar from "./log/SearchBar";
import { useWindowDimensions, getRoles } from "../config";

import "./Toolbar.css";

const Toolbar = (props) => {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const userRoles = { ...useSelector(getRoles) };
    const isLoading = useSelector((state) => state.auth.isLoading);
    const user = useSelector((state) => state.auth.user);
    const [isOpen, toggle] = useState(false);
    const [value, setValue] = useState("");
    const [page, setPage] = useState(true);
    const [tooltip, setTooltip] = useState({});
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
    const tToggle = (e) => {
        const toolName = e.target.closest("a").id;
        setTooltip((v) => {
            return { ...v, [toolName]: !v[toolName] };
        });
    };
    const authLinks = (
        <Fragment>
            <NavItem>
                <span className="navbar-text mr-3">
                    {user ? `Welcome ${user.displayname}` : ""}
                </span>
            </NavItem>
            {userRoles.write ? (
                <NavItem>
                    <NavLink tag={Link} to={"/newLog"} className="mr-3" id="newLog">
                        <NewLog className={`topIcon ${page === "newLog" ? "active" : ""}`} />
                    </NavLink>
                    <Tooltip target="newLog" toggle={tToggle} isOpen={tooltip["newLog"]}>
                        New Log
                    </Tooltip>
                </NavItem>
            ) : null}
            {userRoles.admin ? (
                <NavItem>
                    <NavLink tag={Link} to={"/permissions"} className="mr-3" id="roles">
                        <UserRole className={`topIcon ${page === "permissions" ? "active" : ""}`} />
                    </NavLink>
                    <Tooltip target="roles" toggle={tToggle} isOpen={tooltip["roles"]}>
                        User Permissions
                    </Tooltip>
                </NavItem>
            ) : null}
            <NavItem>
                <Logout />
            </NavItem>
        </Fragment>
    );
    const guestLinks = (
        <Fragment>
            <NavItem>
                <Login />
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
                <Container style={{ flexWrap: "wrap" }}>
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
                        <Nav className="mr-auto" navbar style={{ width: "max-content" }}>
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
                    {!["search"].includes(page) ? (
                        <Form
                            onSubmit={(e) => {
                                setValue("");
                                history.push(`/search/${encodeURIComponent(value)}/title`);
                                e.preventDefault();
                            }}
                            inline
                            className="m-auto"
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
