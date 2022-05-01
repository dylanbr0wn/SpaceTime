import PropTypes from "prop-types";
import React, {
    Suspense,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { connect } from "react-redux";
import { toast } from "react-toastify";

import Tippy from "@tippyjs/react";

import {
    createTemplateDispatch,
    deleteTemplateDispatch,
    readTemplateDispatch,
    updateTemplateDispatch,
} from "../../../../redux/actions/templatesActions";
import ConfirmCloseModal from "../../common/ConfirmCloseModal";
import ErrorBoundary from "../../common/ErrorBoundary";
import Modal from "../../common/Modal";

import "../../../style/TimeEntry.css";
import { Menu } from "@headlessui/react";

/**
 * @name TemplateInput
 * @component
 * @category Time Entry
 * @description Allows for template selection, addition, and deletion.
 * Provides a dropdown for selection, a button to save templates, and an interface to manage.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetTemplateInput = ({
    templates,
    timesheet,
    timesheetEntries,
    userInfo,
    readTemplateDispatch,
    createTemplateDispatch,
    updateTemplateDispatch,
    deleteTemplateDispatch,
    disableModification,
    setIsLocked,
}) => {
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [selectedTemplateSave, setSelectedTemplateSave] = useState({});
    const [selectedTemplateLoad] = useState({});
    const [selectedTemplateDelete, setSelectedTemplateDelete] = useState({});
    const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
    const [whichHover, setWhichHover] = useState({});
    const [newTemplateName, setNewTemplateName] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showConfirmLoadModal, setShowConfirmLoadModal] = useState(false);

    // If creating a new template and naming it, update local new template name
    const handleNewNameChange = ({ target }) => {
        if (Object.values(selectedTemplateSave).length !== 0)
            setSelectedTemplateSave({});
        setNewTemplateName(target.value);
    };

    useEffect(() => {
        setWhichHover({});
        setSelectedTemplateSave({});
        setNewTemplateName("");
    }, [timesheet, templates]);

    // Handle selecting a template from exisitng templates.
    const handleTemplateSelect = (template) => {
        if (whichHover === template)
            setSelectedTemplateSave(
                selectedTemplateSave === template ? {} : template
            );
        if (newTemplateName !== "") setNewTemplateName("");
    };

    // Handle saving a template. If its a new template, will proceed directly. If overwriting old tempalte will request confirmation
    const handleSubmit = () => {
        if (newTemplateName) {
            handleConfirm();
        } else {
            setShowTemplateModal(false);
            setShowConfirmModal(true);
        }
    };

    // Handle conformation of template change/save and dispatch api call and redux action.
    const handleConfirm = async () => {
        if (newTemplateName) {
            const result = await createTemplateDispatch(
                userInfo.user.EmployeeID,
                newTemplateName,
                timesheet.hourEntries
            );
            if (result.success) {
                toast.success("Template saved!");
                setShowTemplateModal(false);
            } else {
                if (result.status === 423) {
                    setIsLocked(true);
                }
                toast.warn(result.data);
            }
        } else {
            const result = await updateTemplateDispatch(
                userInfo.user.EmployeeID,
                selectedTemplateSave.TemplateID,
                timesheet.hourEntries
            );
            if (result.success) {
                toast.success("Template saved!");
                setShowConfirmModal(false);
            } else {
                if (result.status === 423) {
                    setIsLocked(true);
                }
                toast.warn(result.data);
            }
        }
    };

    // Handle confirtmation of tempalte delete.
    const handleConfirmDeleteTemplate = async () => {
        const result = await deleteTemplateDispatch(
            selectedTemplateDelete.TemplateID,
            userInfo.user.EmployeeID
        );
        if (result.status === 423) {
            setIsLocked(true);
        }
        setShowConfirmDeleteModal(false);
        setShowTemplateModal(true);
    };

    // Handle confirmation of loading a template and overwriting existing
    const handleConfirmLoadTemplate = async () => {
        const result = await readTemplateDispatch(
            selectedTemplateLoad.TemplateID,
            timesheet.startDate,
            userInfo.user.EmployeeID,
            timesheetEntries
        );
        if (result.status === 423) {
            setIsLocked(true);
        }
        setShowConfirmLoadModal(false);
    };

    // Handle load template submit. Will produce confirmation modal if data will be destroyed, otherwise will proceed with loading.
    const handleLoadTemplateSubmit = useCallback(
        async (template) => {
            const result = await readTemplateDispatch(
                template.TemplateID,
                timesheet.startDate,
                userInfo.user.EmployeeID
                // timesheetEntries
            );
            if (result.status === 423) {
                setIsLocked(true);
            }
        },
        [
            // timesheetEntries,
            readTemplateDispatch,
            timesheet.startDate,
            userInfo.user.EmployeeID,
            setIsLocked,
        ]
    );

    // Handle delete template submit. Will produce confirmation modal.
    const handleDeleteTemplateSubmit = (template) => {
        setSelectedTemplateDelete(template);
        setShowTemplateModal(false);
        setShowConfirmDeleteModal(true);
    };

    // Submit button sub component
    const SubmitButton = () => {
        return (
            <button
                onClick={handleSubmit}
                disabled={
                    !newTemplateName &&
                    Object.values(selectedTemplateSave).length === 0
                }
            >
                {newTemplateName ? "Save new template" : "Save to template"}
            </button>
        );
    };

    // Manage template button sub component
    const ManageButton = useMemo(
        () => (
            <button
                onClick={() => setShowTemplateModal(true)}
                style={{
                    marginRight: 10,
                    cursor: "pointer",
                    display: "inline-block",
                }}
            >
                Manage Templates
            </button>
        ),
        [setShowTemplateModal]
    );

    const renderLoader = () => <p></p>;

    return (
        <>
            <ErrorBoundary>
                <Menu>
                    <Menu.Button
                        id="dropdown-basic"
                        disabled={templates.length === 0 || disableModification}
                    >
                        Load Template
                    </Menu.Button>
                    <Menu.Items className="shadow">
                        {templates.map((temp) => {
                            return (
                                <Menu.Item
                                    key={temp.TemplateID}
                                    onClick={() =>
                                        handleLoadTemplateSubmit(temp)
                                    }
                                >
                                    {temp.TemplateName}
                                </Menu.Item>
                            );
                        })}
                    </Menu.Items>
                </Menu>
                {ManageButton}
            </ErrorBoundary>

            <ErrorBoundary>
                <Suspense fallback={renderLoader()}>
                    <Modal
                        show={showTemplateModal}
                        title="Manage Templates"
                        onHide={() => {
                            setShowTemplateModal(false);
                            setWhichHover({});
                            setSelectedTemplateSave({});
                            setNewTemplateName("");
                        }}
                        SubmitButton={SubmitButton}
                    >
                        <div>
                            <div>
                                <h5 className="text-center">
                                    Save to existing template
                                </h5>

                                <hr />

                                {templates.map((temp) => {
                                    return (
                                        <div key={temp.TemplateID}>
                                            <div
                                                xs={11}
                                                style={{ paddingRight: 0 }}
                                            >
                                                <div
                                                    style={{
                                                        marginTop: 5,
                                                        marginBottom: 5,
                                                        cursor: "pointer",
                                                    }}
                                                    onMouseEnter={() =>
                                                        setWhichHover(temp)
                                                    }
                                                    onMouseLeave={() =>
                                                        setWhichHover({})
                                                    }
                                                    onClick={() =>
                                                        handleTemplateSelect(
                                                            temp
                                                        )
                                                    }
                                                    className={
                                                        (Object.values(
                                                            selectedTemplateSave
                                                        ).length === 0
                                                            ? whichHover.TemplateID ===
                                                              temp.TemplateID
                                                                ? "shadow-sm border-primary"
                                                                : ""
                                                            : selectedTemplateSave.TemplateID ===
                                                              temp.TemplateID
                                                            ? "border-primary shadow"
                                                            : "disable-card") +
                                                        " template-card mx-auto"
                                                    }
                                                >
                                                    <div
                                                        style={{
                                                            padding: "0.5rem",
                                                        }}
                                                        className="text-center"
                                                    >
                                                        <h5
                                                            style={{
                                                                marginLeft: 20,
                                                            }}
                                                        >
                                                            {temp.TemplateName}
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                            <div
                                                xs={1}
                                                style={{ paddingLeft: 5 }}
                                            >
                                                <Tippy
                                                    content={`Delete ${temp.TemplateName}`}
                                                >
                                                    <button
                                                        disabled={
                                                            Object.values(
                                                                selectedTemplateSave
                                                            ).length !== 0
                                                                ? selectedTemplateSave.TemplateID !==
                                                                  temp.TemplateID
                                                                : false
                                                        }
                                                        onClick={() =>
                                                            handleDeleteTemplateSubmit(
                                                                temp
                                                            )
                                                        }
                                                        onMouseEnter={() =>
                                                            setWhichHover({})
                                                        }
                                                        style={{
                                                            marginTop: 10,
                                                            padding: "0.5rem",
                                                        }}
                                                    >
                                                        <i className="fas fa-times fa-lg template-delete-icon" />
                                                    </button>
                                                </Tippy>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                <h5 className="text-center">
                                    Save to new template
                                </h5>
                                <hr />
                                <div style={{ padding: 15 }}>
                                    <input
                                        type="text"
                                        placeholder="New Template Name"
                                        name="NewTemplateName"
                                        value={newTemplateName}
                                        onChange={handleNewNameChange}
                                    />
                                </div>
                            </div>
                        </div>
                    </Modal>
                    <ConfirmCloseModal
                        style={{ zIndex: 1010 }}
                        onHide={() => {
                            setShowConfirmModal(false);
                        }}
                        onConfirm={handleConfirm}
                        modalShow={showConfirmModal}
                        body="Saving this template will overwrite its current template."
                        title="Overwrite saved template"
                        confirmButtonText="Overwrite"
                    />
                    <ConfirmCloseModal
                        style={{ zIndex: 1010 }}
                        onHide={() => {
                            setShowConfirmLoadModal(false);
                        }}
                        onConfirm={handleConfirmLoadTemplate}
                        modalShow={showConfirmLoadModal}
                        body="Loading this template will overwrite entries in your current timesheet."
                        title="Overwrite current timesheet"
                        confirmButtonText="Load template"
                    />
                    <ConfirmCloseModal
                        style={{ zIndex: 1010 }}
                        onHide={() => {
                            setShowConfirmDeleteModal(false);
                        }}
                        onConfirm={handleConfirmDeleteTemplate}
                        modalShow={showConfirmDeleteModal}
                        body="This template will be gone forever."
                        title="Delete Template"
                        confirmButtonText="Delete"
                    />
                </Suspense>
            </ErrorBoundary>
        </>
    );
};

TimesheetTemplateInput.propTypes = {
    templates: PropTypes.array.isRequired,
    userInfo: PropTypes.object.isRequired,
    createTemplateDispatch: PropTypes.func.isRequired,
    readTemplateDispatch: PropTypes.func.isRequired,
    updateTemplateDispatch: PropTypes.func.isRequired,
    deleteTemplateDispatch: PropTypes.func.isRequired,
    disableModification: PropTypes.bool.isRequired,
    timesheet: PropTypes.object.isRequired,
    timesheetEntries: PropTypes.array.isRequired,
    setIsLocked: PropTypes.func,
};

const mapDispatchToProps = {
    readTemplateDispatch,
    createTemplateDispatch,
    updateTemplateDispatch,
    deleteTemplateDispatch,
};

export default connect(null, mapDispatchToProps)(TimesheetTemplateInput);
