import PropTypes from "prop-types";
import React from "react";

import { Dialog } from "@headlessui/react";

import ErrorBoundary from "./ErrorBoundary";
import Loading from "./Loading";

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
                <Dialog
                    onHide={onHide}
                    show={show}
                    size="lg"
                    backdrop={backdrop}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Dialog.Overlay />
                    <Dialog.Title id="contained-modal-title-vcenter">
                        {title}
                    </Dialog.Title>
                    <>
                        {contentLoading ? (
                            <div>
                                <div className="text-center">
                                    <Loading />
                                </div>
                            </div>
                        ) : (
                            <ErrorBoundary>{children}</ErrorBoundary>
                        )}
                    </>
                    <>
                        {closeable && <button onClick={onHide}>Close</button>}

                        {SubmitButton ? <SubmitButton /> : null}
                    </>
                </Dialog>
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
