import React, { Fragment } from "react";

import { Field } from "formik";
import {
    Input,
    FormGroup,
    Label,
    FormFeedback,
    Col,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
} from "reactstrap";
import SelectFile from "./SelectFile";
import TextareaAutosize from "react-autosize-textarea/lib";

const FormSection = ({ format, section, selectors = {}, index }) => {
    var sName = section === "main" ? "" : section + ".";
    if (index !== undefined) {
        sName += `${index}.`;
    }
    return (
        <Fragment>
            {Object.entries(format).map(([key, { name, type }]) => {
                const fName = sName + key;
                const tag = type === "textarea" ? TextareaAutosize : null;
                const children = selectors[key]
                    ? selectors[key].map((v) => (
                          <option key={v} value={v}>
                              {v || name + "..."}
                          </option>
                      ))
                    : null;
                if (type === "fileSelect") {
                    return (
                        <Field name={fName} id={fName} key={key}>
                            {({ field, meta }) => {
                                return (
                                    <FormGroup row>
                                        <Label for={fName} xs={2}>
                                            {name}
                                        </Label>
                                        <Col xs={10}>
                                            <InputGroup>
                                                <InputGroupAddon addonType="prepend">
                                                    <InputGroupText>
                                                        <SelectFile sName={fName} />
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                                <Input
                                                    {...field}
                                                    placeholder={name + "..."}
                                                    type={"text"}
                                                    invalid={!!(meta.touched && meta.error)}
                                                />
                                            </InputGroup>
                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                );
                            }}
                        </Field>
                    );
                } else {
                    return (
                        <Field name={fName} id={fName} key={key}>
                            {({ field, meta }) => {
                                if (field.value === undefined) return null;
                                return (
                                    <FormGroup row>
                                        <Label for={fName} xs={2}>
                                            {name}
                                        </Label>
                                        <Col xs={10}>
                                            <Input
                                                {...field}
                                                placeholder={name + "..."}
                                                type={type}
                                                invalid={!!(meta.touched && meta.error)}
                                                tag={tag}
                                                children={children}
                                            />
                                            <FormFeedback>{meta.error}</FormFeedback>
                                        </Col>
                                    </FormGroup>
                                );
                            }}
                        </Field>
                    );
                }
            })}
        </Fragment>
    );
};

export default React.memo(FormSection);
