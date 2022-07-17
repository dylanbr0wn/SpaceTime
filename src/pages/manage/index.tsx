import { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import * as React from "react";

import {
	ChartSquareBarIcon,
	KeyIcon,
	UsersIcon,
} from "@heroicons/react/outline";

import EmployeeForm from "../../components/admin/EmployeeForm";
import TokenList from "../../components/admin/TokenList";
import UsersList from "../../components/admin/UsersList";
import DashBoard from "../../components/Dashboard";
import Settings from "../../components/settings/Settings";
import { trpc } from "../../utils/trpc";
import ManageMenu from "../../components/manage/menu";
import { useStore } from "../../utils/store";
import { useTransition, a } from "@react-spring/web";
import { useManageData } from "../../components/manage/hooks";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
	const session = await getSession(ctx);
	if (!session) {
		return {
			redirect: {
				destination: "/api/auth/signin",
				permanent: false,
			},
		};
	}
	// const user = session?.user;
	// const client = initializeApollo({ headers: ctx?.req?.headers });

	// const { data: userData } = await client.query<
	//     UserFromAuthIdQuery,
	//     UserFromAuthIdQueryVariables
	// >({
	//     query: UserFromAuthIdDocument,
	//     variables: {
	//         authId: String(user?.sub),
	//     },
	// });
	// if (!userData?.userFromAuthId) {
	//     return {
	//         redirect: {
	//             destination: "/auth/register",
	//             permanent: false,
	//         },
	//     };
	// }

	return {
		props: {
			session,
		},
	};
};

const Manage: NextPage = () => {
	const { currentActive } = useStore((state) => ({
		currentActive: state.currentMenuActive,
	}));

	const [visible, setVisible] = React.useState<string[]>([currentActive]);

	const transitions = useTransition(currentActive, {
		keys: (item) => item,
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		initial: { opacity: 1 },
		exitBeforeEnter: true,
		onChange: () => {
			setVisible((old) => [currentActive, ...old]);
		},
		onRest: () => {
			setVisible((old) => old.filter((item) => item === currentActive));
		},
	});

	const {
		user,
		tokens,
		tokensError,
		tokensLoading,
		users,
		usersError,
		usersLoading,
		tenant,
		tenantLoading,
		fields,
	} = useManageData();

	return (
		<DashBoard>
			<ManageMenu />
			<div className="h-full max-w-5xl mx-auto flex " style={{ padding: 0 }}>
				<div className="flex flex-col w-full h-full relative">
					{transitions((style, item) => (
						<>
							{item === "dashboard" && (
								<a.div
									className={`${
										visible.includes("dashboard") ? "block" : "hidden"
									} absolute w-full`}
									style={style}
								>
									<div className="flex max-w-screen-2xl mx-auto space-x-12 py-2">
										<div className="w-72 card bg-base-200 flex flex-col p-3 ">
											<EmployeeForm currentUser={user} />
										</div>
										<div className="card w-72  bg-base-200 p-3">
											<div className="flex  content-middle">
												<ChartSquareBarIcon className="w-7 h-7 mx-2 my-1 text-secondary" />
												<div className="text-secondary text-xl w-full my-auto">
													Stats
												</div>
											</div>
											<div className="text-base-content px-3 mt-2">
												<span className="text-xl font-bold text-secondary mr-2">
													10
												</span>
												reporting to you
											</div>
											<div className="text-base-content px-3 mt-2">
												<span className="text-xl font-bold text-accent mr-2">
													6
												</span>
												have submitted a timesheet
											</div>
										</div>
									</div>
								</a.div>
							)}
							{item === "timesheet" && (
								<a.div
									className={`${
										visible.includes("timesheet") ? "block" : "hidden"
									} absolute w-full`}
									style={style}
								>
									<Settings
										tenant={tenant}
										tenantLoading={tenantLoading}
										fields={fields}
									/>
								</a.div>
							)}
							{item === "users" && (
								<a.div
									className={`${
										visible.includes("users") ? "block" : "hidden"
									} absolute w-full h-full`}
									style={style}
								>
									<div className="w-full h-full px-3">
										<UsersList
											users={users}
											usersError={usersError}
											usersLoading={usersLoading}
										/>
									</div>
								</a.div>
							)}
							{item === "tokens" && (
								<a.div
									className={`${
										visible.includes("tokens") ? "block" : "hidden"
									} block absolute w-full h-full`}
									style={style}
								>
									<div className="w-full h-full px-3">
										<TokenList
											tokens={tokens}
											tokensError={tokensError}
											tokensLoading={tokensLoading}
										/>
									</div>
								</a.div>
							)}
						</>
					))}
				</div>
			</div>
		</DashBoard>
	);
};

export default Manage;
