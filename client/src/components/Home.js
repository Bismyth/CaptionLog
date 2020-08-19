import React, { useState } from "react";
import { Container, Button, Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import captionRoom from "../captionRoom.jpg";
import { classHeading } from "../config";
import data from "./copyInfo.json";
const Home = () => {
    const [activeTab, setActiveTab] = useState("0");
    const toggle = (e) => {
        var tab = data.findIndex((x) => x.name === e.target.text).toString();
        if (activeTab !== tab) setActiveTab(tab);
    };
    return (
        <Container className="content">
            <div className={`${classHeading} mb-2`}>
                <h1>Captioning Information</h1>
                <Button
                    className="ml-auto"
                    color="primary"
                    href="mailto:lisa.june@education.wa.edu.au"
                >
                    Contact the Captioning Office
                </Button>
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
        </Container>
    );
};

export default Home;
