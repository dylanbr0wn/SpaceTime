import React from "react";
import { Modal, Button, Row, Col, Spinner } from "react-bootstrap";
import PropTypes from "prop-types";

import ErrorBoundary from "./ErrorBoundary";

/**
 * @name CustModal
 * @param {Object} props Props. See propTypes for details.
 * @component
 * @category Common Components
 * @description A general purpose modal.
 */
const CustModal = ({
    show,
    onHide,
    SubmitButton = null,
    title,
    children = null,
    contentLoading = false,
    closeable = true,
    backdrop = true,
}) => {
    return (
        <>
            {show && (
                <Modal
                    onHide={onHide}
                    show={show}
                    size="lg"
                    backdrop={backdrop}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            {title}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {contentLoading ? (
                            <Row>
                                <Col className="text-center">
                                    <Spinner
                                        className="justify-content-center"
                                        animation="border"
                                        role="status"
                                    />
                                    <span className="sr-only">Loading...</span>
                                </Col>
                            </Row>
                        ) : (
                            <ErrorBoundary>{children}</ErrorBoundary>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        {closeable && (
                            <Button variant="secondary" onClick={onHide}>
                                Close
                            </Button>
                        )}

                        {SubmitButton ? <SubmitButton /> : null}
                    </Modal.Footer>
                </Modal>
            )}
        </>
    );
};

CustModal.propTypes = {
    // Boolean for specify if the modal should be shown
    show: PropTypes.bool.isRequired,
    // Function for hiding modal on close or completion
    onHide: PropTypes.func.isRequired,
    // React component for confirming modal.
    SubmitButton: PropTypes.func,
    // String with modal title
    title: PropTypes.string.isRequired,
    // React component(s) that are included inside the modal body. Form etc...
    children: PropTypes.object,
    // Boolean indicating if modal content is loaded or not
    contentLoading: PropTypes.bool,
    // Bool indicating if the modal can be dissmissed/closed or not
    closeable: PropTypes.bool,
    // Bool indicating if the modal can be closed by clicking on the backdrop
    backdrop: PropTypes.bool,
};

export default CustModal;
