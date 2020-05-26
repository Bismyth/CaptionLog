import React, { useState, useEffect, Fragment } from "react";
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
} from "reactstrap";
import "./fade.css";

const NewLog = () => {
    const blankForm = {
        title: undefined,
        year: undefined,
        description: undefined,
        genre: undefined,
        copyrightInfo: {
            teacherName: undefined,
            captionSource: undefined,
            dateOfCompletion: undefined,
            videoSource: undefined,
            originalLocation: undefined,
        },
        digitalInfo: [
            {
                name: undefined,
                length: undefined,
                location: undefined,
            },
        ],
        physicalInfo: [
            {
                name: undefined,
                location: undefined,
                copiesHeld: undefined,
            },
        ],
    };
    const [data, setData] = useState(blankForm);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const result = await axios("/api/logs/data");
            setData(result.data);
            setLoading(false);
        };
        fetchData();
    }, []);
    const changeValue = (e, level, index) => {
        console.log(`${e.target.name} : ${e.target.value}, ${level}, ${index}`);
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
        setData({ ...data, [key]: [...data[key], blankForm[key][0]] });
    };
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
            <Container className="content">
                <h1 className="mb-4">New Log</h1>
                {!loading ? (
                    <Form>
                        {Object.entries(data).map(([key, value]) => {
                            var titles = {
                                title: "Title",
                                year: "Year",
                                description: "Description",
                            };
                            if (
                                ["title", "year", "description"].includes(key)
                            ) {
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
                                return (
                                    <FormGroup row key={key}>
                                        <Label for={key} xs={2}>
                                            {titles[key]}
                                        </Label>
                                        <Col xs={10}>
                                            <Input
                                                type={
                                                    key === "dateOfCompletion"
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
                                                                titles[key] +
                                                                "..."
                                                            }
                                                            value={value}
                                                            onChange={(e) => {
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
                                                                titles[key] +
                                                                "..."
                                                            }
                                                            value={value}
                                                            onChange={(e) => {
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

export default NewLog;
