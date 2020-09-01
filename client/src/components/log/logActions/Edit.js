import React from "react";
import Edit from "../../actionButtons/Edit";

const LogEdit = ({ id, className }) => {
    return <Edit action={{ link: `/edit/${id}` }} className={className} />;
};

export default LogEdit;
