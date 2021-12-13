import React, { Fragment, useState } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';
import axios from 'axios';

import { ReactComponent as DeleteButton } from '../../../icons/delete-black-24dp.svg';
import { ReactComponent as NoButton } from '../../../icons/clear-black-24dp.svg';
import { ReactComponent as YesButton } from '../../../icons/done-black-24dp.svg';
import { useHistory } from 'react-router-dom';
import { useMutation, queryCache } from 'react-query';

const Delete = ({ id, old = false, back, className }) => {
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    const history = useHistory();
    const [deleteLog] = useMutation(
        async () => {
            const { data } = await axios({
                method: 'delete',
                url: `/api/logs/${id}`,
                data: { old },
            });
            return data;
        },
        {
            onSuccess: () => {
                if (back) history.goBack();
                queryCache.invalidateQueries('getLogs');
            },
            onError: (err) => {
                console.error(err);
            },
        }
    );
    return (
        <Fragment>
            <DeleteButton id={`d-${id}`} alt="Delete" className={`link-arrow ${className}`} />
            <Popover target={`d-${id}`} isOpen={pOpen} toggle={toggle} placement={'left'}>
                <PopoverHeader>Delete</PopoverHeader>
                <PopoverBody>
                    Are you sure you want to delete?
                    <br />
                    <YesButton className="link-arrow" alt="Yes" onClick={deleteLog} />
                    <NoButton className="link-arrow" alt="No" onClick={toggle} />
                </PopoverBody>
            </Popover>
        </Fragment>
    );
};

export default Delete;
