import { useField } from "formik";
import * as React from "react";
import { Control, Path, PathValue, useController } from "react-hook-form";
import { Keys } from "react-hook-form/dist/types/path/common";
import { User } from "../../../utils/types/zod";

import ErrorBoundary from "../ErrorBoundary";

const CheckBox = <T,>({
	label,
	control,
	name,
}: {
	name: Path<T>;
	control: Control<T>;
	label: string;
}) => {
	const {
		field: { onChange, onBlur, value, ref },
	} = useController({
		control,
		name,
		defaultValue: false as PathValue<T, Path<T>>,
	});

	return (
		<ErrorBoundary>
			<label htmlFor={name} className=" flex space-x-2 text-sm mb-1">
				<input
					type="checkbox"
					className="checkbox"
					onChange={onChange} // send value to hook form
					onBlur={onBlur} // notify when input is touched/blur
					checked={!!value} // input value
					name={name} // send down the input name
					ref={ref} // send input ref, so we can focus on input when error appear
				/>
				<div className=" text-slate-400">{label}</div>
			</label>

			{/* {meta.touched && meta.error ? (
                <div className="text-pink-600">{meta.error}</div>
            ) : null} */}
		</ErrorBoundary>
	);
};
export default CheckBox;
