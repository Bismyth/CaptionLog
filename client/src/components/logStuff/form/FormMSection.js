import React, { Fragment, useState } from "react";
import { Button, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from "reactstrap";
import FormSection from "./FormSection";
import SelectFile from "./SelectFile";
const FormMSection = (props) => {
    const { data, config, update, array, selectFile } = props;
    const [isOpen, setOpen] = useState(false);
    const toggle = () => setOpen(!isOpen);
    return (
        <Fragment>
            {data.map((value, i) => {
                return (
                    <Fragment key={i}>
                        <div className="d-flex align-items-center mb-2">
                            <Button
                                className="mr-2"
                                color="danger"
                                size="sm"
                                onClick={(e) => {
                                    array.rm(config.details.arrName, i);
                                }}
                            >
                                &times;
                            </Button>
                            <h4 className="w-100">{`${config.details.name} ${i + 1}`}</h4>
                            {selectFile && value.location !== undefined ? (
                                <SelectFile
                                    style={{ width: "10%" }}
                                    selectedFile={selectFile}
                                    index={i}
                                />
                            ) : (
                                <Fragment />
                            )}
                        </div>
                        <FormSection
                            data={value}
                            format={config.format}
                            update={(e) => {
                                update(e, config.details.arrName, i);
                            }}
                            uniqueID={{ sig: config.details.arrName[0], index: i }}
                        />
                    </Fragment>
                );
            })}
            {config.details.button.length > 1 ? (
                <ButtonDropdown isOpen={isOpen} toggle={toggle}>
                    <Button
                        id="caret"
                        color="primary"
                        onClick={() => {
                            array.add(config.details.arrName);
                        }}
                    >
                        {config.details.button[0].name}
                    </Button>
                    <DropdownToggle caret color="primary" className="mr-3" />
                    <DropdownMenu>
                        {config.details.button.map(({ name, action }) => {
                            return (
                                <DropdownItem
                                    onClick={() => array.add(config.details.arrName, action)}
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
                        array.add(config.details.arrName);
                    }}
                >
                    {config.details.button[0].name}
                </Button>
            )}
        </Fragment>
    );
};

export default FormMSection;
