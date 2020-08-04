import React, { Fragment } from "react";
import { FormGroup, Label, Col, Input } from "reactstrap";
import TextareaAutosize from "react-autosize-textarea";

const FormSection = ({ data, format, update, section, selectors = {}, index }) => {
    return (
        <Fragment>
            {Object.entries(format).map(([key, { name, type }]) => (
                <FormGroup row key={key}>
                    <Label for={key} xs={2}>
                        {name}
                    </Label>
                    <Col xs={10}>
                        <Input
                            type={type}
                            id={`${section[0]}-${key}-${index}`}
                            name={key}
                            value={data[key]}
                            placeholder={name + "..."}
                            onChange={(e) => {
                                update(e, section, index);
                            }}
                            children={
                                Object.keys(selectors).includes(key)
                                    ? selectors[key].map(({ _id, name }) => (
                                          <option key={_id} value={_id === "invalid" ? "" : name}>
                                              {name}
                                          </option>
                                      ))
                                    : null
                            }
                            tag={type === "textarea" ? TextareaAutosize : undefined}
                        />
                    </Col>
                </FormGroup>
            ))}
        </Fragment>
    );
};

export default React.memo(FormSection, ({ data: pdata, format: pformat }, { data: ndata }) => {
    return Object.keys(pformat).every((v) => {
        return pdata[v] === ndata[v];
    });
});
