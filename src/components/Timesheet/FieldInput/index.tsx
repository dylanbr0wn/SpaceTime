import cuid from "cuid";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

// import {
//     Reference,
//     useMutation,
//     useQuery,
//     useReactiveVar,
// } from "@apollo/client";
// import Tooltip from "../../Tooltip";
import { Listbox, Transition } from "@headlessui/react";
import { SelectorIcon } from "@heroicons/react/solid";
import { animated } from "@react-spring/web";
import ErrorBoundary from "../../common/ErrorBoundary";
// import { TimeEntryRow } from "../types";

import FieldInputOption from "./FieldOption";
import { useFieldOptions, useShaker } from "./hooks";
import { FieldOption, TimeEntryRow } from "../../../utils/types/zod";
import { trpc } from "../../../utils/trpc";
import { useStore } from "../../../utils/store";

const notify = (error: string) => toast.error(error);

/**
 * @name TimesheetDepartmentInput
 * @component
 * @category Time Entry
 * @description Input for Department.
 * Provides an dropdown menu with filtered options.
 * @param {Object} props Props. See propTypes for details.
 */
const TimesheetDepartmentInput = ({
    row,
    fieldId,
    userId,
    timesheetId,
    tenantId,
    fieldName,
    maxOptions,
}: {
    row: TimeEntryRow & {
        entryRowOptions: {
            id: string;
        }[]
    } | undefined;
    fieldId: string;
    userId: string;
    timesheetId: string;
    tenantId: string;
    fieldName: string;
    maxOptions: number;
}) => {
    const [field, setField] = useState<FieldOption | null>(null);

    const { data: optionData } = trpc.useQuery(["entryRowOption.read", { fieldId,
            rowId: row?.id ?? "-1",}], {
       
        enabled: row?.entryRowOptions.length !== 0, // Skip if no options
    });

    const { fieldInfo } = useFieldOptions(
        fieldId,
        row,
        optionData?.fieldOption.id
    );

    const {usedRows, setUsedRows, setIsChanged} = useStore((state) => ({
        usedRows: state.usedRows,
        setUsedRows: state.setUsedRows,
        setIsChanged: state.setIsChanged,
    }));

    const { setShake, shake, styles, setShaker } = useShaker(row, field);

    const updateEntryRowOption = trpc.useMutation(["entryRowOption.update"]);

    // When changed, dispatch api call and redux action.
    const onChange = async (_field: FieldOption) => {
        setShake(false);
        if (_field.id === field?.id) return;
        const thisRow = (usedRows[row?.id ?? "-1"] ?? []).filter(
            (f) => f !== field?.id
        );
        const newRow = [...thisRow, _field.id];

        const result = Object.keys(usedRows).find(
            (r) =>
                _.isEmpty(_.xor(usedRows[r], newRow)) &&
                r !== row?.id &&
                usedRows[r]?.length === maxOptions
        );

        if (result) {
            notify("You cannot select the same option twice.");
            setShaker([result, _field.id]);
            // setShake(true);
            return;
        }

        setUsedRows({
            ...usedRows,
            [row?.id ?? "-1"]: newRow,
        });

        setField(_field);

        await updateEntryRowOption.mutateAsync({

                fieldId,
                rowId: row?.id ?? "-1",
                fieldOptionId: _field.id,
            
            });
        setIsChanged(true);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        if (optionData && fieldInfo) {
            const field = fieldInfo.fieldOptions.find(
                (dep) => dep.id === optionData.fieldOption.id
            );
            setField((field as FieldOption) ?? null);
        }
    }, [optionData, fieldInfo]);

    return (
        <>
            <ErrorBoundary>
                {fieldInfo && (
                    <Listbox
                        aria-label={`${fieldName} Input`}
                        value={field}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={false}
                    >
                        {({ open }) => (
                            <animated.div
                                style={styles}
                                className={`w-full relative`}
                            >
                                <Listbox.Button
                                    className={`relative text-xs 2xl:text-sm outline outline-offset-2 w-full text-base-content h-10 py-2 pl-3 pr-10 border border-base-content/20 text-left rounded-lg
                                    transition-colors duration-150 ease-in-out ${
                                        shake && "bg-error"
                                    }
                                     focus:outline-none focus-visible:ring-2 bg-base-300
                                   ${
                                       open
                                           ? "outline-base-content/20"
                                           : "outline-transparent "
                                   } sm:text-sm cursor-pointer `}
                                >
                                    {field?.name ?? (
                                        <span
                                            className={`block truncate text-base-content/50`}
                                        >
                                            Choose a {fieldName.toLowerCase()}
                                            ...
                                        </span>
                                    )}
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                                        <SelectorIcon
                                            className="w-5 h-5 text-base-content"
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
                                    <Listbox.Options className="absolute z-10 w-full p-1 mt-1.5 overflow-auto text-base bg-base-300 border border-base-content/20 rounded-lg shadow-xl shadow-black/40 max-h-60 focus:outline-none sm:text-sm">
                                        {fieldInfo.fieldOptions.map(
                                            (option) => (
                                                <FieldInputOption
                                                    key={option.id}
                                                    option={option}
                                                />
                                            )
                                        )}
                                    </Listbox.Options>
                                </Transition>
                            </animated.div>
                        )}
                    </Listbox>
                )}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDepartmentInput;
