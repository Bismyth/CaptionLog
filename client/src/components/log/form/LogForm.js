import React, { useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { Spinner, Form, Input, Container, Alert, Button, FormGroup } from "reactstrap";
import "../fade.css";
import {
    digBlank,
    digBlankCV,
    physBlank,
    movieBlank,
    blankForm,
    format,
    config,
    selectorsFormat,
} from "./FormData.json";
import { useHistory, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import FormSection from "./FormSection";
import FormMSection from "./FormMSection";
import BackButton from "../../BackButton";
import { classHeading, asyncForEach } from "../../../config";

const LogForm = ({
    match: {
        params: { id },
    },
}) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const token = useSelector((state) => state.auth.token);
    const [edit, setEdit] = useState(false);
    const [selectors, updateSelectors] = useState({});
    const [data, setData] = useState(blankForm);
    const [loading, setLoading] = useState([false, false]);
    const [sLoading, setSLoading] = useState(false);
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    useEffect(() => {
        setLoading((l) => {
            return [true, l[1]];
        });
        if (id && token) {
            var config = {
                method: "get",
                url: `/api/logs/${id}`,
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
            };
            axios(config)
                .then((result) => {
                    if (result.data) {
                        setErrors([]);
                        setData(result.data);
                        setEdit(true);
                    } else {
                        setErrors([{ msg: "No Log with that ID found" }]);
                    }
                    setLoading((l) => {
                        return [false, l[1]];
                    });
                })
                .catch((error) => {
                    history.goBack();
                });
        }
    }, [id, token, history]);

    useEffect(() => {
        const fetchSelectors = async () => {
            setLoading((l) => {
                return [l[0], true];
            });
            await asyncForEach(selectorsFormat, async (selector) => {
                var config = {
                    method: "get",
                    url: `/api/lists/${selector.source}`,
                    headers: {
                        "Content-type": "application/json",
                        "x-auth-token": token,
                    },
                };
                var result;
                try {
                    result = await axios(config);
                } catch (e) {
                    history.goBack();
                }

                const [head, key] = selector.loc.split("/");
                updateSelectors((v) => {
                    return {
                        ...v,
                        [head]: {
                            ...v[head],
                            [key]: [
                                {
                                    _id: "invalid",
                                    name: format[head][key].name + "...",
                                },
                                ...result.data,
                            ],
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
    }, [token, history]);
    const changeFormType = (e) => {
        var formType = e.target.value;
        setData((d) => {
            if (formType === "movie") return { movieInfo: movieBlank, ...d };
            else if (formType === "media") {
                var { movieInfo, ...nData } = d;
                return nData;
            }
        });
    };
    const changeValue = useCallback((e, level, index) => {
        const { name, value } = e.target;
        setData((d) => {
            if (level === "main") return { ...d, [name]: value };
            else if (index === undefined)
                return {
                    ...d,
                    [level]: { ...d[level], [name]: value },
                };
            else
                return {
                    ...d,
                    [level]: d[level].map((v, i) => (i === index ? { ...v, [name]: value } : v)),
                };
        });
    }, []);
    const selectFile = useCallback(
        (file, i) => {
            changeValue({ target: { name: "location", value: file } }, "digitalInfo", i);
        },
        [changeValue]
    );
    const addArr = useCallback((key, ex) => {
        var insert = {};
        if (ex === "CV") insert = digBlankCV;
        else insert = { digitalInfo: digBlank, physicalInfo: physBlank }[key];
        setData((d) => {
            return {
                ...d,
                [key]: [...d[key], insert],
            };
        });
    }, []);
    const removeArr = useCallback((key, index) => {
        setData((d) => {
            return {
                ...d,
                [key]: d[key].filter((v, i) => {
                    return index !== i;
                }),
            };
        });
    }, []);
    const submit = (e) => {
        setSLoading(true);
        var config = {
            method: edit ? "put" : "post",
            url: `/api/logs`,
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
                    <div className={classHeading}>
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
                        <FormSection
                            data={data}
                            format={format.main}
                            update={changeValue}
                            selectors={selectors.main}
                            section="main"
                        />

                        {data.movieInfo ? (
                            <Fragment>
                                <h3 className="mb-3">Movie Info</h3>{" "}
                                <FormSection
                                    data={data.movieInfo}
                                    format={format.movieInfo}
                                    update={changeValue}
                                    selectors={selectors.movieInfo}
                                    section="movieInfo"
                                />
                            </Fragment>
                        ) : (
                            <Fragment />
                        )}
                        <h3 className="mb-3">Copyright Info</h3>
                        <FormSection
                            data={data.copyrightInfo}
                            format={format.copyrightInfo}
                            update={changeValue}
                            selectors={selectors.copyrightInfo}
                            section="copyrightInfo"
                        />
                        <FormMSection
                            data={data.digitalInfo}
                            config={config.digitalInfo}
                            update={changeValue}
                            array={{ add: addArr, rm: removeArr }}
                            selectFile={selectFile}
                            selectors={selectors.digitalInfo}
                        />
                        <FormMSection
                            data={data.physicalInfo}
                            config={config.physicalInfo}
                            update={changeValue}
                            array={{ add: addArr, rm: removeArr }}
                            selectors={selectors.physicalInfo}
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