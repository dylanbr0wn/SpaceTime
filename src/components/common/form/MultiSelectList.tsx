import { useField } from "formik";
import { Control, Path, PathValue, useController } from "react-hook-form";

interface BaseElement {
	id: string;
	name: string;
	description?: string | null;
}

const MultiSelectList = <T extends BaseElement, Y>({
	elements,
	label,
	placeholder,
	name,
	control,
}: {
	elements: T[];
	control: Control<Y>;
	label: string;
	name: Path<Y>;
	placeholder: string;
}) => {
	const { field } = useController({
		control,
		name,
		defaultValue: [] as PathValue<Y, Path<Y>>,
	});
	return (
		<div className="flex flex-col w-full space-y-2 py-2 overflow-y-scroll">
			{elements.map((el) => {
				return (
					<div
						key={el.id}
						className="form-control p-2 rounded hover:bg-base-200"
					>
						<label className="label cursor-pointer text-left justify-start">
							<input
								// onChange={() => {
								// 	if (field.value.some((activeField) => activeField === el.id))
								// 		helpers.setValue(
								// 			field.value.filter((val) => val !== el.id),
								// 			false
								// 		);
								// 	else helpers.setValue([...field.value, el.id], false);
								// }}

								type="checkbox"
								checked={(field.value as string[]).some(
									(activeField) => activeField === el.id
								)}
								className="checkbox checkbox-primary"
							/>
							<span className="label-text ml-5">
								<div>{el.name}</div>
								<div className="text-xs text-base-content/60">
									{el.description}
								</div>
							</span>
						</label>
					</div>
				);
			})}
		</div>
	);
};

export default MultiSelectList;
