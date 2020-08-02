import React, { useState, useEffect, Fragment, useCallback } from "react";
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
import "../scroll.css";
import folderIcon from "../../../icons/folder-black-24dp.svg";
import backIcon from "../../../icons/keyboard_return-black-24dp.svg";
import { useSelector } from "react-redux";

const root = { id: "/", name: "Content", isDir: true };
const SelectFile = ({ selectedFile, index, style }) => {
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [folderChain, setFolderChain] = useState([root]);
    const [currentDIR, setCurrentDIR] = useState(root.id);
    const [fileSelected, setFileSelected] = useState("");
    const [modal, setModal] = useState(false);
    const token = useSelector((state) => state.auth.token);
    const toggle = useCallback(
        (e) => {
            setModal(!modal);
        },
        [modal]
    );
    useEffect(() => {
        if (modal) {
            setLoading(true);
            axios({
                method: "post",
                url: `/api/logs/scan`,
                data: { path: currentDIR },
                headers: {
                    "Content-type": "application/json",
                    "x-auth-token": token,
                },
            }).then((result) => {
                const sorted = result.data.sort((a, b) => {
                    if (a.isDir) {
                        if (b.isDir) {
                            return a.name > b.name ? 1 : -1;
                        } else {
                            return -1;
                        }
                    } else {
                        if (b.isDir) {
                            return 1;
                        } else {
                            return a.name > b.name ? 1 : -1;
                        }
                    }
                });
                setFiles(sorted);
                setLoading(false);
            });
        }
    }, [currentDIR, modal, token]);
    const fileDown = (e, file) => {
        e.preventDefault();

        if (file.isDir) {
            setFileSelected("");
            setCurrentDIR(file.id);
            setFolderChain([...folderChain, file]);
        } else {
            setFileSelected(file.id);
        }
    };
    const goToFolder = (e, folder) => {
        e.preventDefault();
        setFileSelected("");
        setCurrentDIR(folder.id);
        setFolderChain((value) => {
            return value.splice(0, value.indexOf(folder) + 1);
        });
    };
    const goUp = (e) => {
        if (folderChain.length === 1) {
            e.preventDefault();
        } else {
            goToFolder(e, folderChain[folderChain.length - 2]);
        }
    };
    const selectFile = (e) => {
        selectedFile(fileSelected, index);
        setModal(!modal);
    };
    return (
        <Fragment>
            <Button style={style} onClick={toggle}>
                Select File
            </Button>
            <Modal isOpen={modal} toggle={toggle} autoFocus={false} size="lg">
                <ModalHeader toggle={toggle}>Select File</ModalHeader>
                <ModalBody>
                    <Breadcrumb>
                        <img
                            src={backIcon}
                            alt="goUp"
                            className="link-arrow"
                            onClick={goUp}
                            style={{ paddingRight: "5px" }}
                        />
                        {folderChain.map((folder, i) => {
                            return (
                                <BreadcrumbItem
                                    active={folderChain.length === i + 1}
                                    tag="a"
                                    href="#"
                                    onClick={(e) => {
                                        goToFolder(e, folder);
                                    }}
                                    key={folder.id}
                                >
                                    {folder.name}
                                </BreadcrumbItem>
                            );
                        })}
                    </Breadcrumb>
                    <ListGroup>
                        {!loading ? (
                            files.map((file) => {
                                return (
                                    <ListGroupItem
                                        tag={file.isDir ? "a" : "button"}
                                        href="#"
                                        onClick={(e) => fileDown(e, file)}
                                        action={!file.isDir}
                                        active={file.id === fileSelected}
                                        key={file.id}
                                    >
                                        {file.isDir ? (
                                            <img
                                                src={folderIcon}
                                                alt="folder-icon"
                                                style={{
                                                    paddingRight: "5px",
                                                    color: "grey",
                                                }}
                                            />
                                        ) : (
                                            <Fragment />
                                        )}
                                        {file.name}
                                    </ListGroupItem>
                                );
                            })
                        ) : (
                            <Spinner color="primary" />
                        )}
                    </ListGroup>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" disabled={fileSelected === ""} onClick={selectFile}>
                        Select File
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default SelectFile;
