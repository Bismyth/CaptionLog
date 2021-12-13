import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import {
    Spinner,
    Alert,
    Button,
    FormGroup,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Label,
    Input,
} from 'reactstrap';
import { Formik, Form } from 'formik';
import { title, submitBtn, blankForm, display, selectorsFormat, blank } from './FormData.json';
import FormSection from './FormSection';
import FormMSection from './FormMSection';
import BackButton from '../../BackButton';
import OldLogInfo from '../logActions/OldLogInfo';
import { ReactComponent as eInfoBtn } from '../../../icons/sort-black-24dp.svg';
import { classHeading, asyncForEach } from '../../../config';
import * as Yup from 'yup';
import IconTooltip from '../../IconTooltip';

const LogSchema = Yup.object().shape({
    title: Yup.string().required('Please add a title.'),
    description: Yup.string(),
    genre: Yup.string(),
    folder: Yup.string(),
    year: Yup.number(),
    rating: Yup.string(),
    teacherName: Yup.string(),
    captionSource: Yup.string(),
    dateOfCompletion: Yup.string(),
    videoSource: Yup.string(),
    originalLocation: Yup.string(),
    digitalInfo: Yup.array(
        Yup.object({
            name: Yup.string(),
            length: Yup.string(),
        })
    ),
});
const diffArray = (arr1, arr2) =>
    arr1.concat(arr2).filter((val) => !(arr1.includes(val) && arr2.includes(val)));

const LogForm = (props) => {
    const { upload, data = blankForm, type, errors, oldLog, uniqueInfo: iUniqueInfo } = props;
    const [selectors, updateSelectors] = useState({});
    const [loading, setLoading] = useState(false);
    const [uniqueInfo, setUniqueInfo] = useState(iUniqueInfo || []);
    const [eInfoTrack, setEInfoTrack] = useState([]);
    const [modal, setModal] = useState(false);
    const toggle = (e) => {
        if (!modal) setEInfoTrack(uniqueInfo);
        setModal((v) => !v);
    };
    const eInfoChange = (e) => {
        const { checked, name } = e.target;
        if (checked && !eInfoTrack.includes(name)) {
            setEInfoTrack((v) => [...v, name]);
        } else if (!checked && eInfoTrack.includes(name)) {
            setEInfoTrack((v) => {
                return v.filter((x) => x !== name);
            });
        } else {
            console.error('Extra Info function screwed up.');
        }
    };
    const eInfoSubmit = (e, setFieldValue, values) => {
        var newDig = values.digitalInfo;
        diffArray(uniqueInfo, eInfoTrack).forEach((v) => {
            if (!uniqueInfo.includes(v)) {
                newDig = newDig.map((x) => {
                    return { ...x, [v]: values[v] };
                });
                setFieldValue(v, undefined);
            } else {
                if (values.digitalInfo.length > 0) setFieldValue(v, values.digitalInfo[0][v]);
                newDig.forEach((x) => {
                    delete x[v];
                });
            }
        });
        setFieldValue('digitalInfo', newDig);
        setUniqueInfo(eInfoTrack);
        toggle();
    };
    useEffect(() => {
        const fetchSelectors = async () => {
            setLoading(true);
            await asyncForEach(selectorsFormat, async (selector) => {
                var config = {
                    method: 'get',
                    url: `/api/lists/${selector}`,
                };
                const { data: result } = await axios(config);

                updateSelectors((v) => {
                    return {
                        ...v,
                        [selector]: ['', ...result.map((v) => v.name)],
                    };
                });
            });
            setLoading(false);
        };
        try {
            fetchSelectors();
        } catch (e) {
            console.error(e);
        }
    }, []);
    if (loading) return <Spinner color="primary" />;
    return (
        <Fragment>
            <Formik initialValues={data} validationSchema={LogSchema} onSubmit={upload}>
                {({ isSubmitting, values, setFieldValue }) => (
                    <Form>
                        <div className={classHeading}>
                            <BackButton back />
                            <h1>{title[type]}</h1>
                            <div className="ml-auto d-flex align-items-center">
                                {oldLog || values.oData ? (
                                    <OldLogInfo data={oldLog || values.oData} className="mr-1" />
                                ) : null}
                                <IconTooltip
                                    onClick={toggle}
                                    Icon={eInfoBtn}
                                    tooltip="Extra Info"
                                    id="eInfo"
                                    className={{ icon: 'link-arrow' }}
                                />
                                <Modal isOpen={modal} toggle={toggle} size="md">
                                    <ModalHeader toggle={toggle}>Extra Info</ModalHeader>
                                    <ModalBody>
                                        {Object.entries(display.digitalInfo.optional).map(
                                            ([key, { name }]) => (
                                                <FormGroup check key={key}>
                                                    <Label key={key} check>
                                                        <Input
                                                            name={key}
                                                            type="checkbox"
                                                            checked={eInfoTrack.includes(key)}
                                                            onChange={eInfoChange}
                                                        />

                                                        {` ${name}`}
                                                    </Label>
                                                </FormGroup>
                                            )
                                        )}
                                    </ModalBody>
                                    <ModalFooter>
                                        <Button
                                            color="primary"
                                            onClick={(e) => {
                                                eInfoSubmit(e, setFieldValue, values);
                                            }}
                                        >
                                            Change
                                        </Button>
                                    </ModalFooter>
                                </Modal>
                            </div>
                        </div>
                        {errors.length > 0
                            ? errors.map(({ msg }, i) => (
                                  <Alert key={i} color="danger">
                                      {msg}
                                  </Alert>
                              ))
                            : null}
                        {Object.entries(display).map(
                            ([key, { type, name, format, tabDefault, optional }]) => {
                                const uni = {
                                    format,
                                    selectors,
                                    section: key,
                                    uniqueInfo,
                                };
                                if (type === 'single') {
                                    return (
                                        <Fragment key={key}>
                                            {name ? <h3 className="mb-3">{name}</h3> : null}
                                            <FormSection {...uni} />
                                        </Fragment>
                                    );
                                } else if (type === 'multi') {
                                    var valuesLength = values[key].length;
                                    return (
                                        <FormMSection
                                            {...{
                                                ...uni,
                                                name,
                                                tabDefault,
                                                blank,
                                                valuesLength,
                                                optional,
                                            }}
                                            key={key}
                                        />
                                    );
                                }
                                return null;
                            }
                        )}
                        <FormGroup className="mt-3">
                            <Button color="primary" type="submit" disabled={isSubmitting}>
                                {submitBtn[type]}
                            </Button>
                        </FormGroup>
                    </Form>
                )}
            </Formik>
        </Fragment>
    );
};

export default LogForm;
