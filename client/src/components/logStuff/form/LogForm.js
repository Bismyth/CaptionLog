import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Spinner, Form, Input, Container, Alert, Button, FormGroup } from "reactstrap";
import "../fade.css";
import formData from "./FormData.json";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import FormSection from "./FormSection";
import FormMSection from "./FormMSection";
import BackButton from "../../BackButton";
const LogForm = (props) => {
    /*
        - Build out transferer
    */
    const { digBlank, digBlankCV, physBlank, blankForm, config, selectors } = formData;
    const [format, updateFormat] = useState(formData.format);
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const [edit, setEdit] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const [data, setData] = useState(blankForm);
    const [loading, setLoading] = useState([false, false]);
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const [sLoading, setSLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            setLoading((l) => {
                return [true, l[1]];
            });
            if (props.match.params.id && token) {
                var config = {
                    method: "get",
                    url: `${process.env.PUBLIC_URL}/api/logs/${props.match.params.id}`,
                    headers: {
                        "Content-type": "application/json",
                        "x-auth-token": token,
                    },
                };
                const result = await axios(config);
                if (result.data) {
                    setErrors([]);
                    setData(result.data);
                    setEdit(true);
                } else {
                    setErrors([{ msg: "No Log with that ID found" }]);
                }
            }
            setLoading((l) => {
                return [false, l[1]];
            });
        };
        fetchData();
    }, [props.match.params.id, token]);
    useEffect(() => {
        const fetchSelectors = async () => {
            setLoading((l) => {
                return [l[0], true];
            });
            await selectors.forEach(async (selector) => {
                var config = {
                    method: "get",
                    url: `${process.env.PUBLIC_URL}/api/lists/${selector.source}`,
                    headers: {
                        "Content-type": "application/json",
                        "x-auth-token": token,
                    },
                };
                const result = await axios(config);
                const [head, key] = selector.loc.split("/");
                updateFormat((v) => {
                    return {
                        ...v,
                        [head]: {
                            ...v[head],
                            [key]: {
                                ...v[head][key],
                                values: [
                                    {
                                        _id: "invalid",
                                        name: v[head][key].name + "...",
                                    },
                                    ...result.data,
                                ],
                            },
                        },
                    };
                });
            });
            setLoading((l) => {
                return [l[0], false];
            });
        };
        if (token) {
            fetchSelectors();
        }
    }, [token, selectors]);
    const changeFormType = (e) => {
        var formType = e.target.value;
        if (formType === "movie") {
            setData((d) => ({ movieInfo: { year: "", rating: "" }, ...d }));
        } else if (formType === "media") {
            const { movieInfo, ...nData } = data;
            setData(nData);
        }
    };
    const selectFile = (file, i) => {
        changeValue({ target: { name: "location", value: file } }, "digitalInfo", i);
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
    const addArr = (key, ex) => {
        var insert = {};
        if (ex === "CV") insert = digBlankCV;
        else insert = { digitalInfo: digBlank, physicalInfo: physBlank }[key];
        if (data.movieInfo !== undefined) {
            delete insert["name"];
        }
        setData({
            ...data,
            [key]: [...data[key], insert],
        });
    };
    const removeArr = (key, index) => {
        setData({
            ...data,
            [key]: data[key].filter((v, i) => {
                return index !== i;
            }),
        });
    };
    const submit = (e) => {
        setSLoading(true);
        var config = {
            method: edit ? "put" : "post",
            url: `${process.env.PUBLIC_URL}/api/logs`,
            headers: {
                "Content-type": "application/json",
                "x-auth-token": token,
            },
            data,
        };
        axios(config)
            .then((result) => {
                history.push(`/log/${result.data._id}`);
            })
            .catch((err) => {
                setSLoading(false);
                setErrors(err.response.data["errors"]);
            });
    };
    return (
        <Container className="content">
            {loading.every((v) => {
                return !v;
            }) ? (
                <Fragment>
                    {!loggedIn && loggedIn !== null ? <Redirect to="/logs" /> : <Fragment />}
                    <div className="d-flex align-items-center mb-2">
                        <BackButton className="mr-1" />
                        <h1>{edit ? "Edit Log" : "New Log"}</h1>
                        <Input type="select" onChange={changeFormType} className="ml-auto w-auto">
                            <option value="media">Media</option>
                            <option value="movie">Movie</option>
                        </Input>
                    </div>
                    <Form>
                        {errors.length > 0 ? (
                            errors.map(({ msg }, i) => (
                                <Alert key={i} color="danger">
                                    {msg}
                                </Alert>
                            ))
                        ) : (
                            <Fragment />
                        )}
                        <FormSection data={data} format={format.main} update={changeValue} />

                        {data.movieInfo ? (
                            <Fragment>
                                <h3 className="mb-3">Movie Info</h3>{" "}
                                <FormSection
                                    data={data.movieInfo}
                                    format={format.movieInfo}
                                    update={(e) => {
                                        changeValue(e, "movieInfo");
                                    }}
                                />
                            </Fragment>
                        ) : (
                            <Fragment />
                        )}
                        <h3 className="mb-3">Copyright Info</h3>
                        <FormSection
                            data={data.copyrightInfo}
                            format={format.copyrightInfo}
                            update={(e) => {
                                changeValue(e, "copyrightInfo");
                            }}
                        />
                        <FormMSection
                            data={data.digitalInfo}
                            config={config.digitalInfo}
                            update={changeValue}
                            array={{ add: addArr, rm: removeArr }}
                            selectFile={selectFile}
                        />
                        <FormMSection
                            data={data.physicalInfo}
                            config={config.physicalInfo}
                            update={changeValue}
                            array={{ add: addArr, rm: removeArr }}
                        />
                        <FormGroup className="mt-3">
                            <Button color="primary" onClick={submit} disabled={sLoading}>
                                {edit ? "Save" : "Submit"}
                            </Button>
                        </FormGroup>
                    </Form>
                </Fragment>
            ) : (
                <Spinner color="primary" />
            )}
        </Container>
    );
};

export default LogForm;
