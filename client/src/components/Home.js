import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setPage } from "../redux/actions/pageActions";
import { Container } from "reactstrap";
const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setPage("Home"));
    }, [dispatch]);
    return (
        <Container className="content">
            <h1>Home </h1>
        </Container>
    );
};

export default Home;
