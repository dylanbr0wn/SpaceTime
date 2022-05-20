import { useField } from "formik";
import * as React from "react";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { DepartmentsQuery, ManagersQuery } from "../../../lib/apollo";
import ErrorBoundary from "../ErrorBoundary";

const SelectInput = ({
    elements,
    label,
    placeholder,
    ...props
}: {
    elements: DepartmentsQuery["departments"] | ManagersQuery["managers"];
    validate: (value: any) => string | void | Promise<string | void>;
    label: string;
    name: string;
    placeholder: string;
}) => {
    const [field, meta, helpers] = useField(props);

    return (
        <ErrorBoundary>
            <div className="text-slate-400 text-sm  form-control">
                <label className="label">
                    <div className="label-text ">{label}</div>
                </label>

                <Listbox
                    as={"div"}
                    {...props}
                    {...field}
                    onChange={(dep) => {
                        helpers.setValue(dep);
                    }}
                >
                    {({ open }) => (
                        <div className="relative w-full z-50">
                            <Listbox.Button
                                className={`relative w-full cursor-default outline outline-offset-2 text-sm rounded-lg bg-base-100 text-base-content border border-base-content/20 px-4 flex h-12 justify-between ${
                                    open
                                        ? "outline-base-content/20"
                                        : meta.touched && meta.error
                                        ? "outline-error"
                                        : "outline-transparent "
                                }`}
                            >
                                <span className="block truncate my-auto mr-3">
                                    {field?.value?.name ?? (
                                        <span className="text-base-content">
                                            {placeholder}
                                        </span>
                                    )}
                                </span>
                                <span className="pointer-events-none flex items-center ">
                                    <SelectorIcon
                                        className="h-5 w-5 text-gray-400"
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
                                <Listbox.Options className="absolute mt-2 max-h-60 w-full overflow-auto list-none px-0 rounded-md bg-base-100 border border-base-content/20 py-1 text-base shadow-lg focus:outline-none sm:text-sm">
                                    {elements.map((element, elementIdx) => (
                                        <Listbox.Option
                                            key={elementIdx}
                                            className={({ active }) =>
                                                `cursor-default select-none py-2 px-4 flex justify-between ${
                                                    active
                                                        ? "bg-primary text-white"
                                                        : "text-base-content"
                                                }`
                                            }
                                            value={element}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <div
                                                        className={` flex-grow truncate ${
                                                            selected
                                                                ? "font-medium "
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {element.name}
                                                    </div>
                                                    {selected ? (
                                                        <div className="flex items-center pl-3 ml-auto ">
                                                            <CheckIcon
                                                                className="h-5 w-5"
                                                                aria-hidden="true"
                                                            />
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                        </Listbox.Option>
                                    ))}
                                </Listbox.Options>
                            </Transition>
                        </div>
                    )}
                </Listbox>
                {meta.touched && meta.error ? (
                    <div className="text-pink-600">{meta.error}</div>
                ) : null}
            </div>
        </ErrorBoundary>
    );
};

export default SelectInput;
