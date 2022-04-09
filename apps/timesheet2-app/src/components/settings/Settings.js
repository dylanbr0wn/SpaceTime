import React, { useEffect, useState } from "react";
import { Container, Card, FormCheck, Form } from "react-bootstrap";
import "../style/Settings.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ErrorBoundary from "../common/ErrorBoundary";
import { saveEmployeePreferencesDispatch } from "../../redux/actions/currentUserActions";
import readmePath from "../../CHANGELOG.md";
import ReactMarkdown from "react-markdown";
import { Button } from "react-bootstrap";
import Tippy from "@tippyjs/react";

/**
 * @name Settings
 * @param {Object} props Props. See propTypes for details.
 * @component
 * @category Settings
 * @description User settings page.
 * Displays limited lists of attributes about the currently logged in user.
 * Also Provides functionality for changing password.
 */
const Settings = ({ user, preferences, saveEmployeePreferencesDispatch }) => {
    const [emailOnSubmission, setEmailOnSubmission] = useState(true);
    const [templateOverwriteOnLoad, setTemplateOverwriteOnLoad] = useState(
        false
    );
    const [showChangelog, setShowChangelog] = useState(false);
    const [changelog, setChangelog] = useState("");

    useEffect(() => {
        fetch(readmePath)
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                setChangelog(text);
            });
    }, []);

    useEffect(() => {
        if (preferences.TemplateOverwrite) {
            setTemplateOverwriteOnLoad(preferences.TemplateOverwrite.Value);
        }
        if (preferences.EmailOnSubmit) {
            if (preferences.EmailOnSubmit.EmployeePreferenceID)
                setEmailOnSubmission(preferences.EmailOnSubmit.Value);
        }
    }, [preferences]);

    const onChange = ({ target }) => {
        if (target.name === "emailOnSubmission") {
            setEmailOnSubmission(target.checked);
            saveEmployeePreferencesDispatch(
                user.EmployeeID,
                preferences.EmailOnSubmit.PreferenceID,
                target.checked,
                preferences.EmailOnSubmit.EmployeePreferenceID
            );
        } else if (target.name === "templateOverwriteOnLoad") {
            setTemplateOverwriteOnLoad(target.checked);
            saveEmployeePreferencesDispatch(
                user.EmployeeID,
                preferences.TemplateOverwrite.PreferenceID,
                target.checked,
                preferences.TemplateOverwrite.EmployeePreferenceID
            );
        }
    };

    return (
        <>
            <Container fluid className="settingsContainer bg-light">
                <Card>
                    <ErrorBoundary>
                        <Card.Header className="text-center" as="h3">
                            Information and Preferences
                        </Card.Header>
                        <Card.Body>
                            <div>
                                <h4>User Information</h4>
                                <hr />
                                <dl className="row">
                                    <dt className="col-sm-2">Name</dt>
                                    <dd className="col-sm-10">
                                        {user.FirstName + " " + user.LastName}
                                    </dd>
                                    <dt className="col-sm-2">EmployeeID</dt>
                                    <dd className="col-sm-10">
                                        {user.EmployeeID}
                                    </dd>
                                    <dt className="col-sm-2">Department</dt>
                                    <dd className="col-sm-10">
                                        {user.DeptName}
                                    </dd>
                                    <dt className="col-sm-2">Role</dt>
                                    <dd className="col-sm-10">{user.Role}</dd>
                                    <dt className="col-sm-2">Account Status</dt>
                                    <dd className="col-sm-10">
                                        {user.ActiveStatus}
                                    </dd>
                                </dl>
                            </div>
                            <div>
                                <h4>Preferences</h4>
                                <hr />
                                <dl className="row">
                                    {user.IsSupervisor && (
                                        <>
                                            <dt className="col-sm-4">
                                                Email on subordinate submission
                                            </dt>
                                            <Form.Group
                                                controlId="emailOnSubmission"
                                                className="col-sm-8"
                                            >
                                                <FormCheck
                                                    type="switch"
                                                    label={
                                                        emailOnSubmission
                                                            ? "On"
                                                            : "Off"
                                                    }
                                                    name="emailOnSubmission"
                                                    checked={emailOnSubmission}
                                                    onChange={onChange}
                                                    custom
                                                />
                                            </Form.Group>
                                        </>
                                    )}
                                </dl>
                                <dl className="row">
                                    <dt className="col-sm-4">
                                        Overwrite current timesheet when loading
                                        a template
                                    </dt>
                                    <Form.Group
                                        className="col-sm-8"
                                        controlId="templateOverwriteOnLoad"
                                    >
                                        <FormCheck
                                            type="switch"
                                            label={
                                                templateOverwriteOnLoad
                                                    ? "On"
                                                    : "Off"
                                            }
                                            name="templateOverwriteOnLoad"
                                            checked={templateOverwriteOnLoad}
                                            onChange={onChange}
                                            custom
                                        />
                                    </Form.Group>
                                </dl>

                                {
                                    // Exisitng settings
                                }
                            </div>
                            <div style={{ marginTop: 10 }}>
                                <h4>
                                    Changelog
                                    <Tippy
                                        content={
                                            showChangelog
                                                ? "Hide changelog"
                                                : "Show changelog"
                                        }
                                    >
                                        <Button
                                            variant="link"
                                            className="changelogIcon"
                                            onClick={() =>
                                                setShowChangelog(
                                                    (state) => !state
                                                )
                                            }
                                        >
                                            {showChangelog ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                    }}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M20 12H4"
                                                    />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style={{
                                                        height: 20,
                                                        width: 20,
                                                    }}
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                                    />
                                                </svg>
                                            )}
                                        </Button>
                                    </Tippy>
                                </h4>
                                {showChangelog && (
                                    <>
                                        <hr />
                                        <div style={{ fontSize: 13 }}>
                                            <ReactMarkdown source={changelog} />
                                        </div>
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </ErrorBoundary>
                </Card>
            </Container>
        </>
    );
};

Settings.propTypes = {
    loading: PropTypes.bool.isRequired,
    preferences: PropTypes.object.isRequired,

    // Tracks if there is any ongoing API calls
    user: PropTypes.object.isRequired,
    // Currently logged in user
    saveEmployeePreferencesDispatch: PropTypes.func.isRequired,
    // Dispatcher function for changing a users password.
};

const mapStateToProps = (state) => {
    return {
        preferences: state.currentUser.preferences,
        loading: state.apiCallsInProgress > 0,
        user: state.currentUser
            ? {
                  ...state.currentUser.user,
                  Role: state.currentUser.user["IsAdministrator"]
                      ? "Administrator"
                      : state.currentUser.user["IsPayrollClerk"]
                      ? "Payroll Clerk"
                      : state.currentUser.user["IsSupervisor"]
                      ? "Manager"
                      : "Employee",
                  ActiveStatus: state.currentUser.user["IsActive"]
                      ? "Active"
                      : "Inactive",
              }
            : {},
    };
};

const mapDispatchToProps = {
    saveEmployeePreferencesDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
