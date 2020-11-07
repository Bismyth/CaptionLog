import React, { useState, useEffect, Fragment } from "react";
import axios from "axios";
import { Spinner, Alert, Button, FormGroup } from "reactstrap";
import { Formik, Form } from "formik";
import { title, submitBtn, blankForm, display, selectorsFormat, digBlank } from "./FormData.json";
import FormSection from "./FormSection";
import FormMSection from "./FormMSection";
import BackButton from "../../BackButton";
import OldLogInfo from "../logActions/OldLogInfo";
import { classHeading, asyncForEach } from "../../../config";
import * as Yup from "yup";

const LogSchema = Yup.object().shape({
    title: Yup.string().required("Please add a title."),
    description: Yup.string(),
    genre: Yup.string(),
    folder: Yup.string(),
    year: Yup.number(),
    rating: Yup.string(),
    teacherName: Yup.string(),
    captionSource: Yup.string(),
    dateOfCompletion: Yup.string(),
    videoSource: Yup.string(),
    originalLocation: Yup.string(),
    digitalInfo: Yup.array(
        Yup.object({
            name: Yup.string(),
            length: Yup.string(),
        })
    ),
});

const LogForm = (props) => {
    const { upload, data = blankForm, type, errors, oldLog } = props;
    const [selectors, updateSelectors] = useState({});
    const [loading, setLoading] = useState(false);
    const [uniqueInfo, setUniqueInfo] = useState(["rating", "captionSource", "videoSource"]);
    useEffect(() => {
        const fetchSelectors = async () => {
            setLoading(true);
            await asyncForEach(selectorsFormat, async (selector) => {
                var config = {
                    method: "get",
                    url: `/api/lists/${selector}`,
                };
                const { data: result } = await axios(config);

                updateSelectors((v) => {
                    return {
                        ...v,
                        [selector]: ["", ...result.map((v) => v.name)],
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
    console.log("bigboy");
    return (
        <Fragment>
            <Formik initialValues={data} validationSchema={LogSchema} onSubmit={upload}>
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form>
                        <div className={classHeading}>
                            <BackButton back />
                            <h1>{title[type]}</h1>
                            <div className="ml-auto d-flex align-items-center">
                                {oldLog || values.oData ? (
                                    <OldLogInfo data={oldLog || values.oData} className="mr-1" />
                                ) : null}
                            </div>
                        </div>
                        {errors.length > 0
                            ? errors.map(({ msg }, i) => (
                                  <Alert key={i} color="danger">
                                      {msg}
                                  </Alert>
                              ))
                            : null}
                        {Object.entries(display).map(
                            ([key, { type, name, format, tabDefault, optional }]) => {
                                const uni = {
                                    format,
                                    selectors,
                                    section: key,
                                    uniqueInfo,
                                };
                                if (type === "single") {
                                    return (
                                        <Fragment key={key}>
                                            {name ? <h3 className="mb-3">{name}</h3> : null}
                                            <FormSection {...uni} />
                                        </Fragment>
                                    );
                                } else if (type === "multi") {
                                    return (
                                        <FormMSection
                                            {...{
                                                ...uni,
                                                name,
                                                tabDefault,
                                                blank: digBlank,
                                                valuesLength: values[key].length,
                                                optional,
                                            }}
                                            key={key}
                                        />
                                    );
                                }
                                return null;
                            }
                        )}
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
