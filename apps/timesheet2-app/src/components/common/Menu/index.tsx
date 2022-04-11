import * as React from "react";
import { connect, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Popover, Transition } from "@headlessui/react";
import Tippy from "@tippyjs/react";

import ErrorBoundary from "../ErrorBoundary";

import NavButton from "./NavLinkButton";
import NavMenuButton from "./NavMenuButton";
import NavSubTitle from "./NavSubTitle";

/**
 * @name Sidebar
 * @component
 * @category Common Components
 * @param {Object} props Props. See propTypes for details.
 * @description Sidebar navigation menu.
 */
const Menu = ({ isTablet }) => {
    const user = useSelector((state) => state.currentUser.user);

    const sidebarPin = useSelector(
        (state) => state.currentUser.preferences.SidebarPin
    );

    return (
        <ErrorBoundary>
            <div className="w-full h-16 rounded-lg flex">
                <Popover style={{ zIndex: 500 }}>
                    {({ open }) => (
                        <>
                            <NavMenuButton open={open} />
                            <Transition
                                as={React.Fragment}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0 translate-y-1"
                                enterTo="opacity-100 translate-y-0"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100 translate-y-0"
                                leaveTo="opacity-0 translate-y-1"
                            >
                                <Popover.Panel className="">
                                    <div className=" flex flex-col mt-2">
                                        {/* <MediaQuery minWidth={768}> */}
                                        <div
                                            className={
                                                "p-0.5 rounded-lg text-base bg-gradient-to-br from-cyan-500 to-blue-500"
                                            }
                                            // style={{ width: isTablet ? "22vw" : "16vw", transform }}
                                        >
                                            <div className="bg-slate-900 rounded-lg flex flex-col p-3 ">
                                                {!isTablet && (
                                                    <button
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: 10,
                                                            right: 10,
                                                            color: "white",
                                                        }}
                                                        aria-label="Pin sidebar"
                                                    >
                                                        {sidebarPin.Value ? (
                                                            <Tippy
                                                                content={`Un-pin sidebar`}
                                                            >
                                                                <i className="fas fa-eye-slash fa-lg" />
                                                            </Tippy>
                                                        ) : (
                                                            <Tippy
                                                                content={`Pin sidebar`}
                                                            >
                                                                <i className="fas fa-thumbtack  fa-lg" />
                                                            </Tippy>
                                                        )}
                                                    </button>
                                                )}

                                                <NavSubTitle
                                                    title={"Employee"}
                                                />

                                                <NavButton
                                                    icon={
                                                        <svg
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="h-6 w-6"
                                                            fill="none"
                                                            viewBox="0 0 24 24"
                                                            stroke="currentColor"
                                                            strokeWidth={2}
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                            />
                                                        </svg>
                                                    }
                                                    title={"Timesheet"}
                                                    url={`/timesheet/${user.EmployeeID}`}
                                                />

                                                {user.IsSupervisor && (
                                                    <>
                                                        <NavSubTitle
                                                            title={"Manager"}
                                                        />
                                                        <NavButton
                                                            icon={
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                                    />
                                                                </svg>
                                                            }
                                                            title={
                                                                "Manager Dashboard"
                                                            }
                                                            url={`/managerDashboard`}
                                                        />
                                                    </>
                                                )}
                                                {user.IsAdministrator && (
                                                    <>
                                                        <NavSubTitle
                                                            title={
                                                                "Administrator"
                                                            }
                                                        />
                                                        <NavButton
                                                            title={"Employees"}
                                                            url={`/employeesAdmin`}
                                                        />
                                                        <NavButton
                                                            title={
                                                                "Departments"
                                                            }
                                                            url={`/departmentsAdmin`}
                                                        />
                                                        <NavButton
                                                            title={"Projects"}
                                                            url={`/projectsAdmin`}
                                                        />
                                                        <NavButton
                                                            title={"Work Codes"}
                                                            url={`/workCodeAdmin`}
                                                        />
                                                    </>
                                                )}
                                                {(user.IsAdministrator ||
                                                    user.IsPayrollClerk) && (
                                                    <>
                                                        <NavSubTitle
                                                            title={
                                                                "Payroll Clerk"
                                                            }
                                                        />
                                                        <NavButton
                                                            icon={
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                                                                    />
                                                                </svg>
                                                            }
                                                            title={"Tools"}
                                                            url={`/clerkDashboard`}
                                                        />
                                                        <NavButton
                                                            icon={
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    className="h-6 w-6"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                                                    />
                                                                </svg>
                                                            }
                                                            title={
                                                                "Payroll Dashboard"
                                                            }
                                                            url={`/payrollTimesheetDashboard`}
                                                        />
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
                                                            style={{
                                                                color: "white",
                                                            }}
                                                            className="fas fa-cog settingsButton"
                                                        ></div>
                                                    </Link>
                                                </Tippy>
                                            </div>
                                        </div>
                                    </div>
                                </Popover.Panel>
                            </Transition>
                        </>
                    )}
                </Popover>

                <div className="w-full"></div>
            </div>
        </ErrorBoundary>
    );
};

export default Menu;
