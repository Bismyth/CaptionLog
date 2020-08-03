import React, { Fragment } from "react";
import { Badge } from "reactstrap";

const ratingColours = {
    E: { bg: "#818286", c: "#fff" },
    G: { bg: "#33a02c", c: "#fff" },
    PG: { bg: "#ffff00", c: "#000" },
    M: { bg: "#00a0c6", c: "#fff" },
    "MA15+": { bg: "#ff0000", c: "#fff" },
};
const LogHeader = ({ title, movieInfo }) => {
    return (
        <Fragment>
            {title}
            {movieInfo ? (
                <Fragment>
                    {` (${movieInfo.year}) `}
                    <Badge
                        style={{
                            backgroundColor: ratingColours[movieInfo.rating].bg,
                            color: ratingColours[movieInfo.rating].c,
                        }}
                    >
                        {movieInfo.rating}
                    </Badge>
                </Fragment>
            ) : (
                <Fragment />
            )}
        </Fragment>
    );
};

export default React.memo(LogHeader);
