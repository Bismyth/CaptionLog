import React, { Fragment } from 'react';
import { Badge } from 'reactstrap';

const ratingColours = {
    E: { bg: '#818286', c: '#fff' },
    G: { bg: '#33a02c', c: '#fff' },
    PG: { bg: '#ffff00', c: '#000' },
    M: { bg: '#00a0c6', c: '#fff' },
    'MA15+': { bg: '#ff0000', c: '#fff' },
};
const LogHeader = ({ title, year, rating, old }) => {
    var badgeStyle;
    var ratingDisplay = null;
    if (rating && ratingColours[rating]) {
        badgeStyle = {
            backgroundColor: ratingColours[rating].bg,
            color: ratingColours[rating].c,
        };
        ratingDisplay = (
            <Fragment>
                {' '}
                <Badge style={badgeStyle}>{rating}</Badge>
            </Fragment>
        );
    }
    return (
        <Fragment>
            {title}
            {year ? ` (${year})` : null}
            {ratingDisplay}
        </Fragment>
    );
};

export default React.memo(LogHeader);
