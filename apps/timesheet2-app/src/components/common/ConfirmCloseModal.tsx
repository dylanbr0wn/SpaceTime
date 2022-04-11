import React from "react";
import PropTypes from "prop-types";

import ErrorBoundary from "./ErrorBoundary";

/**
 * @name ConfirmCloseModal
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description A confirmation modal that displays when a confirmation is needed.
 */
const ConfirmCloseModal = ({
    modalShow,
    onConfirm,
    onHide,
    title,
    body,
    confirmButtonText = "Close",
}) => {
    return (
        <>
            <ErrorBoundary>
                {modalShow && (
                    <Modal
                        show={modalShow}
                        onHide={onHide}
                        backdrop="static"
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="contained-modal-title-vcenter">
                                {title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <h4>Are you sure?</h4>
                            <div>{body}</div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={onHide}>
                                Cancel
                            </Button>
                            <Button onClick={onConfirm}>
                                {confirmButtonText}
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
            </ErrorBoundary>
        </>
    );
};
ConfirmCloseModal.propTypes = {
    modalShow: PropTypes.bool.isRequired,
    onConfirm: PropTypes.func.isRequired,
    onHide: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
    confirmButtonText: PropTypes.string,
};

export default ConfirmCloseModal;
