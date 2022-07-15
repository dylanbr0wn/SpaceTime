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
			<div className="form-control">
				<label htmlFor={props.name} className="label">
					<div className="label-text">{label}</div>
				</label>
				<input
					type="text"
					className={`input input-bordered input-md ${
						meta.touched && meta.error ? "input-error" : ""
					}`}
					id={props.id}
					placeholder={props.placeholder}
					{...field}
				/>
				<label htmlFor={props.name} className="label">
					{meta.touched && meta.error ? (
						<div className="label-text text-error">{meta.error}</div>
					) : null}
				</label>
			</div>
		</ErrorBoundary>
	);
};
export default TextInput;
