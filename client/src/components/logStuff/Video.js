import React, { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import { Container, Alert } from "reactstrap";
import BackButton from "../BackButton";
import { classHeading } from "../../config";

const Video = (props) => {
    const { id, vid } = props.match.params;
    const [error, setError] = useState("");

    return (
        <Container className="content">
            <div className={classHeading}>
                <BackButton className="mr-1" />
                <h2>Video</h2>
            </div>
            {error ? <Alert color="danger">{error}</Alert> : <Fragment />}
            <ReactPlayer
                url={`/api/video/${id}/${vid}`}
                className="w-100 h-100"
                onError={() => {
                    setError("Video can't be found");
                }}
                controls
            />
        </Container>
    );
};

export default Video;
