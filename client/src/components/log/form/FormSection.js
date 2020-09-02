import React, { Fragment } from "react";
import { FormGroup, Label, Col, Input } from "reactstrap";
import TextareaAutosize from "react-autosize-textarea";
import { Field, ErrorMessage } from "formik";

const FormSection = ({ format, section, selectors = {}, index }) => {
    var sName;
    if (index === undefined) {
        sName = section === "main" ? "" : section + ".";
    } else {
        sName = `${section}.${index}.`;
    }
    return (
        <Fragment>
            {Object.entries(format).map(([key, { name, type }]) => {
                return (
                    <FormGroup row key={key}>
                        <Label for={key} xs={2}>
                            {name}
                        </Label>
                        <Col xs={10}>
                            <Field
                                type={type}
                                name={sName + key}
                                id={sName + key}
                                placeholder={name + "..."}
                                as={Input}
                                children={
                                    selectors[key]
                                        ? selectors[key].map((v) => (
                                              <option key={v} value={v}>
                                                  {v || name + "..."}
                                              </option>
                                          ))
                                        : null
                                }
                                tag={type === "textarea" ? TextareaAutosize : undefined}
                            />
                            <ErrorMessage name={sName + key} component="div" />
                        </Col>
                    </FormGroup>
                );
            })}
        </Fragment>
    );
};

export default React.memo(FormSection);
