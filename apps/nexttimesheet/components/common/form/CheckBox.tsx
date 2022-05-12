import { useField } from "formik";
import * as React from "react";

import ErrorBoundary from "../ErrorBoundary";

const CheckBox = ({
    label,
    ...props
}: {
    name: string;
    id: string;
    type: string;
    label: string;
}) => {
    const [field, meta, helpers] = useField(props);

    return (
        <ErrorBoundary>
            <label
                htmlFor={props.name}
                className=" flex space-x-2 text-sm mb-1"
            >
                <input className="checkbox" {...props} {...field} />
                <div className=" text-slate-400">{label}</div>
            </label>

            {/* {meta.touched && meta.error ? (
                <div className="text-pink-600">{meta.error}</div>
            ) : null} */}
        </ErrorBoundary>
    );
};
export default CheckBox;
