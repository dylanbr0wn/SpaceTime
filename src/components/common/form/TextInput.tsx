import { useField } from "formik";
import {
	Control,
	Path,
	PathValue,
	useController,
	UseFormRegister,
	UseFormStateProps,
} from "react-hook-form";
import { Keys } from "react-hook-form/dist/types/path/common";
import { User } from "../../../utils/types/zod";

import ErrorBoundary from "../ErrorBoundary";

interface ITextInputProps<T> {
	name: Path<T>;
	label: string;
	placeholder: string;
	control: Control<T>;
}

const TextInput = <T,>({
	label,
	control,
	name,
	placeholder,
}: ITextInputProps<T>) => {
	const {
		field: { onChange, onBlur, value, ref },
		fieldState: { isTouched, error },
		formState: { touchedFields, dirtyFields },
	} = useController({
		control,
		name,
		defaultValue: "" as PathValue<T, Path<T>>,
	});

	return (
		<ErrorBoundary>
			<div className="form-control">
				<label htmlFor={name} className="label">
					<div className="label-text">{label}</div>
				</label>
				<input
					type="text"
					className={`input input-bordered input-md ${
						isTouched && error ? "input-error" : ""
					}`}
					id={name}
					placeholder={placeholder}
					onChange={onChange} // send value to hook form
					onBlur={onBlur} // notify when input is touched/blur
					value={String(value ?? "")} // this feels dirty...
					name={name} // send down the input name
					ref={ref} // send input ref, so we can focus on input when error appear
				/>
				<label htmlFor={name} className="label">
					{isTouched && error ? (
						<div className="label-text text-error">{error.message}</div>
					) : null}
				</label>
			</div>
		</ErrorBoundary>
	);
};
export default TextInput;
