import React, { Fragment } from "react";
import { FormGroup, Label, Col, Input } from "reactstrap";

const FormSection = (props) => {
    const { data, format, update, uniqueID } = props;
    return (
        <Fragment>
            {Object.entries(format).map(([key, { name, type, values }]) => (
                <FormGroup row key={key}>
                    <Label for={key} xs={2}>
                        {name}
                    </Label>
                    <Col xs={10}>
                        {values !== undefined ? (
                            <Input
                                type={type}
                                id={uniqueID ? `${uniqueID.sig}-${key}-${uniqueID.index}` : key}
                                name={key}
                                value={data[key]}
                                onChange={update}
                            >
                                {format[key].values.map(({ _id, name }) => (
                                    <option key={_id} value={_id === "invalid" ? "" : name}>
                                        {name}
                                    </option>
                                ))}
                            </Input>
                        ) : (
                            <Input
                                type={type}
                                id={uniqueID ? `${uniqueID.sig}-${key}-${uniqueID.index}` : key}
                                name={key}
                                placeholder={name + "..."}
                                value={data[key]}
                                onChange={update}
                            />
                        )}
                    </Col>
                </FormGroup>
            ))}
        </Fragment>
    );
};

export default FormSection;
