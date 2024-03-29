import React from 'react';
import {
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
} from 'reactstrap';
import { useSelector } from 'react-redux';
import BackButton from '../../BackButton';
import Convert from '../logActions/Convert';
import Delete from '../logActions/Delete';
import { useHistory } from 'react-router-dom';
import { classHeading } from '../../../config';
import { useQuery } from 'react-query';
import { fetchLog } from '../../../queries/log';

const display = {
    description: 'Description:',
    disks: 'Disks:',
    length: 'Length:',
    genre: 'Genre:',
    caption_source: 'Caption Source:',
    original_copy_location: 'Original Copy Location:',
    video_source: 'Video Source:',
    other: 'Other: ',
};

const OldLog = ({
    match: {
        params: { id },
    },
}) => {
    const userRoles = {
        ...useSelector((state) => {
            if (state.auth.user) {
                return state.auth.user.roles;
            } else {
                return undefined;
            }
        }),
    };
    const history = useHistory();
    const { isLoading, data, error } = useQuery([`oldLog`, { id, old: true }], fetchLog);
    if (error) history.goBack();
    if (isLoading) return <Spinner color="primary" />;
    return (
        <div>
            <div className={classHeading}>
                <BackButton />
                <h2>{data.title}</h2>
                {userRoles.write ? (
                    <div className="ml-auto">
                        <Convert className="mr-1" id={data._id} />
                        <Delete id={data._id} old={true} back={true} />
                    </div>
                ) : null}
            </div>
            <ListGroup>
                {Object.entries(data).map(([key, value]) => {
                    if (Object.keys(display).includes(key))
                        return (
                            <ListGroupItem key={key}>
                                <ListGroupItemHeading>{display[key]}</ListGroupItemHeading>
                                <ListGroupItemText>{value}</ListGroupItemText>
                            </ListGroupItem>
                        );
                    else return null;
                })}
                {data.completed && data.date_of_completion ? (
                    <ListGroupItem>
                        <ListGroupItemHeading>
                            {data.completed ? 'Completed' : 'Incomplete'}
                        </ListGroupItemHeading>
                        <ListGroupItemText>
                            Completed on {new Date(data.date_of_completion).toDateString()}
                        </ListGroupItemText>
                    </ListGroupItem>
                ) : null}
            </ListGroup>
        </div>
    );
};

export default OldLog;
