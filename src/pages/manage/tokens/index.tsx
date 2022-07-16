import DashBoard from "../../../components/Dashboard";
import { NextPage } from "next";
import ManageMenu from "../../../components/manage/menu";

const ManageTimesheet: NextPage = () => {
	return (
		<>
			<DashBoard>
				<ManageMenu />
				<div
					className="h-full w-full flex"
					style={{ margin: 0, padding: 0 }}
				></div>
			</DashBoard>
		</>
	);
};

export default ManageTimesheet;
