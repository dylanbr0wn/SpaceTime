import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { updateTimeEntryRowDispatch } from "../../../../redux/actions/timesheetsActions";
import {
    allowedWorkCodesSelector,
    unusedWorkCodesSelector,
} from "../../../../services/selectors";
import ErrorBoundary from "../../ErrorBoundary";

import "../../../style/TimeEntry.css";

/**
 * @name TimesheetWorkCodeInput
 * @component
 * @category Time Entry
 * @description Input for Work Code.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetWorkCodeInput = ({
    value,
    row,
    column: { id },
    disableModification,

    EmployeeID,
    setIsLocked,
    timeEntryPeriodStartDate,
    isTablet,
    workCodes,
    data,
    type,
}) => {
    // We need to keep and update the state of the cell normally
    const [stateValue, setStateValue] = useState(value);

    const allWorkCodes = useSelector((state) => state.workCodes);
    // const allowedWorkCodes = useSelector((state) =>
    //     allowedWorkCodesSelector(state, { workCodes, row, data })
    // );
    // const unusedWorkCodes = useSelector((state) =>
    //     unusedWorkCodesSelector(state, { workCodes, row, data })
    // );

    const dispatch = useDispatch();
    // const [validWorkCodes, setValidWorkCodes] = useState([]);

    // When changed, dispatch api call and redux action.
    const onChange = async (workCode) => {
        setStateValue(workCode);
        // setSkipPageReset(true);
        const result = await dispatch(
            updateTimeEntryRowDispatch(
                row.index,
                parseInt(workCode.WorkCodeID),
                id,
                {
                    ...row.original,
                    [id]: parseInt(workCode.WorkCodeID),
                },
                EmployeeID,
                timeEntryPeriodStartDate
            )
        );
        if (!result.success) {
            if (result.status === 423) {
                setIsLocked(true);
            }
            toast.warn(result.data);
        }
    };

    // Set info field for workcode
    useEffect(() => {
        let workCode = workCodes.find((code) => code.WorkCodeID === value);
        if (!workCode) {
            workCode = allWorkCodes.find((code) => code.WorkCodeID === value);
        }
        setStateValue(workCode ?? {});
    }, [allWorkCodes, value, workCodes]);

    return (
        <>
            <ErrorBoundary>
                <div className=" w-36">
                    <Listbox
                        aria-label="Project Input"
                        value={stateValue}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={disableModification}
                    >
                        <div className="relative mt-1">
                            <Listbox.Button
                                className={
                                    "relative w-full py-2 pl-3 pr-10 text-left  focus:outline-none focus-visible:ring-2 focus-visible:ring-opacity-75 focus-visible:ring-white focus-visible:ring-offset-cyan-300 focus-visible:ring-offset-2 focus-visible:border-cyan-500 sm:text-sm cursor-pointer"
                                }
                            >
                                <span
                                    className={`block truncate ${
                                        stateValue.Description
                                            ? "text-sky-200"
                                            : "text-slate-400"
                                    }`}
                                >
                                    {stateValue.Description ??
                                        "Choose a Work Code..."}
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
                                <Listbox.Options className="absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-slate-800 rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                    {workCodes.map((workCode) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-sky-300 bg-slate-700"
                                                            : "text-sky-400"
                                                    }`
                                                }
                                                value={workCode}
                                                key={workCode.WorkCodeID}
                                                //  onSelect={() => setProjectFocused(false)}
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
                                                            {
                                                                workCode.Description
                                                            }
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
                                    {/* {unusedWorkCodes.map((workCode) => {
                                        return (
                                            <Listbox.Option
                                                className={({ active }) =>
                                                    `cursor-pointer select-none relative py-2 pl-10 pr-4 ${
                                                        active
                                                            ? "text-sky-300 bg-slate-700"
                                                            : "text-sky-400"
                                                    }`
                                                }
                                                hidden={type === "user"}
                                                disabled={type === "user"}
                                                value={workCode}
                                                key={workCode.WorkCodeID}
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
                                                            {
                                                                workCode.Description
                                                            }
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
                                    })} */}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    </Listbox>
                </div>
            </ErrorBoundary>
        </>
    );
};

export default TimesheetWorkCodeInput;
