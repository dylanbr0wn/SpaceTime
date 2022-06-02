import cuid from "cuid";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    Reference,
    useMutation,
    useQuery,
    useReactiveVar,
} from "@apollo/client";
// import Tooltip from "../../Tooltip";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { animated, useSpring } from "@react-spring/web";

import {
    EntryRowOptionDocument,
    FieldOption,
    IsChanged,
    shaker as shakerVar,
    UpdateEntryRowOptionDocument,
    usedRows as usedRowsVar,
} from "../../../lib/apollo";
import ErrorBoundary from "../../common/ErrorBoundary";
import { TimeEntryRow } from "../types";

import { useFieldOptions } from "./hooks";

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
}: {
    row: TimeEntryRow | undefined;
    fieldId: string;
    userId: string;
    timesheetId: string;
    tenantId: string;
    fieldName: string;
}) => {
    const [field, setField] = useState<FieldOption | null>(null);
    const [shake, setShake] = React.useState(false);

    const { data: optionData } = useQuery(EntryRowOptionDocument, {
        variables: {
            fieldId,
            rowId: row?.id ?? "-1",
        },
        skip: row?.rowOptions?.length === 0, // Skip if no options
    });

    const { fieldInfo } = useFieldOptions(
        fieldId,
        row,
        optionData?.entryRowOption.id
    );

    // const { data: fieldData } = useQuery(FieldDocument, {
    //     variables: {
    //         id: fieldId,
    //     },
    // });

    const shaker = useReactiveVar(shakerVar);

    const usedRows = useReactiveVar(usedRowsVar);

    const [updateEntryRowOption] = useMutation(UpdateEntryRowOptionDocument);

    // When changed, dispatch api call and redux action.
    const onChange = async (_field: FieldOption) => {
        setShake(false);
        if (_field.id === field?.id) return;
        const thisRow = (usedRows[row?.id ?? "-1"] ?? []).filter(
            (f) => f !== field?.id
        );
        const newRow = [...thisRow, _field.id];

        const result = Object.keys(usedRows).find((r) =>
            _.isEmpty(_.xor(usedRows[r], newRow))
        );

        if (result) {
            notify("You cannot select the same option twice.");
            shakerVar([result, _field.id]);
            // setShake(true);
            return;
        }

        usedRowsVar({
            ...usedRows,
            [row?.id ?? "-1"]: newRow,
        });

        setField(_field);

        await updateEntryRowOption({
            variables: {
                fieldId,
                rowId: row?.id ?? "-1",
                fieldOptionId: _field.id,
            },
            optimisticResponse: {
                updateEntryRowOption: {
                    __typename: "EntryRowOption",
                    id: optionData?.entryRowOption.id ?? cuid(),
                    createdAt: row?.createdAt ?? new Date(),
                    updatedAt: row?.updatedAt ?? new Date(),
                    fieldOption: {
                        __typename: "FieldOption",
                        id: _field.id,
                        name: _field.name,
                        isActive: _field.isActive,
                        createdAt: _field.createdAt,
                        updatedAt: _field.updatedAt,
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
                        rowOptions(
                            existingRowRefs: Reference[] = [],
                            { readField }
                        ) {
                            if (!data?.updateEntryRowOption)
                                return existingRowRefs;
                            // need to create a new ref
                            const newOptionRef = cache.writeQuery({
                                query: EntryRowOptionDocument,
                                id: cache.identify({
                                    // without this we get the root query back
                                    __typename: "EntryRowOption",
                                    id: data.updateEntryRowOption.id,
                                }),
                                variables: {
                                    fieldId,
                                    rowId: row?.id ?? "-1",
                                },
                                data: {
                                    // use the data from the mutation
                                    entryRowOption: data?.updateEntryRowOption,
                                },
                            });
                            // if ref exists, replace it
                            const newRowOptions = existingRowRefs.filter(
                                (option) =>
                                    readField("id", option) !==
                                    data?.updateEntryRowOption.id
                            );
                            return [...newRowOptions, newOptionRef];
                        },
                    },
                });
            },
        });
        IsChanged(true);
    };

    // React.useEffect(() => {
    //     if (!shake) {
    //         return;
    //     }
    //     setShake(true);
    //     const timeoutId = window.setTimeout(() => {
    //         setShake(false);
    //     }, 300);
    //     return () => {
    //         window.clearTimeout(timeoutId);
    //     };
    // }, [shake]);

    React.useEffect(() => {
        const animateOnOff = async () => {
            for (let i = 0; i < 2; i++) {
                setShake(true);
                await new Promise((resolve) => setTimeout(resolve, 150));
                setShake(false);
                await new Promise((resolve) => setTimeout(resolve, 150));
            }
        };
        if (!shaker) {
            return;
        }
        if (shaker[0] === row?.id && shaker[1] === field?.id) {
            animateOnOff();
            const timeoutId = window.setTimeout(() => {
                shakerVar(["", ""]);
            }, 150);
            return () => {
                window.clearTimeout(timeoutId);
            };
        }
    }, [shaker, fieldId, row?.id, field?.id]);

    const styles = useSpring({
        x: shaker[0] === row?.id && shaker[1] === field?.id ? -5 : 0,
        config: {
            tension: 400,
            friction: 3,
            mass: 0.5,
        },
    });

    // If the initialValue is changed external, sync it up with our state
    useEffect(() => {
        if (optionData?.entryRowOption && fieldInfo) {
            const field = fieldInfo.fieldOptions.find(
                (dep) => dep.id === optionData.entryRowOption.fieldOption.id
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
                                    className={`relative text-sm outline outline-offset-2 w-full text-base-content h-10 py-2 pl-3 pr-10 border border-base-content/20 text-left rounded-lg
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
                            </animated.div>
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