import React, { useState, Fragment, useEffect } from "react";
import {
    Modal,
    ModalHeader,
    Spinner,
    Breadcrumb,
    BreadcrumbItem,
    ListGroup,
    ListGroupItem,
    ModalBody,
    Button,
    ModalFooter,
} from "reactstrap";
import axios from "axios";

import { useQuery } from "react-query";

import { getIn, connect } from "formik";
import { ReactComponent as EmailBtn } from "../../../icons/contact_mail-black-24dp.svg";

const Email = () => {
    const folder = getIn(formik.values.folder) || "";
    const change = getIn(formik.handleChange);
    const [folderChain, setFolderChain] = useState(
        folder.split("/").map((v, i, arr) => {
            return {
                id: v === "" ? "/" : arr.slice(0, i + 1).join("/"),
                name: v === "" ? "Content" : v,
                isDir: true,
            };
        })
    );
    useEffect(() => {
        setCurrentDIR(folder || "/");
    }, [folder]);
    const [modal, setModal] = useState(false);
    const toggle = (e) => {
        setModal(!modal);
    };

    return (
        <Fragment>
            <EmailBtn alt="Email" onClick={toggle} className="link-arrow" />
            <Modal isOpen={modal} toggle={toggle} autoFocus={false} size="lg">
                <ModalHeader toggle={toggle}>Send Email</ModalHeader>

                <ModalBody></ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={sendEmail}>
                        Send Email
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default Email;
