import React, { Fragment } from "react";
import { Badge } from "reactstrap";

const ratingColours = {
    E: { bg: "#818286", c: "#fff" },
    G: { bg: "#33a02c", c: "#fff" },
    PG: { bg: "#ffff00", c: "#000" },
    M: { bg: "#00a0c6", c: "#fff" },
    "MA15+": { bg: "#ff0000", c: "#fff" },
};
const LogHeader = ({ title, movieInfo, old }) => {
    var badgeStyle;
    if (!movieInfo) return title;
    if (ratingColours[movieInfo.rating]) {
        badgeStyle = {
            backgroundColor: ratingColours[movieInfo.rating].bg,
            color: ratingColours[movieInfo.rating].c,
        };
    }
    return (
        <Fragment>
            {title}
            {movieInfo.year ? ` (${movieInfo.year})` : null}
            {movieInfo.rating ? (
                <Fragment>
                    {" "}
                    <Badge style={badgeStyle}>{movieInfo.rating}</Badge>
                </Fragment>
            ) : null}
        </Fragment>
    );
};

export default React.memo(LogHeader);
