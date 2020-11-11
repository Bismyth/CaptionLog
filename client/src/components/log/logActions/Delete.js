import React from "react";
import axios from "axios";
import Delete from "../../actionButtons/Delete";
import { useHistory } from "react-router-dom";
import { useMutation, queryCache } from "react-query";

const DeleteLog = ({ id, old = false, back, className }) => {
    const history = useHistory();
    const [deleteLog] = useMutation(
        async () => {
            const { data } = await axios({
                method: "delete",
                url: `/api/logs/${id}`,
                data: { old },
            });
            return data;
        },
        {
            onSuccess: () => {
                if (back) history.goBack();
                queryCache.invalidateQueries("getLogs");
            },
            onError: (err) => {
                console.error(err);
            },
        }
    );
    return <Delete id={old ? "o" + id : id} className={className} action={deleteLog} />;
};

export default DeleteLog;
