import React, { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import { Alert, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import BackButton from "../../BackButton";
import { classHeading } from "../../../config";

const Video = ({ id, vid, vname }) => {
    const [error, setError] = useState("");
    const [mOpen, setMOpen] = useState(false);
    const toggle = () => {
        setMOpen((v) => !v);
    };
    return (
        <Fragment>
            <Button onClick={toggle}>Play Video</Button>
            <Modal isOpen={mOpen} toggle={toggle} size="lg">
                <ModalHeader toggle={toggle}>{vname}</ModalHeader>
                <ModalBody>
                    {error ? <Alert color="danger">{error}</Alert> : <Fragment />}
                    <ReactPlayer
                        url={`${process.env.PUBLIC_URL}/api/video/${id}/${vid}`}
                        className="w-100 h-100"
                        onError={() => {
                            setError("Video can't be found");
                        }}
                        onReady={() => {
                            setError("");
                        }}
                        controls
                    />
                </ModalBody>
            </Modal>
        </Fragment>
    );
};

export default Video;
