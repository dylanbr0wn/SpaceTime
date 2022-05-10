import { useField } from "formik";

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
    const [field, meta, helpers] = useField(props);

    return (
        <>
            <label htmlFor={props.name} className="text-slate-400 text-sm">
                <div className="mb-1">{label}</div>

                <input type="text" className="input" {...props} {...field} />
            </label>

            {meta.touched && meta.error ? (
                <div className="text-pink-600">{meta.error}</div>
            ) : null}
        </>
    );
};
export default TextInput;
