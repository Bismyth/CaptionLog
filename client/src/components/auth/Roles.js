import React, { useState, Fragment } from 'react';
import { useQuery, useMutation, queryCache } from 'react-query';
import axios from 'axios';
import {
    ListGroup,
    Spinner,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    InputGroup,
    InputGroupAddon,
    Input,
    ModalFooter,
    Button,
} from 'reactstrap';
import { classHeading, getRoles } from '../../config';
import BackButton from '../BackButton';
import { ReactComponent as AddRole } from '../../icons/person_add-black-24dp.svg';
import { blankNew, selector, roleDesc } from './RoleData.json';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import Edit from '../actionButtons/Edit';
import Delete from '../actionButtons/Delete';

const fetchRoles = async () => {
    var config = {
        url: `/api/auth/roles`,
        method: 'get',
    };
    const { data } = await axios(config);
    return data;
};
const postRole = async ([iData, type]) => {
    var data = Object.fromEntries(Object.entries(iData).filter(([key, value]) => value !== ''));
    var config = {
        url: `/api/auth/roles`,
        method: type === 'edit' ? 'put' : type === 'delete' ? 'delete' : 'post',
        data,
    };
    const { data: result } = await axios(config);
    return result;
};
blankNew.roles = Object.fromEntries(Object.entries(roleDesc).map(([key]) => [key, false]));

const Roles = (props) => {
    const userRoles = { ...useSelector(getRoles) };
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const { data, isLoading } = useQuery('roles', fetchRoles);
    const [newRoleModal, setNewRoleModal] = useState(false);
    const [formData, setFormData] = useState(blankNew);
    const [formType, setFormType] = useState('');
    const [cSelect, setCSelect] = useState(Object.keys(selector)[0]);
    const [submit, { isLoading: sLoading }] = useMutation(postRole, {
        onSuccess: () => {
            queryCache.invalidateQueries('roles');
            setNewRoleModal(false);
        },
    });
    const modalToggle = async (e) => {
        var type;
        if (e.target.closest('svg')) type = e.target.closest('svg').id;
        if (!newRoleModal) {
            if (type === 'new') {
                setFormType('new');
                setFormData(blankNew);
                setCSelect(Object.keys(selector)[0]);
            } else if (type.includes('edit')) {
                setFormType('edit');
                const d = data.find((v) => {
                    return v._id === type.split('-')[1];
                });
                setFormData(d);
                setCSelect(
                    Object.entries(d).find(([key]) => !['roles', '_id', '__v'].includes(key))[0]
                );
            }
        }

        setNewRoleModal((v) => !v);
    };
    const selectorChange = (e) => {
        const select = e.target.value;
        setCSelect(select);
        setFormData((v) => {
            return { [select]: '', roles: v.roles };
        });
    };
    const formChange = (e) => {
        const { name, value, id, checked } = e.target;
        if (name === 'roles') {
            if (id === 'admin') {
                setFormData((v) => {
                    var t = Object.fromEntries(
                        Object.entries(v.roles).map(([key]) => [key, checked])
                    );
                    return {
                        ...v,
                        roles: {
                            ...t,
                            admin: checked,
                        },
                    };
                });
            } else {
                setFormData((v) => {
                    return {
                        ...v,
                        roles: {
                            ...v.roles,
                            [id]: checked,
                        },
                    };
                });
            }
        } else {
            setFormData((v) => {
                return {
                    ...v,
                    [name]: value,
                };
            });
        }
    };
    if (!userRoles.admin && loggedIn !== null) return <Redirect to={`/`} />;
    return (
        <div>
            <div className={classHeading}>
                <BackButton back />
                <h1>Permissions</h1>
                <div className="ml-auto d-flex align-items-center">
                    <AddRole
                        className="w-auto link-arrow"
                        style={{ height: '30px' }}
                        id="new"
                        onClick={modalToggle}
                    />
                </div>
            </div>
            <Modal isOpen={newRoleModal} toggle={modalToggle}>
                <ModalHeader toggle={modalToggle}>{`${
                    formType === 'new' ? 'New' : 'Edit'
                } Permission`}</ModalHeader>
                <ModalBody>
                    <Form>
                        <Label for="selector">{`${selector[cSelect].label}:`}</Label>
                        <InputGroup id="selector">
                            <InputGroupAddon addonType="prepend">
                                <Input type="select" onChange={selectorChange} value={cSelect}>
                                    {Object.entries(selector).map(([key, { label }]) => (
                                        <option key={key} value={key}>
                                            {label}
                                        </option>
                                    ))}
                                </Input>
                            </InputGroupAddon>
                            <Input
                                type="text"
                                name={cSelect}
                                placeholder={selector[cSelect].desc}
                                value={formData[cSelect] || ''}
                                onChange={formChange}
                            />
                        </InputGroup>
                        <Label for="roles">Roles: </Label>
                        <FormGroup id="roles" check>
                            {Object.entries(roleDesc).map(([key, desc]) => (
                                <Fragment key={key}>
                                    <Input
                                        type="checkbox"
                                        id={key}
                                        onChange={formChange}
                                        name="roles"
                                        checked={formData.roles[key]}
                                        disabled={formData.roles.admin && key !== 'admin'}
                                    />
                                    {` ${key.charAt(0).toUpperCase() + key.slice(1)}: ${desc}`}
                                    <br />
                                </Fragment>
                            ))}
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button
                        color="primary"
                        onClick={() => {
                            submit([formData, formType.split('-')[0]]);
                        }}
                        disabled={sLoading}
                    >
                        Save
                    </Button>
                </ModalFooter>
            </Modal>
            {!isLoading ? (
                <ListGroup>
                    {data.map((v) => (
                        <ListGroupItem key={v._id}>
                            <ListGroupItemHeading className="d-flex vertical-align-center">
                                {v.adGroup ? `Group: ${v.adGroup}` : `User: ${v.doeNumber}`}
                                <div className="ml-auto mr-3" style={{ minWidth: '52px' }}>
                                    <Edit action={modalToggle} id={`edit-${v._id}`} />
                                    <Delete
                                        action={() => {
                                            submit([{ id: v._id }, 'delete']);
                                        }}
                                        id={v._id}
                                    />
                                </div>
                            </ListGroupItemHeading>
                            <ListGroupItemText>
                                {Object.entries(v.roles)
                                    .filter((r) => r[1])
                                    .map((r) => r[0])
                                    .join(', ')}
                            </ListGroupItemText>
                        </ListGroupItem>
                    ))}
                </ListGroup>
            ) : (
                <Spinner color="primary" />
            )}
        </div>
    );
};

export default Roles;
