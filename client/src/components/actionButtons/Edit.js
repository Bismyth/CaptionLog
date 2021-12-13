import React from 'react';
import { ReactComponent as EditButton } from '../../icons/edit-black-24dp.svg';
import { Link } from 'react-router-dom';
import IconTooltip from '../IconTooltip';

const Edit = ({ className, action, id }) => {
    if (typeof action === 'function') {
        return (
            <IconTooltip
                onClick={action}
                className={{ icon: `link-arrow ${className}` }}
                id={id}
                tooltip="Edit"
                Icon={EditButton}
            />
        );
    } else if (action.link) {
        return (
            <IconTooltip
                tag={Link}
                to={action.link}
                id={`edit-${action.link.split('/').pop()}`}
                className={{ link: 'p-0 d-inline-block', icon: `link-arrow ${className}` }}
                tooltip="Edit"
                Icon={EditButton}
            />
        );
    }
    return null;
};

export default Edit;
