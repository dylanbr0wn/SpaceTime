import React, { useState, useCallback } from "react";
import { Button, Nav } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { useSpring, animated, useTransition } from "react-spring";
import Tippy from "@tippyjs/react";
import MediaQuery from "react-responsive";

import { saveEmployeePreferencesDispatch } from "../../redux/actions/currentUserActions";

import "../style/Sidebar.css";
import { Link } from "react-router-dom";

/**
 * @name Sidebar
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Sidebar navigation menu.
 */
const Sidebar = ({
    user,
    saveEmployeePreferencesDispatch,
    sidebarPin,
    isTablet,
}) => {
    const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

    // React Spring hook. used for animating the position of the sidebar
    const { transform } = useSpring({
        transform:
            sidebarIsOpen || (sidebarPin.Value && !isTablet)
                ? "translateX(0%)"
                : "translateX(-90%)",
    });

    // React Spring hook. used for animating the position of the sidebar
    const transitions = useTransition(
        sidebarIsOpen || (sidebarPin.Value && !isTablet),
        null,
        {
            from: { position: "absolute", opacity: 0 },
            enter: { opacity: 1 },
            leave: { opacity: 0 },
        }
    );

    // Handle mouse movement over the sidebar, idicating sidebar to open.
    const handleMouseAction = useCallback(
        action => {
            if (!sidebarPin.Value || isTablet) {
                setSidebarIsOpen(action);
            }
        },
        [sidebarPin.Value, isTablet]
    );

    // Handle the pin sidebar button press.
    const handlePinSidebar = action => {
        // setSidebarPinToggle(action);
        saveEmployeePreferencesDispatch(
            user.EmployeeID,
            sidebarPin.PreferenceID,
            action,
            sidebarPin.EmployeePreferenceID
        );
    };

    return (
        <>
            <MediaQuery minWidth={768}>
                <animated.div
                    onMouseLeave={() => handleMouseAction(false)}
                    onMouseEnter={() => handleMouseAction(true)}
                    className={"nav nav-pills sidebar d-md-block flex-column"}
                    style={{ width: isTablet ? "22vw" : "16vw", transform }}
                >
                    <>
                        {transitions.map(({ item, key, props }) =>
                            item ? (
                                <animated.div
                                    key={key}
                                    style={{
                                        ...props,
                                        height: "100vh",
                                        minHeight: 550,
                                        margin: 0,
                                        width: isTablet ? "22vw" : "16vw",
                                        padding: 10,
                                    }}
                                >
                                    {!isTablet && (
                                        <Button
                                            variant="link"
                                            style={{
                                                position: "absolute",
                                                top: 10,
                                                right: 10,
                                                color: "white",
                                            }}
                                            onClick={() =>
                                                handlePinSidebar(
                                                    !sidebarPin.Value
                                                )
                                            }
                                            aria-label="Pin sidebar"
                                        >
                                            {sidebarPin.Value ? (
                                                <Tippy
                                                    content={`Un-pin sidebar`}
                                                >
                                                    <i className="fas fa-eye-slash fa-lg" />
                                                </Tippy>
                                            ) : (
                                                <Tippy content={`Pin sidebar`}>
                                                    <i className="fas fa-thumbtack  fa-lg" />
                                                </Tippy>
                                            )}
                                        </Button>
                                    )}

                                    <div className="sidebar-heading">
                                        Langford
                                    </div>
                                    <div className="sidebar-subheading">
                                        Timesheet System
                                    </div>
                                    <div className="navSubList">Employee</div>
                                    <div className="nav-item navitem">
                                        <LinkContainer
                                            exact
                                            to={`/timesheet/${user.EmployeeID}`}
                                        >
                                            <Nav.Link className="navlink">
                                                Timesheet
                                            </Nav.Link>
                                        </LinkContainer>
                                    </div>

                                    {user.IsSupervisor && (
                                        <>
                                            <div className="navSubList">
                                                Manager
                                            </div>
                                            <div className="nav-item navitem">
                                                <LinkContainer
                                                    to={`/managerDashboard`}
                                                >
                                                    <Nav.Link className="navlink">
                                                        Manager Dashboard
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </div>
                                        </>
                                    )}
                                    {user.IsAdministrator && (
                                        <>
                                            <div className="navSubList">
                                                Administrator
                                            </div>
                                            <Nav.Item className="navitem">
                                                <LinkContainer to="/employeeAdmin">
                                                    <Nav.Link className="navlink">
                                                        Employees
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </Nav.Item>
                                            <Nav.Item className="navitem">
                                                <LinkContainer to="/departmentAdmin">
                                                    <Nav.Link className="navlink">
                                                        Departments
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </Nav.Item>
                                            <Nav.Item className="navitem">
                                                <LinkContainer to="/projectAdmin">
                                                    <Nav.Link className="navlink">
                                                        Projects
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </Nav.Item>
                                            <Nav.Item className="navitem">
                                                <LinkContainer to="/workCodeAdmin">
                                                    <Nav.Link className="navlink">
                                                        Work Codes
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </Nav.Item>
                                        </>
                                    )}
                                    {(user.IsAdministrator ||
                                        user.IsPayrollClerk) && (
                                        <>
                                            <div className="navSubList">
                                                Payroll Clerk
                                            </div>
                                            <Nav.Item className="navitem">
                                                <LinkContainer to="/clerkDashboard">
                                                    <Nav.Link className="navlink">
                                                        Tools
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </Nav.Item>
                                            <Nav.Item className="navitem">
                                                <LinkContainer to="/payrollTimesheetDashboard">
                                                    <Nav.Link className="navlink">
                                                        Payroll Dashboard
                                                    </Nav.Link>
                                                </LinkContainer>
                                            </Nav.Item>
                                        </>
                                    )}
                                    <Tippy
                                        content={`Information and Preferences`}
                                    >
                                        <Link
                                            to="/settings"
                                            className="settingsButtonContainer"
                                        >
                                            <div
                                                style={{ color: "white" }}
                                                className="fas fa-cog settingsButton"
                                            ></div>
                                        </Link>
                                    </Tippy>
                                </animated.div>
                            ) : (
                                <animated.div
                                    key={key}
                                    style={{
                                        ...props,
                                        right: isTablet ? "0.3vw" : "0.5vw",
                                        top: "50vh",
                                    }}
                                >
                                    <i
                                        style={{ color: "white" }}
                                        className="fas fa-angle-double-left"
                                    />
                                </animated.div>
                            )
                        )}
                    </>
                </animated.div>
            </MediaQuery>
        </>
    );
};

Sidebar.propTypes = {
    user: PropTypes.object.isRequired,
    saveEmployeePreferencesDispatch: PropTypes.func.isRequired,
    sidebarPin: PropTypes.object.isRequired,
    isTablet: PropTypes.bool,
};

const mapStateToProps = state => ({
    user: state.currentUser.user,
    sidebarPin: state.currentUser.preferences.SidebarPin ?? {},
});

const mapDispatchToProps = {
    saveEmployeePreferencesDispatch,
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
