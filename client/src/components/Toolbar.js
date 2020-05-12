import React, { useState, Fragment } from "react";
import {
	Collapse,
	Navbar,
	NavbarToggler,
	NavbarBrand,
	Nav,
	NavItem,
	Container,
} from "reactstrap";
import RegisterModal from "./auth/RegisterModal";
import LoginModal from "./auth/LoginModal";
import Logout from "./auth/Logout";
import { useSelector } from "react-redux";

const Toolbar = (props) => {
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const user = useSelector((state) => state.auth.user);
	const [isOpen, toggle] = useState(false);
	const authLinks = (
		<Fragment>
			<NavItem>
				<span className="navbar-text mr-3">
					{user ? `Welcome ${user.username}` : ""}
				</span>
			</NavItem>
			<NavItem>
				<Logout />
			</NavItem>
		</Fragment>
	);
	const guestLinks = (
		<Fragment>
			<NavItem>
				<RegisterModal />
			</NavItem>
			<NavItem>
				<LoginModal />
			</NavItem>
		</Fragment>
	);
	return (
		<div>
			<Navbar color="dark" dark expand="sm" className="mb-5">
				<Container>
					<NavbarBrand href="/">CaptionLog</NavbarBrand>
					<NavbarToggler onClick={() => toggle(!isOpen)} />
					<Collapse isOpen={isOpen} navbar>
						<Nav className="ml-auto" navbar>
							{isAuthenticated ? authLinks : guestLinks}
						</Nav>
					</Collapse>
				</Container>
			</Navbar>
		</div>
	);
};
export default Toolbar;
