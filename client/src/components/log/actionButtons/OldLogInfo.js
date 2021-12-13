import React, { Fragment, useState } from 'react';
import { Popover, PopoverBody, PopoverHeader } from 'reactstrap';

import { ReactComponent as InfoButton } from '../../../icons/info-black-24dp.svg';
import { ReactComponent as NoButton } from '../../../icons/clear-black-24dp.svg';

const OldLogInfo = ({ data, className }) => {
    const [pOpen, setPOpen] = useState(false);
    const toggle = () => setPOpen(!pOpen);
    return (
        <Fragment>
            <InfoButton
                id={`d-${data.title.replace(/\s/g, '').substr(0, 4).toLowerCase()}`}
                alt="Info"
                className={`link-arrow ${className}`}
            />
            <Popover
                target={`d-${data.title.replace(/\s/g, '').substr(0, 4).toLowerCase()}`}
                isOpen={pOpen}
                toggle={toggle}
                placement={'left-start'}
            >
                <PopoverHeader>
                    Old Log Data: <NoButton className="link-arrow" alt="No" onClick={toggle} />
                </PopoverHeader>
                <PopoverBody>
                    {Object.entries(data).map(([key, value]) => {
                        return <p key={key}>{`${key}: ${value}`}</p>;
                    })}
                </PopoverBody>
            </Popover>
        </Fragment>
    );
};

export default React.memo(OldLogInfo);
