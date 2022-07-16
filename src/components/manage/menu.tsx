import {
	ClockIcon,
	KeyIcon,
	UsersIcon,
	ViewGridIcon,
} from "@heroicons/react/solid";
import { a } from "@react-spring/web";

import { useAnimate } from "./hooks";
import MenuItem from "./menuitem";

export const getMenuIcon = (currentActive: string | null, val?: string) => {
	const icon = val ?? currentActive;

	switch (icon) {
		case "dashboard":
			return <ViewGridIcon className="h-8 w-8" />;
		case "users":
			return <UsersIcon className="h-8 w-8" />;
		case "tokens":
			return <KeyIcon className="h-8 w-8" />;
		case "timesheet":
			return <ClockIcon className="h-8 w-8" />;
		default:
			return <ViewGridIcon className="h-8 w-8" />;
	}
};

const ManageMenu = () => {
	const {
		ref,
		ySpring,
		scaleSpring,
		scaleApi,
		transitions,
		menuOnClick,
		currentActive,
	} = useAnimate();

	return (
		<div className="fixed left-3 my-auto top-1/2 transform -translate-y-1/2 z-30">
			<div className="flex flex-col w-min space-y-2 h-full justify-center relative">
				<a.button
					ref={ref}
					style={{ ...ySpring, ...scaleSpring }}
					onMouseDown={() => {
						scaleApi.start({
							from: { scale: 1 },
							to: {
								scale: 0.95,
							},
						});
					}}
					onMouseUp={() =>
						scaleApi.start({
							from: { scale: 0.95 },
							to: {
								scale: 1,
							},
						})
					}
					className={`p-2 absolute z-10 inline-flex flex-shrink-0 cursor-pointer items-center flex-wrap transition-colors justify-center
              text-center h-12 text-sm rounded-lg bg-primary border-2 border-primary hover:bg-primary-focus hover:border-primary-focus`}
				>
					<div className="relative w-8 h-8">
						{transitions((style) => (
							<a.div className="absolute" style={style}>
								{getMenuIcon(currentActive)}
							</a.div>
						))}
					</div>
				</a.button>
				<MenuItem
					menuOnClick={menuOnClick}
					currentActive={currentActive}
					name="dashboard"
					displayName="Dashboard"
				/>

				<MenuItem
					menuOnClick={menuOnClick}
					currentActive={currentActive}
					name="users"
					displayName="User Settings"
				/>

				<MenuItem
					menuOnClick={menuOnClick}
					currentActive={currentActive}
					name="timesheet"
					displayName="Timesheet Settings"
				/>

				<MenuItem
					menuOnClick={menuOnClick}
					currentActive={currentActive}
					name="tokens"
					displayName="Token Settings"
				/>
			</div>
		</div>
	);
};
export default ManageMenu;
