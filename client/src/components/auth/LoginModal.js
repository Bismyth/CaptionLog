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
import { login } from "../../redux/actions/authActions";
import { clearErrors } from "../../redux/actions/errorActions";

const LoginModal = (props) => {
    const dispatch = useDispatch();
    const serverError = useSelector((state) => state.error);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [modal, setModal] = useState(false);
    const [user, setUser] = useState({});
    const [errors, setErrors] = useState(null);
    const toggle = useCallback(
        (e) => {
            setModal(!modal);
            dispatch(clearErrors());
            setUser({});
        },
        [modal, dispatch]
    );
    const onChange = (e) => {
        var update = user;
        update[e.target.name] = e.target.value;
        setUser(update);
    };
    const onSubmit = (e) => {
        dispatch(login(user));
        e.preventDefault();
    };
    useEffect(() => {
        if (serverError.id === "LOGIN_FAIL") {
            setErrors(serverError.errors);
        } else {
            setErrors(null);
        }
        //If authenticated close modal
        if (modal && isAuthenticated) {
            toggle();
        }
    }, [serverError, modal, isAuthenticated, toggle]);
    return (
        <div>
            <NavLink onClick={toggle} href="#">
                Login
            </NavLink>
            <Modal isOpen={modal} toggle={toggle} autoFocus={false}>
                <ModalHeader toggle={toggle}>Login</ModalHeader>
                <ModalBody>
                    {errors
                        ? errors.map((error, index) => (
                              <Alert key={index} color="danger">
                                  {error.msg}
                              </Alert>
                          ))
                        : null}
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
                            <Button color="dark" style={{ marginTop: "2rem" }} block>
                                Login
                            </Button>
                        </FormGroup>
                    </Form>
                </ModalBody>
            </Modal>
        </div>
    );
};

export default LoginModal;
