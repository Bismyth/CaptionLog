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

const returnNewObjectOnlyValidKeys = (obj, validKeys) => {
    const newObject = {};
    Object.keys(obj).forEach((key) => {
        if (validKeys.includes(key)) newObject[key] = obj[key];
    });
    return newObject;
};

const FileAddon = (fName, type) => {
    if (type !== "fileSelect") return null;
    return (
        <InputGroupAddon addonType="prepend">
            <InputGroupText>
                <SelectFile sName={fName} />
            </InputGroupText>
        </InputGroupAddon>
    );
};

const FormSection = ({ format, section, selectors = {}, index, uniqueInfo, optional }) => {
    var sName = "";
    if (index !== undefined) {
        sName = `${section}.${index}.`;
        format = { ...format, ...returnNewObjectOnlyValidKeys(optional, uniqueInfo) };
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
                                            <FileAddon type={type} fName={fName} />
                                            <Input
                                                {...field}
                                                placeholder={name + "..."}
                                                type={type === "fileSelect" ? "text" : type}
                                                invalid={!!(meta.touched && meta.error)}
                                                tag={tag}
                                                children={children}
                                                checked={type === "checkbox" && field.value}
                                            />
                                        </InputGroup>
                                        <FormFeedback>{meta.error}</FormFeedback>
                                    </Col>
                                </FormGroup>
                            );
                        }}
                    </Field>
                );
            })}
        </Fragment>
    );
};

export default React.memo(FormSection);
