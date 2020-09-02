import React, { Fragment, useState } from "react";
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import FormSection from "./FormSection";
import SelectFile from "./SelectFile";
import { classHeading, keepLikeValues } from "../../../config";

import { FieldArray } from "formik";
const FormMSection = ({ section, selectors, name, format, button, blanks, values, folder }) => {
    const [isOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!isOpen);
    return (
        <Fragment>
            <FieldArray
                name={section}
                render={(arrayHelpers) => (
                    <Fragment>
                        {values.map((value, index) => {
                            var forma = keepLikeValues(format, value);
                            return (
                                <Fragment key={index}>
                                    <div className={classHeading}>
                                        <Button
                                            className="mr-2"
                                            color="danger"
                                            size="sm"
                                            onClick={() => arrayHelpers.remove(index)}
                                        >
                                            &times;
                                        </Button>
                                        <h4 className="w-100">{`${name} ${index + 1}`}</h4>
                                        {section === "digitalInfo" &&
                                        value.location !== undefined ? (
                                            <SelectFile index={index} folder={folder} />
                                        ) : null}
                                    </div>
                                    <FormSection
                                        format={forma}
                                        selectors={selectors}
                                        index={index}
                                        section={section}
                                    />
                                </Fragment>
                            );
                        })}
                        {button.length > 1 ? (
                            <ButtonDropdown isOpen={isOpen} toggle={toggle}>
                                <Button
                                    id="caret"
                                    color="primary"
                                    onClick={() => {
                                        arrayHelpers.push(blanks[button[0].blank]);
                                    }}
                                >
                                    {button[0].name}
                                </Button>
                                <DropdownToggle caret color="primary" className="mr-3" />
                                <DropdownMenu>
                                    {button.map(({ name, blank }) => {
                                        return (
                                            <DropdownItem
                                                onClick={() => {
                                                    arrayHelpers.push(blanks[blank]);
                                                }}
                                                key={name}
                                            >
                                                {name}
                                            </DropdownItem>
                                        );
                                    })}
                                </DropdownMenu>
                            </ButtonDropdown>
                        ) : (
                            <Button
                                color="primary"
                                className="mr-3"
                                onClick={() => {
                                    arrayHelpers.push(blanks[button[0].blank]);
                                }}
                            >
                                {button[0].name}
                            </Button>
                        )}
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default React.memo(FormMSection);
