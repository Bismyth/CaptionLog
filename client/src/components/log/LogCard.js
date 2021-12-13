import React from 'react';
import { Card, CardBody, CardText, CardTitle } from 'reactstrap';
import { Link } from 'react-router-dom';
import Edit from '../actionButtons/Edit';
import Convert from './logActions/Convert';
import Delete from './logActions/Delete';
import LogHeader from './LogHeader';

const LogCard = ({ _id, old, title, description, year, rating, updatePage, userRoles }) => {
    return (
        <Card>
            <CardBody>
                <CardTitle className="d-flex">
                    <Link
                        onClick={updatePage}
                        to={old ? `/oldLog/${_id}` : `/log/${_id}`}
                        className="text-dark"
                    >
                        <LogHeader title={title} year={year} rating={rating} old={old} />
                    </Link>
                    {userRoles.write ? (
                        <div className="ml-auto mr-3" style={{ minWidth: '52px' }}>
                            {old ? (
                                <Convert className="mr-1" id={_id} />
                            ) : (
                                <Edit className="mr-1" action={{ link: `/edit/${_id}` }} />
                            )}
                            <Delete id={_id} old={old} />
                        </div>
                    ) : null}
                </CardTitle>
                <CardText>{description}</CardText>
            </CardBody>
        </Card>
    );
};

export default React.memo(LogCard);
