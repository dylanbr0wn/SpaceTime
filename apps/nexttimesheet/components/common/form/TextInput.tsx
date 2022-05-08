import { useField } from "formik";

const MyTextField = ({
    label,
    ...props
}: {
    name: string;
    id: string;
    label: string;
    placeholder: string;
}) => {
    const [field, meta, helpers] = useField(props);

    return (
        <>
            <label htmlFor={props.name} className="text-slate-400 text-sm">
                <div className="mb-1">{label}</div>

                <input type="text" className="input" {...props} {...field} />
            </label>

            {/* {meta.touched && meta.error ? (
                <div className="text-pink-600">{meta.error}</div>
            ) : null} */}
        </>
    );
};
export default MyTextField;
