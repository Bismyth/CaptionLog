import React, { useState, useEffect, Fragment, useRef } from "react";
import axios from "axios";
import {
    Button,
    Spinner,
    Form,
    Input,
    Container,
    FormGroup,
    Label,
    Col,
    Alert,
} from "reactstrap";
import "./fade.css";

import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";

const LogForm = (props) => {
    /*
        - Add dropdown for video_source and caption_source and genre
        - Build out transferer
    */
    const digBlank = useRef({
        name: "",
        length: "",
        location: "",
    });
    const physBlank = useRef({
        name: "",
        location: "",
        copiesHeld: "",
    });
    const blankForm = {
        title: "",
        year: "",
        description: "",
        genre: "",
        copyrightInfo: {
            teacherName: "",
            captionSource: "",
            dateOfCompletion: "",
            videoSource: "",
            originalLocation: "",
        },
        digitalInfo: [],
        physicalInfo: [],
    };
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState(blankForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const history = useHistory();
    useEffect(() => {
        if (props.match.params.id) {
            const fetchData = async () => {
                setLoading(true);
                if (loggedIn) {
                    var config = {};
                    config.headers = {
                        "Content-type": "application/json",
                    };
                    config.headers["x-auth-token"] = token;
                    const result = await axios(
                        `${process.env.PUBLIC_URL}/api/logs/${props.match.params.id}?type=new`,
                        config
                    );
                    if (result.data) {
                        setError("");
                        setData(result.data);
                    } else {
                        setError("No Log with that ID found");
                    }
                    setLoading(false);
                } else {
                    setError("User not logged in!");
                }
            };
            fetchData();
        } else {
            setLoading(false);
        }
    }, [props.match.params.id, loggedIn, token]);

    const changeFormType = (e) => {
        var formType = e.target.value;
        if (formType === "movie") {
            digBlank.current = {
                length: "",
                location: "",
            };
            physBlank.current = {
                location: "",
                copiesHeld: "",
            };
            setData((d) => ({ movieInfo: { year: "", rating: "" }, ...d }));
        } else if (formType === "media") {
            digBlank.current = {
                name: "",
                length: "",
                location: "",
            };
            physBlank.current = {
                name: "",
                location: "",
                copiesHeld: "",
            };
            const { movieInfo, ...nData } = data;
            setData(nData);
        }
    };
    const changeValue = (e, level, index) => {
        if (level === undefined) {
            setData({
                ...data,
                [e.target.name]: e.target.value,
            });
        } else if (index === undefined) {
            setData({
                ...data,
                [level]: { ...data[level], [e.target.name]: e.target.value },
            });
        } else {
            setData({
                ...data,
                [level]: data[level].map((v, i) =>
                    i === index ? { ...v, [e.target.name]: e.target.value } : v
                ),
            });
        }
    };
    const addArr = (key) => {
        setData({
            ...data,
            [key]: [
                ...data[key],
                {
                    digitalInfo: digBlank.current,
                    physicalInfo: physBlank.current,
                }[key],
            ],
        });
    };
    const submit = async () => {};
    const removeArr = (key, index) => {
        setData({
            ...data,
            [key]: data[key].filter((v, i) => {
                return index !== i;
            }),
        });
    };
    return (
        <div id="scroll">
            {!loggedIn ? <Redirect to="/logs" /> : <Fragment />}
            <Container className="content">
                <div>
                    <Button
                        onClick={() => {
                            history.goBack();
                        }}
                        className="mb-2"
                    >
                        Back
                    </Button>
                    <h1 className>
                        {props.match.path.includes("edit")
                            ? "Edit Log"
                            : "New Log"}
                    </h1>
                    <Input
                        type="select"
                        onChange={changeFormType}
                        className="ml-auto mb-4"
                        style={{ width: "auto" }}
                    >
                        <option value="media">Media</option>
                        <option value="movie">Movie</option>
                    </Input>
                </div>

                {!loading ? (
                    <Form>
                        {error ? (
                            <Alert color="danger">{error}</Alert>
                        ) : (
                            <Fragment />
                        )}
                        {Object.entries(data).map(([key, value]) => {
                            var titles = {
                                title: "Title",
                                description: "Description",
                                genre: "Genre",
                            };
                            if (Object.keys(titles).includes(key)) {
                                return (
                                    <FormGroup row key={key}>
                                        <Label for={key} xs={2}>
                                            {titles[key]}
                                        </Label>
                                        <Col xs={10}>
                                            <Input
                                                type={
                                                    {
                                                        title: "text",
                                                        year: "number",
                                                        description: "textarea",
                                                        genre: "text",
                                                    }[key]
                                                }
                                                id={key}
                                                name={key}
                                                placeholder={
                                                    titles[key] + "..."
                                                }
                                                value={value}
                                                onChange={changeValue}
                                            />
                                        </Col>
                                    </FormGroup>
                                );
                            }
                            return <Fragment key={key} />;
                        })}
                        {data.movieInfo ? (
                            <Fragment>
                                <h3 className="mb-3">Movie Info</h3>{" "}
                                {Object.entries(data.movieInfo).map(
                                    ([key, value]) => {
                                        var titles = {
                                            year: "Year",
                                            rating: "Rating",
                                        };
                                        return (
                                            <FormGroup row key={key}>
                                                <Label for={key} xs={2}>
                                                    {titles[key]}
                                                </Label>
                                                <Col xs={10}>
                                                    <Input
                                                        type={
                                                            key === "year"
                                                                ? "number"
                                                                : "text"
                                                        }
                                                        id={key}
                                                        name={key}
                                                        placeholder={
                                                            titles[key] + "..."
                                                        }
                                                        value={value}
                                                        onChange={(e) => {
                                                            changeValue(
                                                                e,
                                                                "movieInfo"
                                                            );
                                                        }}
                                                    />
                                                </Col>
                                            </FormGroup>
                                        );
                                    }
                                )}
                            </Fragment>
                        ) : (
                            <Fragment />
                        )}

                        <h3 className="mb-3">Copyright Info</h3>
                        {Object.entries(data.copyrightInfo).map(
                            ([key, value]) => {
                                var titles = {
                                    teacherName: "Teacher's Name",
                                    captionSource: "Caption Source",
                                    dateOfCompletion: "Date of Completion",
                                    videoSource: "Video Source",
                                    originalLocation: "Original Location",
                                };
                                if (Object.keys(titles).includes(key)) {
                                    return (
                                        <FormGroup row key={key}>
                                            <Label for={key} xs={2}>
                                                {titles[key]}
                                            </Label>
                                            <Col xs={10}>
                                                <Input
                                                    type={
                                                        key ===
                                                        "dateOfCompletion"
                                                            ? "date"
                                                            : "text"
                                                    }
                                                    id={key}
                                                    name={key}
                                                    placeholder={
                                                        titles[key] + "..."
                                                    }
                                                    value={value}
                                                    onChange={(e) => {
                                                        changeValue(
                                                            e,
                                                            "copyrightInfo"
                                                        );
                                                    }}
                                                />
                                            </Col>
                                        </FormGroup>
                                    );
                                }
                                return <Fragment key={key} />;
                            }
                        )}
                        {data.digitalInfo.map((value, i) => {
                            return (
                                <Fragment key={i}>
                                    <div>
                                        <h4>
                                            <Button
                                                className="mr-2"
                                                color="danger"
                                                size="sm"
                                                onClick={(e) => {
                                                    removeArr("digitalInfo", i);
                                                }}
                                            >
                                                &times;
                                            </Button>
                                            {`Digital Media: ${i + 1}`}
                                        </h4>
                                    </div>
                                    {Object.entries(value).map(
                                        ([key, value]) => {
                                            var titles = {
                                                name: "Name",
                                                length: "Length",
                                                location: "Location",
                                            };
                                            if (
                                                Object.keys(titles).includes(
                                                    key
                                                )
                                            ) {
                                                return (
                                                    <FormGroup row key={key}>
                                                        <Label for={key} xs={2}>
                                                            {titles[key]}
                                                        </Label>
                                                        <Col xs={10}>
                                                            <Input
                                                                type="text"
                                                                id={key}
                                                                name={key}
                                                                placeholder={
                                                                    titles[
                                                                        key
                                                                    ] + "..."
                                                                }
                                                                value={value}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    changeValue(
                                                                        e,
                                                                        "digitalInfo",
                                                                        i
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                );
                                            }
                                            return <Fragment key={key} />;
                                        }
                                    )}
                                </Fragment>
                            );
                        })}
                        <Button
                            onClick={() => {
                                addArr("digitalInfo");
                            }}
                            color="primary"
                            className="mr-3"
                        >
                            Add Digital Info Record
                        </Button>
                        {data.physicalInfo.map((value, i) => {
                            return (
                                <Fragment key={i}>
                                    <h4>
                                        <Button
                                            className="mr-2"
                                            color="danger"
                                            size="sm"
                                            onClick={(e) => {
                                                removeArr("physicalInfo", i);
                                            }}
                                        >
                                            &times;
                                        </Button>
                                        {`Physical Media: ${i + 1}`}
                                    </h4>
                                    {Object.entries(value).map(
                                        ([key, value]) => {
                                            var titles = {
                                                name: "Name",
                                                location: "Location",
                                                copiesHeld: "Copies Held",
                                            };
                                            if (
                                                Object.keys(titles).includes(
                                                    key
                                                )
                                            ) {
                                                return (
                                                    <FormGroup row key={key}>
                                                        <Label for={key} xs={2}>
                                                            {titles[key]}
                                                        </Label>
                                                        <Col xs={10}>
                                                            <Input
                                                                type={
                                                                    key ===
                                                                    "copiesHeld"
                                                                        ? "number"
                                                                        : "text"
                                                                }
                                                                id={key}
                                                                name={key}
                                                                placeholder={
                                                                    titles[
                                                                        key
                                                                    ] + "..."
                                                                }
                                                                value={value}
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    changeValue(
                                                                        e,
                                                                        "physicalInfo",
                                                                        i
                                                                    );
                                                                }}
                                                            />
                                                        </Col>
                                                    </FormGroup>
                                                );
                                            }
                                            return <Fragment key={key} />;
                                        }
                                    )}
                                </Fragment>
                            );
                        })}
                        <Button
                            onClick={() => {
                                addArr("physicalInfo");
                            }}
                            color="primary"
                        >
                            Add Physical Info Record
                        </Button>
                    </Form>
                ) : (
                    <Spinner color="primary" />
                )}
            </Container>
        </div>
    );
};

export default LogForm;
