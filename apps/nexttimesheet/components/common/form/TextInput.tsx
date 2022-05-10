import { useField } from "formik";

import ErrorBoundary from "../ErrorBoundary";

const TextInput = ({
    label,
    ...props
}: {
    name: string;
    id: string;
    label: string;
    placeholder: string;
    validate: (value: string) => string | void | Promise<string | void>;
}) => {
    const [field, meta] = useField(props);

    return (
        <ErrorBoundary>
            <label htmlFor={props.name} className="text-slate-400 text-sm">
                <div className="mb-1">{label}</div>

                <input
                    type="text"
                    className={`input ${
                        meta.touched && meta.error ? "border-pink-500" : ""
                    }`}
                    id={props.id}
                    placeholder={props.placeholder}
                    {...field}
                />
            </label>

            {meta.touched && meta.error ? (
                <div className="text-pink-600">{meta.error}</div>
            ) : null}
        </ErrorBoundary>
    );
};
export default TextInput;
