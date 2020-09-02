import React, { Fragment } from "react";
import {
    Spinner,
    ListGroup,
    ListGroupItem,
    ListGroupItemHeading,
    ListGroupItemText,
    Button,
    Alert,
} from "reactstrap";
import { useSelector } from "react-redux";
import BackButton from "../../BackButton";
import { format } from "./LogDisplay.json";
import Edit from "../logActions/Edit";
import Delete from "../logActions/Delete";
import LogHeader from "../LogHeader";
import { classHeading } from "../../../config";
import { useQuery } from "react-query";
import { fetchLog } from "../../../queries/log";
import OldLogInfo from "../logActions/OldLogInfo";
import Video from "./Video";

const Log = ({
    match: {
        params: { id },
    },
}) => {
    const loggedIn = useSelector((state) => state.auth.isAuthenticated);
    const userRoles = {
        ...useSelector((state) => {
            if (state.auth.user) {
                return state.auth.user.roles;
            } else {
                return undefined;
            }
        }),
    };
    const isLocal = useSelector((state) => state.auth.local);
    const { data, isLoading, error } = useQuery([`log`, { id }], fetchLog);
    if (error) return <Alert color="danger">Error loading entry, please go back.</Alert>;
    if (isLoading) return <Spinner color="primary" />;
    return (
        <div>
            <div className={classHeading}>
                <BackButton />
                <h2>
                    <LogHeader title={data.title} movieInfo={data.movieInfo} />
                </h2>
                {userRoles.write ? (
                    <div className="ml-auto">
                        {data.oData ? <OldLogInfo data={data.oData} /> : null}
                        <Edit action={{ link: `/edit/${data._id}` }} />
                        <Delete id={data._id} back={true} />
                    </div>
                ) : null}
            </div>
            {Object.entries(format).map(([key, [{ heading, multi }, ...entries]]) => {
                if (key !== "main" && data[key] === undefined) return null;
                if (multi) {
                    if (Object.keys(data).includes(key) && data[key].length > 0) {
                        return (
                            <Fragment key={key}>
                                <h3 className="mt-2">{heading}</h3>
                                <ListGroup>
                                    {data[key].map((value, i) => (
                                        <ListGroupItem key={i}>
                                            {value.name ? (
                                                <ListGroupItemHeading>
                                                    {value.name}
                                                </ListGroupItemHeading>
                                            ) : null}
                                            <ListGroupItemText className="d-flex align-items-center">
                                                {entries
                                                    .filter((value) => {
                                                        return value.align === "left";
                                                    })
                                                    .map((v, i) => {
                                                        if (Object.keys(value).includes(v.value)) {
                                                            return (
                                                                <Fragment
                                                                    key={`${key[0]}-${v.value}-${i}`}
                                                                >
                                                                    <span>
                                                                        {v.renderPart.replace(
                                                                            `{${v.value}}`,
                                                                            value[v.value]
                                                                        )}
                                                                    </span>
                                                                </Fragment>
                                                            );
                                                        } else {
                                                            return null;
                                                        }
                                                    })}
                                                <span className="ml-auto">
                                                    {(isLocal || loggedIn) &&
                                                    key === "digitalInfo" &&
                                                    value.location ? (
                                                        <Video
                                                            id={data._id}
                                                            vid={value._id}
                                                            vname={value.name || data.title}
                                                        />
                                                    ) : (isLocal || loggedIn) &&
                                                      value.clickviewUrl ? (
                                                        <Button
                                                            href={value.clickviewUrl}
                                                            target="_blank"
                                                        >
                                                            Go to Clickview
                                                        </Button>
                                                    ) : null}
                                                </span>
                                            </ListGroupItemText>
                                        </ListGroupItem>
                                    ))}
                                </ListGroup>
                            </Fragment>
                        );
                    } else {
                        return <Fragment key={key} />;
                    }
                } else {
                    return (
                        <Fragment key={key}>
                            {key !== "main" ? <h3 className="mt-2">{heading}</h3> : <Fragment />}
                            <ListGroup>
                                {entries.map((v) => {
                                    if (key === "main") var source = data;
                                    else source = data[key];
                                    if (
                                        Object.keys(source).includes(v.value) &&
                                        source[v.value] !== ""
                                    ) {
                                        return (
                                            <ListGroupItem key={`${key[0]}-${v.value}`}>
                                                <ListGroupItemHeading>
                                                    {v.header}
                                                </ListGroupItemHeading>
                                                <ListGroupItemText className="text-wrap text-break">
                                                    {v.special === "date"
                                                        ? new Date(source[v.value]).toDateString()
                                                        : source[v.value]}
                                                </ListGroupItemText>
                                            </ListGroupItem>
                                        );
                                    } else {
                                        return <Fragment key={`${key[0]}-${v.value}`} />;
                                    }
                                })}
                            </ListGroup>
                        </Fragment>
                    );
                }
            })}
        </div>
    );
};

export default Log;
