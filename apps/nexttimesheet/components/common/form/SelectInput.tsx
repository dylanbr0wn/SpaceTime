import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { useField } from "formik";
import { Department } from "nexus-prisma/index";
import * as React from "react";

const SelectInput = ({
    elements,
    label,
    ...props
}: {
    elements: Partial<Department>[];
    label: string;
    name: string;
}) => {
    const [field, meta, helpers] = useField(props);

    return (
        <div className="text-slate-400 text-sm w-full w-42">
            <div className="mb-1 ">{label}</div>
            <Listbox
                {...props}
                {...field}
                onChange={(dep) => {
                    helpers.setValue(dep);
                }}
            >
                {({ open }) => (
                    <div className="relative mt-1 w-full">
                        <Listbox.Button
                            className={`relative w-full cursor-default text-base rounded bg-slate-700 text-sky-300 border flex p-2 h-10 justify-between ${
                                open
                                    ? "border-sky-500 outline-blue-500 outline outline-1"
                                    : "border-slate-600"
                            }`}
                        >
                            <span className="block truncate">
                                {field?.value?.name ?? (
                                    <span className="text-slate-500">
                                        Sith Lord
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
                            <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto list-none px-0 rounded-md bg-slate-700 border-slate-700 border py-1 text-base shadow-lg ring-1 ring-sky-500 ring-opacity-5 focus:outline-none sm:text-sm">
                                {elements.map((element, elementIdx) => (
                                    <Listbox.Option
                                        key={elementIdx}
                                        className={({ active }) =>
                                            `cursor-default select-none py-2 px-2 flex justify-between ${
                                                active
                                                    ? "bg-slate-600 text-sky-300"
                                                    : "text-sky-500"
                                            }`
                                        }
                                        value={element}
                                    >
                                        {({ selected }) => (
                                            <>
                                                <span
                                                    className={`block flex-grow truncate ${
                                                        selected
                                                            ? "font-medium"
                                                            : "font-normal"
                                                    }`}
                                                >
                                                    {element.name}
                                                </span>
                                                {selected ? (
                                                    <span className="flex items-center pl-3 ml-auto ">
                                                        <CheckIcon
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
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
        </div>
    );
};

export default SelectInput;
