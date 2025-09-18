import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {
    MediaController,
    MediaControlBar,
    MediaTimeRange,
    MediaTimeDisplay,
    MediaVolumeRange,
    MediaPlaybackRateButton,
    MediaPlayButton,
    MediaSeekBackwardButton,
    MediaSeekForwardButton,
    MediaMuteButton,
    MediaFullscreenButton,
} from "media-chrome/react";

const FreePreview = ({ show, handleClose, freeLesson }) => {

    return (
        <>
            <Modal show={show} onHide={handleClose} size='lg'>
                <Modal.Header closeButton>
                    <Modal.Title>{freeLesson.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <MediaController style={{ width: "100%", aspectRatio: "16/9" }}>
                        <video
                            slot="media"
                            src={freeLesson.video_url}
                            controls={false}
                            style={{ width: "100%", height: "100%" }}
                        >
                        </video>
                        <MediaControlBar>
                            <MediaPlayButton />
                            <MediaSeekBackwardButton seekOffset={10} />
                            <MediaSeekForwardButton seekOffset={10} />
                            <MediaTimeRange />
                            <MediaTimeDisplay showDuration />
                            <MediaMuteButton />
                            <MediaVolumeRange />
                            <MediaPlaybackRateButton />
                            <MediaFullscreenButton />
                        </MediaControlBar>
                    </MediaController>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default FreePreview