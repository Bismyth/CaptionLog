import React, { useState, useEffect } from "react";
import { ListGroup, Spinner, ListGroupItem } from "reactstrap";
import axios from "axios";

const EditSelector = (props) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const source = "captionSource";

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            var config = {
                method: "get",
                url: `/api/lists/${source}`,
            };
            const result = await axios(config);
            console.log(result.data);
            setData(result.data);

            setLoading(false);
        };
        fetchData();
    });
    if (loading) return <Spinner color="primary" />;
    return (
        <ListGroup>
            {data.map((value) => (
                <ListGroupItem key={value._id}>{value.name}</ListGroupItem>
            ))}
        </ListGroup>
    );
};

export default EditSelector;
