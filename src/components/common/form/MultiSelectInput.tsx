import { useField } from "formik";
import * as React from "react";
import Select, { components, ControlProps, OptionProps } from "react-select";

import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";

import { ManagersQuery } from "../../../../lib/apollo";
import ErrorBoundary from "../ErrorBoundary";

const Option = ({ children, ...props }: OptionProps) => (
    <components.Option {...props}>{props?.data?.name ?? ""}</components.Option>
);

const Control = ({ children, ...props }: ControlProps) => {
    return (
        <components.Control {...props} className="bg-base-100">
            {" "}
            {/* <select {...props} className="select select-bordered w-56"> */}
            {children}
            {/* </select> */}
        </components.Control>
    );
};

const MultiSelectInput = ({
    elements,
    label,
    placeholder,
    ...props
}: {
    elements: any[];
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

                <Select
                    closeMenuOnSelect={false}
                    components={{ Option, Control }}
                    isMulti
                    options={elements}
                />

                {meta.touched && meta.error ? (
                    <div className="text-pink-600">{meta.error}</div>
                ) : null}
            </div>
        </ErrorBoundary>
    );
};

export default MultiSelectInput;
