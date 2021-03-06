import type { GetServerSidePropsContext, NextPage } from "next";
import { getSession } from "next-auth/react";
import * as React from "react";

import DashBoard from "../components/Dashboard";
import Timesheet from "../components/Timesheet";

const Home: NextPage = () => {
	return (
		<DashBoard>
			<div className="h-full w-full m-0 p-0">
				<Timesheet />
			</div>
		</DashBoard>
	);
};

export default Home;
