import ErrorBoundary from "../ErrorBoundary";
import { Control, Path, useController } from "react-hook-form";

const SelectInput = <T, Y>({
	elements,
	label,
	placeholder,
	control,
	name,
}: {
	elements: Y & { id: string; name: string }[];
	control: Control<T>;
	label: string;
	name: Path<T>;
	placeholder: string;
}) => {
	const {
		field: { onChange, onBlur, value, ref },
		fieldState: { isTouched, isDirty, error },
		formState: { touchedFields, dirtyFields },
	} = useController({ control, name });

	return (
		<ErrorBoundary>
			<div className="text-slate-400 text-sm  form-control">
				<label className="label">
					<div className="label-text ">{label}</div>
				</label>
				<div className="relative w-full z-50">
					<select
						placeholder={placeholder}
						className="select select-bordered w-full"
						onChange={onChange} // send value to hook form
						onBlur={onBlur} // notify when input is touched/blur
						value={String(value)} // input value
						name={name} // send down the input name
						ref={ref} // send input ref, so we can focus on input when error appear>
					>
						{elements?.map((elem) => (
							<option value={elem.id} key={elem.id}>
								{elem.name}
							</option>
						)) ?? null}
					</select>
				</div>

				{isTouched && error ? (
					<div className="text-pink-600">{error.message}</div>
				) : null}
			</div>
		</ErrorBoundary>
	);
};

export default SelectInput;
