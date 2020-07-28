import React, { Fragment } from "react";
import { FormGroup, Label, Col, Input } from "reactstrap";
const FormSection = (props) => {
    const { data, format, update } = props;
    return (
        <Fragment>
            {Object.entries(data).map(([key, value]) => {
                if (Object.keys(format).includes(key)) {
                    return (
                        <FormGroup row key={key}>
                            <Label for={key} xs={2}>
                                {format[key].name}
                            </Label>
                            <Col xs={10}>
                                {format[key].values !== undefined ? (
                                    <Input
                                        type={format[key].type}
                                        id={key}
                                        name={key}
                                        value={value}
                                        onChange={update}
                                    >
                                        {format[key].values.map(
                                            ({ _id, name }) => (
                                                <option
                                                    key={_id}
                                                    value={
                                                        _id === "invalid"
                                                            ? ""
                                                            : name
                                                    }
                                                >
                                                    {name}
                                                </option>
                                            )
                                        )}
                                    </Input>
                                ) : (
                                    <Input
                                        type={format[key].type}
                                        id={key}
                                        name={key}
                                        placeholder={format[key].name + "..."}
                                        value={value}
                                        onChange={update}
                                    />
                                )}
                            </Col>
                        </FormGroup>
                    );
                }
                return <Fragment key={key} />;
            })}
        </Fragment>
    );
};

export default FormSection;
