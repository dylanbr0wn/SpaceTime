import cuid from "cuid";
import React, { useEffect, useState } from "react";

import { useMutation, useQuery } from "@apollo/client";
// import Tooltip from "../../Tooltip";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import {
    EntryRowOptionDocument,
    FieldDocument,
    FieldOption,
    IsChanged,
    UpdateEntryRowOptionDocument,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import { TimeEntryRow } from "../types";

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
}: {
    row: TimeEntryRow | undefined;
    fieldId: string;
    userId: string;
    timesheetId: string;
    tenantId: string;
    fieldName: string;
}) => {
    const [field, setField] = useState<FieldOption | null>(null);

    const { data: optionData, loading } = useQuery(EntryRowOptionDocument, {
        variables: {
            fieldId,
            rowId: row?.id ?? "-1",
        },
    });

    const { data: fieldData } = useQuery(FieldDocument, {
        variables: {
            id: fieldId,
        },
    });

    const [updateEntryRowOption] = useMutation(UpdateEntryRowOptionDocument);

    // When changed, dispatch api call and redux action.
    const onChange = async (field: FieldOption) => {
        // setDepartment(department);
        setField(field);

        await updateEntryRowOption({
            variables: {
                fieldId,
                rowId: row?.id ?? "-1",
                fieldOptionId: field.id,
            },
            optimisticResponse: {
                updateEntryRowOption: {
                    __typename: "EntryRowOption",
                    id: optionData?.entryRowOption.id ?? cuid(),
                    createdAt: row?.createdAt ?? new Date(),
                    updatedAt: row?.updatedAt ?? new Date(),
                    fieldOption: {
                        __typename: "FieldOption",
                        id: field.id,
                        name: field.name,
                        isActive: field.isActive,
                        createdAt: field.createdAt,
                        updatedAt: field.updatedAt,
                    },
                },
            },
            update: (cache, { data }) => {
                cache.modify({
                    id: cache.identify({
                        __typename: "TimeEntryRow",
                        id: row?.id ?? "-1",
                    }),
                    fields: {
                        rowOptions(existingRowOptions = []) {
                            const newRowOptions = [
                                ...existingRowOptions,
                                data?.updateEntryRowOption,
                            ];
                            return newRowOptions;
                        },
                    },
                });
            },
        });
        IsChanged(true);
    };

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        if (optionData?.entryRowOption && fieldData?.field) {
            const field = fieldData?.field.fieldOptions.find(
                (dep) => dep.id === optionData.entryRowOption.fieldOption.id
            );
            setField((field as FieldOption) ?? null);
        }
    }, [optionData, fieldData]);

    return (
        <>
            <ErrorBoundary>
                {fieldData?.field && !loading && (
                    <Listbox
                        aria-label={`${fieldName} Input`}
                        value={field}
                        onChange={onChange}
                        // onBlur={onBlur}
                        disabled={false}
                    >
                        {({ open }) => (
                            <div className="w-full relative">
                                <Listbox.Button
                                    className={`relative text-sm outline outline-offset-2 w-full text-base-content h-10 py-2 pl-3 pr-10 border border-base-content/20 text-left rounded-lg
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
                                        {fieldData?.field.fieldOptions.map(
                                            (department) => {
                                                return (
                                                    <Listbox.Option
                                                        className={({
                                                            active,
                                                        }) =>
                                                            `cursor-pointer rounded-lg select-none relative py-2 pl-10 pr-4 ${
                                                                active
                                                                    ? "text-white bg-primary"
                                                                    : "text-primary"
                                                            }`
                                                        }
                                                        value={department}
                                                        key={department.id}
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
                                                                        department.name
                                                                    }
                                                                </span>
                                                                {selected ? (
                                                                    <span
                                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3`}
                                                                    >
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
                                            }
                                        )}
                                    </Listbox.Options>
                                </Transition>
                            </div>
                        )}
                    </Listbox>
                )}

                {/* {!loading && */}

                {/* } */}
            </ErrorBoundary>
        </>
    );
};

export default TimesheetDepartmentInput;
