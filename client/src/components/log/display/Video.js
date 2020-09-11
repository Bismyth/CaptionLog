import React, { Fragment, useState } from "react";
import ReactPlayer from "react-player";
import { Alert, Modal, ModalHeader, ModalBody, Tooltip } from "reactstrap";

import { ReactComponent as PlayVideo } from "../../../icons/video_library-black-24dp.svg";
import { ReactComponent as DownloadVideo } from "../../../icons/save_alt-black-24dp.svg";

import "./Video.css";

const Video = ({ id, title, index: { _id: vid, name: iName, location, clickviewUrl } }) => {
    const vname = iName || title;
    const [error, setError] = useState("");
    const [mOpen, setMOpen] = useState(false);
    const [tooltip, setTooltip] = useState({});

    const toggle = () => {
        setMOpen((v) => !v);
    };
    const tToggle = (e) => {
        const tar = e.target.closest("a") || e.target.closest("svg");
        setTooltip((v) => {
            return {
                ...v,
                [tar.id]: !v[tar.id],
            };
        });
    };
    if (clickviewUrl) {
        return (
            <Fragment>
                <a href={clickviewUrl} target="_blank" id={`cv-${vid}`} rel="noopener noreferrer">
                    <PlayVideo alt="Clickview" className="link-arrow videoBtn clickviewBtn" />
                    <Tooltip target={`cv-${vid}`} toggle={tToggle} isOpen={tooltip[`cv-${vid}`]}>
                        Go to Clickview
                    </Tooltip>
                </a>
            </Fragment>
        );
    }
    if (location) {
        return (
            <Fragment>
                <PlayVideo
                    alt="Play Video"
                    className="link-arrow videoBtn mr-2"
                    onClick={toggle}
                    id={`play-${vid}`}
                />
                <Tooltip target={`play-${vid}`} toggle={tToggle} isOpen={tooltip[`play-${vid}`]}>
                    Play Video
                </Tooltip>
                <a
                    href={`${process.env.PUBLIC_URL}/api/video/download/${id}/${vid}`}
                    download={vname}
                    id={`dl-${vid}`}
                >
                    <DownloadVideo alt="Download" className="link-arrow videoBtn" />
                </a>
                <Tooltip target={`dl-${vid}`} toggle={tToggle} isOpen={tooltip[`dl-${vid}`]}>
                    Download Video
                </Tooltip>
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
    }
    return null;
};

export default Video;
