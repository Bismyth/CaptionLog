import React, { Fragment, useState } from "react";
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import FormSection from "./FormSection";
import SelectFile from "./SelectFile";
import { classHeading, keepLikeValues } from "../../../config";
const FormMSection = ({ data, update, array, format, selectors, rootFolder, name, button }) => {
    const [isOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!isOpen);
    return (
        <Fragment>
            {data.map((value, i) => {
                return (
                    <Fragment key={i}>
                        <div className={classHeading}>
                            <Button
                                className="mr-2"
                                color="danger"
                                size="sm"
                                onClick={(e) => {
                                    array.rm(array.name, i);
                                }}
                            >
                                &times;
                            </Button>
                            <h4 className="w-100">{`${name} ${i + 1}`}</h4>
                            {value.location !== undefined && rootFolder !== undefined ? (
                                <SelectFile
                                    style={{ minWidth: "fit-content" }}
                                    update={update}
                                    index={i}
                                    folder={rootFolder}
                                />
                            ) : null}
                        </div>
                        <FormSection
                            data={value}
                            format={keepLikeValues(format, value)}
                            update={update}
                            selectors={selectors}
                            index={i}
                            section={array.name}
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
                            array.add(array.name);
                        }}
                    >
                        {button[0].name}
                    </Button>
                    <DropdownToggle caret color="primary" className="mr-3" />
                    <DropdownMenu>
                        {button.map(({ name, action }) => {
                            return (
                                <DropdownItem
                                    onClick={() => array.add(array.name, action)}
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
                        array.add(array.name);
                    }}
                >
                    {button[0].name}
                </Button>
            )}
        </Fragment>
    );
};

export default FormMSection;
