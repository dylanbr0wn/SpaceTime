import * as React from "react";

type NavSubTitleProp = {
	title: string;
};

const NavSubTitle = ({ title }: NavSubTitleProp) => {
	return (
		<>
			<div className="group flex my-1  ">
				<div className="flex-grow bg-slate-700 transition-colors duration-300 my-auto mx-1 h-[2px] rounded-md " />
				<div className="font-medium bg-transparent text-xs transition-colors duration-300 text-slate-700 mx-1 my-1">
					{title}
				</div>
				<div className="flex-grow bg-slate-700 transition-colors duration-300 my-auto mx-1 h-[2px] rounded-md " />
			</div>
		</>
	);
};

export default NavSubTitle;
