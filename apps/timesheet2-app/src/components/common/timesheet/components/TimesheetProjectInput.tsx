import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { updateTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import {
    createValidProjectsSelector,
    getComputedData,
} from "../../../../services/selectors";
import { checkValidProject } from "../../../../services/utils";
import ErrorBoundary from "../../ErrorBoundary";

import "../../../style/TimeEntry.css";
import { useProjectsQuery } from "../../../../api";

/**
 * @name TimesheetProjectInput
 * @component
 * @category Time Entry
 * @description Input for Projects
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */

const TimesheetProjectInput = ({ value, row, column: { id }, userId }) => {
    // We need to keep and update the state of the cell normally
    const [stateValue, setStateValue] = useState({});
    //const projectsSelector = useMemo(createValidProjectsSelector, []);
    //const computedDataSelector = useMemo(getComputedData, []);
    //const projects = useSelector((state) => projectsSelector(state, row));
    // const computedData = useSelector((state) =>
    //     computedDataSelector(state, data)
    // );

    const { data, error, loading } = useProjectsQuery();

    const departmentID = useSelector(() => row.original.department.id);
    //const dispatch = useDispatch();

    // When changed, dispatch api call and redux action.
    const onChange = (project) => {
        console.log(project);
        // const ProjectID = parseInt(project.ProjectID);

        // // Checks
        // if (ProjectID === -1) return;
        // // Need to do check to make sure we arnt forcing a duplicate state
        // if (
        //     checkValidProject(
        //         ProjectID,
        //         computedData,
        //         workCodes,
        //         row.original.WorkCodeID
        //     )
        // ) {
        //     toast.warn(
        //         "Invalid project selection. You have already used all the available work codes for this project."
        //     );
        //     return;
        // }

        // setStateValue(project);
        // updateProject(ProjectID);
    };

    // const updateProject = useCallback(
    //     async (newValue) => {
    //         const result = await dispatch(
    //             updateTimeEntryRowDispatch(
    //                 row.index,
    //                 newValue,
    //                 id,
    //                 {
    //                     ...row.original,
    //                     ProjectID: newValue,
    //                 },
    //                 EmployeeID,
    //                 timeEntryPeriodStartDate
    //             )
    //         );
    //         if (!result.success) {
    //             if (result.status === 423) {
    //                 setIsLocked(true);
    //             }
    //             toast.warn(result.data);
    //         }
    //     },
    //     [
    //         EmployeeID,
    //         id,
    //         row.index,
    //         row.original,
    //         setIsLocked,
    //         timeEntryPeriodStartDate,
    //         dispatch,
    //     ]
    // );

    // Updates project value based on currently valid projects.
    useEffect(() => {
        // if (value === -1) {
        //     setStateValue({});
        // }
        // if (projects.length > 0) {
        // if there are no applicable projects, set to defualt
        if (data?.projects) {
            const project = data.projects.find(
                (project) => project.id === value
            );
            setStateValue(project ?? {});
        }

        //     if (!project) {
        //         // If project is not in list

        //         setStateValue({});
        //     } else {
        //         if (project.IsActive && !disableModification) {
        //             setStateValue(project);
        //         }

        //         // setProjectInfo(project || {});
        //     }
        // } else {

        // }

        // if not equal than other effect has not yet run
    }, [data, value]);

    return (
        <>
            <ErrorBoundary>
                <div className="w-56 ">
                    <Listbox
                        aria-label="Project Input"
                        value={stateValue}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={false}
                    >
                        <div>
                            <Listbox.Button
                                className={` ${
                                    false || departmentID === -1
                                        ? "bg-slate-800"
                                        : "bg-slate-900"
                                } relative w-full py-2 pl-3 pr-10 h-10 text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500 sm:text-sm cursor-pointer`}
                            >
                                <span
                                    className={`block truncate ${
                                        stateValue.name
                                            ? "text-sky-200"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {stateValue.name ?? "Choose a Project..."}
                                </span>
                                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                    <SelectorIcon
                                        className="w-5 h-5 text-slate-400"
                                        aria-hidden="true"
                                    />
                                </span>
                            </Listbox.Button>
                            <Transition
                                as={React.Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <Listbox.Options className="absolute z-10 py-1 mt-1 overflow-auto text-base bg-slate-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {data?.projects.map((project) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-sky-300 bg-slate-700"
                                                            : "text-sky-400"
                                                    }`
                                                }
                                                value={project}
                                                key={project.id}
                                                //  onSelect={() => setProjectFocused(false)}
                                                hidden={!project.isActive}
                                                disabled={!project.isActive}
                                            >
                                                {({ selected }) => (
                                                    <>
                                                        <span
                                                            className={`block truncate ${
                                                                selected
                                                                    ? "font-medium"
                                                                    : "font-normal"
                                                            }`}
                                                        >
                                                            {project.name}
                                                        </span>
                                                        {selected ? (
                                                            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sky-400">
                                                                <CheckIcon
                                                                    className="w-5 h-5"
                                                                    aria-hidden="true"
                                                                />
                                                            </span>
                                                        ) : null}
                                                    </>
                                                )}
                                            </Listbox.Option>
                                        );
                                    })}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetProjectInput;
