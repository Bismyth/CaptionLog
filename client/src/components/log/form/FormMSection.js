import React, { Fragment, useState } from "react";
import { TabContent, Nav, NavItem, NavLink, TabPane } from "reactstrap";
import FormSection from "./FormSection";
import classnames from "classnames";

import { ReactComponent as AddBtn } from "../../../icons/add-black-24dp.svg";
import { ReactComponent as RemoveBtn } from "../../../icons/clear-black-24dp.svg";

import { FieldArray } from "formik";

const FormMSection = ({
    section,
    selectors,
    name,
    format,
    tabDefault,
    blank,
    valuesLength,
    optional,
    uniqueInfo,
}) => {
    const [activeTab, setActiveTab] = useState(valuesLength - 1);
    const toggle = (tab) => {
        if (activeTab !== tab) setActiveTab(tab);
    };
    return (
        <Fragment>
            <FieldArray
                name={section}
                render={(arrayHelpers) => (
                    <Fragment>
                        <Nav tabs>
                            {[...Array(valuesLength)].map((v, index) => (
                                <NavItem key={index}>
                                    <NavLink
                                        className={classnames(
                                            { active: activeTab === index },
                                            "cursor-pointer"
                                        )}
                                        onClick={() => {
                                            toggle(index);
                                        }}
                                        style={{ color: "#212529" }}
                                    >
                                        {index + 1}
                                        <RemoveBtn
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (index <= activeTab) {
                                                    toggle(activeTab - 1);
                                                }
                                                if (activeTab === 0 && valuesLength === 1) {
                                                    toggle(-1);
                                                }
                                                arrayHelpers.remove(index);
                                            }}
                                            className="tabBtn"
                                            style={{ marginLeft: ".5rem" }}
                                        />
                                    </NavLink>
                                </NavItem>
                            ))}
                            <NavItem>
                                <NavLink
                                    onClick={() => {
                                        var tBlank = blank;
                                        uniqueInfo.forEach((v) => {
                                            var tmp = document.getElementsByName(
                                                `digitalInfo.0.${v}`
                                            )[0];
                                            tBlank[v] = tmp ? tmp.value : "";
                                        });
                                        arrayHelpers.push(tBlank);
                                        toggle(valuesLength);
                                    }}
                                    className="cursor-pointer"
                                >
                                    <AddBtn className="tabBtn" />
                                </NavLink>
                            </NavItem>
                        </Nav>
                        <TabContent activeTab={activeTab}>
                            <TabPane tabId={-1}>
                                <h5>{tabDefault}</h5>
                            </TabPane>
                            {[...Array(valuesLength)].map((value, index) => (
                                <TabPane key={index} tabId={index}>
                                    <h4>{`${name} ${index + 1}`}</h4>
                                    <FormSection
                                        {...{
                                            format,
                                            optional,
                                            uniqueInfo,
                                            selectors,
                                            index,
                                            section,
                                        }}
                                    />
                                </TabPane>
                            ))}
                        </TabContent>
                    </Fragment>
                )}
            />
        </Fragment>
    );
};

export default React.memo(FormMSection);
