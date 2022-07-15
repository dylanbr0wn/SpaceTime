import { Listbox } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/outline";
import { FieldOption } from "../../../utils/types/zod";

const FieldInputOption = ({ option }: { option: FieldOption }) => {
	return (
		<Listbox.Option
			className={({ active }) =>
				`cursor-pointer rounded-lg select-none relative py-2 pl-10 pr-4 ${
					active ? "text-white bg-primary" : "text-primary"
				}`
			}
			value={option}
			key={option.id}
		>
			{({ selected }) => (
				<>
					<span
						className={`block truncate ${
							selected ? "font-medium" : "font-normal"
						}`}
					>
						{option.name}
					</span>
					{selected ? (
						<span
							className={`absolute inset-y-0 left-0 flex items-center pl-3`}
						>
							<CheckIcon className="w-5 h-5" aria-hidden="true" />
						</span>
					) : null}
				</>
			)}
		</Listbox.Option>
	);
};

export default FieldInputOption;
