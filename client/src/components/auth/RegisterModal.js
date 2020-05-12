import React, { useState, useEffect, useCallback } from "react";
import {
	Button,
	Modal,
	ModalHeader,
	ModalBody,
	Form,
	FormGroup,
	Label,
	Input,
	NavLink,
	Alert,
} from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { register } from "../../redux/actions/authActions";
import { clearErrors } from "../../redux/actions/errorActions";

const RegisterModal = (props) => {
	const dispatch = useDispatch();
	const serverError = useSelector((state) => state.error);
	const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
	const [modal, setModal] = useState(false);
	const [user, setUser] = useState({});
	const [errorMsg, setError] = useState(null);
	const toggle = useCallback(() => {
		setModal(!modal);
		dispatch(clearErrors());
		setUser({});
	}, [modal, dispatch]);
	const onChange = (e) => {
		var update = user;
		update[e.target.name] = e.target.value;
		setUser(update);
	};
	const onSubmit = (e) => {
		dispatch(register(user));
		e.preventDefault();
	};
	useEffect(() => {
		if (serverError.id === "REGISTER_FAIL") {
			setError(serverError.msg.msg);
		} else {
			setError(null);
		}
		//If authenticated close modal
		if (modal && isAuthenticated) {
			toggle();
		}
	}, [serverError, modal, isAuthenticated, toggle]);
	return (
		<div>
			<NavLink onClick={toggle} href="#">
				Register
			</NavLink>
			<Modal isOpen={modal} toggle={toggle} autoFocus={false}>
				<ModalHeader toggle={toggle}>Register</ModalHeader>
				<ModalBody>
					{errorMsg ? <Alert color="danger">{errorMsg}</Alert> : null}
					<Form onSubmit={onSubmit}>
						<FormGroup>
							<Label for="username">Username</Label>
							<Input
								type="text"
								name="username"
								id="username"
								placeholder="Username"
								onChange={onChange}
								className="mb-3"
								autoFocus={true}
							/>
							<Label for="password">Password</Label>
							<Input
								type="password"
								name="password"
								id="password"
								placeholder="Password"
								onChange={onChange}
								className="mb-3"
							/>
							<Label for="access">Access</Label>
							<Input
								type="text"
								name="access"
								id="access"
								placeholder="Access"
								onChange={onChange}
								className="mb-3"
							/>
							<Button
								color="dark"
								style={{ marginTop: "2rem" }}
								block
							>
								Register
							</Button>
						</FormGroup>
					</Form>
				</ModalBody>
			</Modal>
		</div>
	);
};

export default RegisterModal;
