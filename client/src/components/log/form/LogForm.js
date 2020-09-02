import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Spinner, Form, Input, Alert, Button, FormGroup } from "reactstrap";
import { Formik } from "formik";
import {
    title,
    submitBtn,
    movieBlank,
    blankForm,
    display,
    selectorsFormat,
    buttonBlanks,
} from "./FormData.json";
import FormSection from "./FormSection";
import FormMSection from "./FormMSection";
import BackButton from "../../BackButton";
import OldLogInfo from "../logActions/OldLogInfo";
import { classHeading, asyncForEach } from "../../../config";

const LogForm = (props) => {
    const { upload, data = blankForm, type, errors, oldLog } = props;
    const [selectors, updateSelectors] = useState({});
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
                            [key]: ["", ...result.map((v) => v.name)],
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
    if (loading) return <Spinner color="primary" />;
    return (
        <Fragment>
            <Formik initialValues={data} onSubmit={upload}>
                {({ handleReset, handleSubmit, isSubmitting, values, setFieldValue }) => (
                    <Form onReset={handleReset} onSubmit={handleSubmit}>
                        <div className={classHeading}>
                            <BackButton back />
                            <h1>{title[type]}</h1>
                            <div className="ml-auto d-flex align-items-center">
                                {oldLog || values.oData ? (
                                    <OldLogInfo data={oldLog || values.oData} className="mr-1" />
                                ) : null}
                                <Input
                                    type="select"
                                    onChange={(e) => {
                                        var formType = e.target.value;
                                        if (formType === "movie")
                                            setFieldValue("movieInfo", movieBlank);
                                        else if (formType === "media")
                                            setFieldValue("movieInfo", undefined);
                                    }}
                                    className="w-auto"
                                    value={values.movieInfo ? "movie" : "media"}
                                >
                                    <option value="media">Media</option>
                                    <option value="movie">Movie</option>
                                </Input>
                            </div>
                        </div>
                        {errors.length > 0
                            ? errors.map(({ msg }, i) => (
                                  <Alert key={i} color="danger">
                                      {msg}
                                  </Alert>
                              ))
                            : null}
                        {Object.entries(display).map(([key, { type, name, format, button }]) => {
                            var fData = key === "main" ? values : values[key];
                            if (type === "single" && fData !== undefined) {
                                return (
                                    <Fragment key={key}>
                                        {name ? <h3 className="mb-3">{name}</h3> : null}
                                        <FormSection
                                            {...{
                                                format,
                                                selectors: selectors[key],
                                                section: key,
                                            }}
                                        />
                                    </Fragment>
                                );
                            } else if (type === "multi" && fData !== undefined) {
                                return (
                                    <FormMSection
                                        {...{
                                            name,
                                            format,
                                            button,
                                            blanks: buttonBlanks,
                                            values: values[key],
                                            folder: values.folder,
                                            selectors: selectors[key],
                                            section: key,
                                        }}
                                        key={key}
                                    />
                                );
                            }
                            return null;
                        })}
                        <FormGroup className="mt-3">
                            <Button color="primary" type="submit" disabled={isSubmitting}>
                                {submitBtn[type]}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Fragment>
    );
};

export default LogForm;
