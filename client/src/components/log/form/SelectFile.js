import React, { useState, Fragment, useEffect } from 'react';
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
} from 'reactstrap';
import axios from 'axios';
import folderIcon from '../../../icons/folder-black-24dp.svg';
import backIcon from '../../../icons/keyboard_return-black-24dp.svg';
import { useQuery } from 'react-query';
import SearchBar from '../SearchBar';

import { useFormikContext } from 'formik';
import { ReactComponent as FileAdd } from '../../../icons/note_add-black-24dp.svg';
const shortenPath = (path) => {
    return path
        .split('/')
        .map((v) => v.substr(0, 4).replace(/ /g, ''))
        .join('');
};

const SelectFile = ({ sName }) => {
    const {
        values: { folder = '' },
        handleChange: change,
    } = useFormikContext();
    const [folderChain, setFolderChain] = useState(
        folder.split('/').map((v, i, arr) => {
            return {
                id: v === '' ? '/' : arr.slice(0, i + 1).join('/'),
                name: v === '' ? 'Content' : v,
                isDir: true,
            };
        })
    );
    useEffect(() => {
        setCurrentDIR(folder || '/');
    }, [folder]);
    const [currentDIR, setCurrentDIR] = useState(folder || '/');
    const [fileSelected, setFileSelected] = useState('');
    const [search, setSearch] = useState('');
    const [modal, setModal] = useState(false);
    const toggle = (e) => {
        setModal(!modal);
    };
    const { isLoading, data: files } = useQuery(
        [`file-${shortenPath(currentDIR)}`, { path: currentDIR }],
        async (key, path) => {
            const { data } = await axios({
                method: 'post',
                url: `/api/logs/scan`,
                data: path,
            });
            return data;
        },
        {
            onError: (err) => {
                setCurrentDIR('/');
            },
        }
    );
    const fileDown = (e, file) => {
        e.preventDefault();
        setSearch('');
        if (file.isDir) {
            setFileSelected('');
            setCurrentDIR(file.id);
            setFolderChain([...folderChain, file]);
        } else {
            setFileSelected(file.id);
        }
    };
    const goToFolder = (e, folder) => {
        e.preventDefault();
        setSearch('');
        setFileSelected('');
        setCurrentDIR(folder.id);
        setFolderChain((value) => {
            return value.splice(0, value.indexOf(folder) + 1);
        });
    };
    const goUp = (e) => {
        setSearch('');
        if (folderChain.length === 1) {
            e.preventDefault();
        } else {
            goToFolder(e, folderChain[folderChain.length - 2]);
        }
    };
    const selectFile = (e) => {
        setSearch('');
        change({ target: { name: 'folder', value: currentDIR } }, 'main');
        change({ target: { name: sName, value: fileSelected } });
        setModal(!modal);
    };
    return (
        <Fragment>
            <FileAdd alt="Add" onClick={toggle} className="link-arrow" />
            <Modal isOpen={modal} toggle={toggle} autoFocus={false} size="lg">
                <ModalHeader toggle={toggle}>Select File</ModalHeader>
                <ModalBody>
                    <Breadcrumb className="mb-0">
                        <img
                            src={backIcon}
                            alt="goUp"
                            className="link-arrow"
                            onClick={goUp}
                            style={{ paddingRight: '5px' }}
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
                    <SearchBar value={search} update={setSearch} className="mb-2" />

                    <ListGroup>
                        {!isLoading ? (
                            files
                                .filter((v) => {
                                    return new RegExp(`^${search}`, 'i').test(v.name);
                                })
                                .map((file) => {
                                    return (
                                        <ListGroupItem
                                            tag={file.isDir ? 'a' : 'button'}
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
                                                        paddingRight: '5px',
                                                        color: 'grey',
                                                    }}
                                                />
                                            ) : null}
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
                    <Button color="primary" disabled={fileSelected === ''} onClick={selectFile}>
                        Select File
                    </Button>
                </ModalFooter>
            </Modal>
        </Fragment>
    );
};

export default SelectFile;
