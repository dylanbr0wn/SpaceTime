import React from "react";

import { Dialog, Transition } from "@headlessui/react";

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
                <Transition appear show={modalShow} as={React.Fragment}>
                    <Dialog
                        onClose={onHide}
                        as="div"
                        className="fixed inset-0 z-10 overflow-y-auto"
                    >
                        <div className="min-h-screen px-4 text-center">
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
                            </Transition.Child>

                            {/* This element is to trick the browser into centering the modal contents. */}
                            <span
                                className="inline-block h-screen align-middle"
                                aria-hidden="true"
                            >
                                &#8203;
                            </span>
                            <Transition.Child
                                as={React.Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-slate-900 shadow-xl rounded-2xl">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium leading-6 text-sky-200"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    <Dialog.Description
                                        className={"text-sky-300 py-5"}
                                    >
                                        {body}
                                    </Dialog.Description>
                                    <div className="mt-4 flex space-x-4">
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-sky-300 bg-slate-900 border-2 border-sky-500 rounded-md hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
                                            onClick={onHide}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            className="inline-flex justify-center px-4 py-2 text-sm font-medium text-red-500 bg-slate-800 rounded-md hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
                                            onClick={onConfirm}
                                        >
                                            {confirmButtonText}
                                        </button>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition>
            </ErrorBoundary>
        </>
    );
};
export default ConfirmCloseModal;
