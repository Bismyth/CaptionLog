import React, { Fragment } from "react";
import { FormGroup, Label, Col, Input } from "reactstrap";

const updateTextArea = (e) => {
    e.target.style.height = "1px";
    e.target.style.height = e.target.scrollHeight + "px";
};

const FormSection = ({ data, format, update, section, selectors, index }) => {
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
                                if (type === "textarea") updateTextArea(e);
                                update(e, section, index);
                            }}
                            onFocus={(e) => {
                                if (type === "textarea") updateTextArea(e);
                            }}
                            children={
                                Object.keys(selectors || {}).includes(key)
                                    ? selectors[key].map(({ _id, name }) => (
                                          <option key={_id} value={_id === "invalid" ? "" : name}>
                                              {name}
                                          </option>
                                      ))
                                    : null
                            }
                            className={type === "textarea" ? "overflow-hidden" : ""}
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
