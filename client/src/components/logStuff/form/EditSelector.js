import React, { useState, useEffect } from "react";
import { Container, ListGroup, Spinner, ListGroupItem } from "reactstrap";
import axios from "axios";
import { useSelector } from "react-redux";
const EditSelector = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const source = "captionSource";
    const token = useSelector((state) => state.auth.token);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var config = {
                method: "get",
                url: `/api/lists/${source}`,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
            };
            const result = await axios(config);
            console.log(result.data);
            setData(result.data);

            setLoading(false);
        };
        fetchData();
    }, [token]);
    return (
        <Container className="content">
            {!loading ? (
                <ListGroup>
                    {data.map((value) => (
                        <ListGroupItem key={value._id}>{value.name}</ListGroupItem>
                    ))}
                </ListGroup>
            ) : (
                <Spinner color="primary" />
            )}
        </Container>
    );
};

export default EditSelector;
