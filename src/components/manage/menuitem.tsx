import { getMenuIcon } from "./menu";

interface IMenuItemProps {
	menuOnClick: (name: string) => void;
	currentActive: string | null;
	name: string;
	displayName: string;
}

const MenuItem = ({
	menuOnClick,
	currentActive,
	name,
	displayName,
}: IMenuItemProps) => {
	return (
		<div id={name} className="flex group">
			<button
				onClick={() => menuOnClick(name)}
				className={`p-2 btn hover:btn-primary ${
					currentActive === name ? "opacity-0" : "opacity-100"
				}`}
			>
				<div>{getMenuIcon(currentActive, name)}</div>
			</button>
			<div
				className={` my-auto ml-2 text-md transition-opacity whitespace-nowrap pointer-events-none duration-500 ${
					currentActive === name
						? "opacity-100 text-base-content"
						: "group-hover:opacity-50 opacity-0 text-primary"
				}`}
			>
				{displayName}
			</div>
		</div>
	);
};

export default MenuItem;
