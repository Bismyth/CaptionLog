import React, { useState, useEffect, Fragment, useCallback } from "react";
import axios from "axios";
import { Spinner, Form, Input, Alert, Button, FormGroup } from "reactstrap";
import "../fade.css";
import {
    title,
    submitBtn,
    digBlank,
    digBlankCV,
    physBlank,
    movieBlank,
    blankForm,
    format,
    config,
    selectorsFormat,
} from "./FormData.json";
import FormSection from "./FormSection";
import FormMSection from "./FormMSection";
import BackButton from "../../BackButton";
import OldLogInfo from "../actionButtons/OldLogInfo";
import { classHeading, asyncForEach } from "../../../config";

const LogForm = (props) => {
    const { upload, data: idata = blankForm, type, sLoading, errors, oldLog } = props;
    const [selectors, updateSelectors] = useState({});
    const [data, setData] = useState(idata);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchSelectors = async () => {
            setLoading(true);
            await asyncForEach(selectorsFormat, async (selector) => {
                var config = {
                    method: "get",
                    url: `/api/lists/${selector.source}`,
                };
                const { data: result } = await axios(config);
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
                                ...result,
                            ],
                        },
                    };
                });
            });
            setLoading(false);
        };
        try {
            fetchSelectors();
        } catch (e) {
            console.error(e);
        }
    }, []);
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
    if (loading) return <Spinner color="primary" />;
    return (
        <Fragment>
            <div className={classHeading}>
                <BackButton className="mr-1" />
                <h1>{title[type]}</h1>
                <div className="ml-auto d-flex align-items-center">
                    {oldLog || data.oData ? (
                        <OldLogInfo data={oldLog || data.oData} className="mr-1" />
                    ) : null}
                    <Input type="select" onChange={changeFormType} className="w-auto">
                        <option value="media">Media</option>
                        <option value="movie">Movie</option>
                    </Input>
                </div>
            </div>
            <Form>
                {errors.length > 0
                    ? errors.map(({ msg }, i) => (
                          <Alert key={i} color="danger">
                              {msg}
                          </Alert>
                      ))
                    : null}
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
                ) : null}
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
                    <Button
                        color="primary"
                        onClick={() => {
                            upload(data);
                        }}
                        disabled={sLoading}
                    >
                        {submitBtn[type]}
                    </Button>
                </FormGroup>
            </Form>
        </Fragment>
    );
};

export default LogForm;
