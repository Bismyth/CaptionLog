import React, { useState } from "react";
import { Nav, NavItem, NavLink, TabContent, TabPane, Tooltip } from "reactstrap";
import captionRoom from "../captionRoom.jpg";
import { ReactComponent as Contact } from "../icons/contact_mail-black-24dp.svg";
import { classHeading } from "../config";
import data from "./copyInfo.json";
const Home = () => {
    const [activeTab, setActiveTab] = useState("0");
    const [tooltip, setTooltip] = useState({});
    const toggle = (e) => {
        var tab = data.findIndex((x) => x.name === e.target.text).toString();
        if (activeTab !== tab) setActiveTab(tab);
    };
    const tToggle = (e) => {
        const tar = e.target.closest("a") || e.target.closest("svg");
        setTooltip((v) => {
            return {
                ...v,
                [tar.id]: !v[tar.id],
            };
        });
    };
    return (
        <div>
            <div className={`${classHeading} mb-2`}>
                <h1>Captioning Information</h1>
                <a className="ml-auto" id="contact" href="mailto:lisa.june@education.wa.edu.au">
                    <Contact
                        className="w-auto link-arrow contactBtn"
                        style={{ height: "50px", fill: "var(--sBlue)" }}
                    />
                </a>
                <Tooltip target="contact" toggle={tToggle} isOpen={tooltip["contact"]}>
                    Contact the Captioning Office
                </Tooltip>
            </div>
            <img src={captionRoom} className="topImage mb-2" alt="Caption Room" />
            <Nav tabs className="mb-2 justify-content-center tabHome">
                {data.map((v, i) => {
                    return (
                        <NavItem key={i}>
                            <h5 className="mb-0">
                                <NavLink
                                    className={
                                        "cursor-pointer " +
                                        (activeTab === i.toString() ? "active" : "")
                                    }
                                    onClick={toggle}
                                >
                                    {v.name}
                                </NavLink>
                            </h5>
                        </NavItem>
                    );
                })}
            </Nav>
            <TabContent activeTab={activeTab}>
                {data.map((v, i) => (
                    <TabPane tabId={i.toString()} key={i} style={{ fontSize: "1.1rem" }}>
                        {typeof v.text === "object"
                            ? v.text.map((v, i) => (
                                  <span key={i}>
                                      <i>{v.title}</i>
                                      <p>{v.body}</p>
                                  </span>
                              ))
                            : v.text.split("\n").map((v, i) => (
                                  <p className="mb-4" key={i}>
                                      {v}
                                  </p>
                              ))}
                    </TabPane>
                ))}
            </TabContent>
        </div>
    );
};

export default Home;
