import { GetServerSidePropsContext, NextPage } from "next";
import { getSession, useSession } from "next-auth/react";
import * as React from "react";

import { Tab } from "@headlessui/react";
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
	const session = useSession();

	const { data: userData } = trpc.useQuery(
		[
			"user.readFromAuth",
			{
				authId: String(session?.data?.user?.sub),
			},
		],
		{
			enabled: !!session?.data?.user?.sub,
		}
	);

	return (
		<DashBoard>
			<div className="h-full w-full flex" style={{ margin: 0, padding: 0 }}>
				<div className="flex flex-col p-3 w-full h-full">
					<Tab.Group>
						<div className="flex justify-center">
							<Tab.List className="tabs tabs-boxed flex-shrink">
								<Tab
									className={({ selected }) =>
										`appearance-none tab tab-lg ${selected && "tab-active"}`
									}
								>
									<div className="flex  content-middle ">
										<UsersIcon className="w-5 h-5 m-auto" />
										<div className=" w-full my-auto">Dashboard</div>
									</div>
								</Tab>
								<Tab
									className={({ selected }) =>
										`appearance-none tab tab-lg ${selected && "tab-active "}`
									}
								>
									<div className="flex  content-middle">
										<KeyIcon className="w-5 h-5 m-auto" />
										<div className=" w-full my-auto">Timesheet</div>
									</div>
								</Tab>
								<Tab
									className={({ selected }) =>
										`appearance-none tab tab-lg ${selected && "tab-active"}`
									}
								>
									<div className="flex  content-middle ">
										<UsersIcon className="w-5 h-5 m-auto" />
										<div className=" w-full my-auto">Users</div>
									</div>
								</Tab>
								<Tab
									className={({ selected }) =>
										`appearance-none tab tab-lg ${selected && "tab-active "}`
									}
								>
									<div className="flex  content-middle">
										<KeyIcon className="w-5 h-5 m-auto" />
										<div className=" w-full my-auto">Tokens</div>
									</div>
								</Tab>
							</Tab.List>
						</div>
						<Tab.Panels>
							<Tab.Panel>
								<div className="flex max-w-screen-2xl mx-auto space-x-12 py-2">
									<div className="w-72 card bg-base-200 flex flex-col p-3 ">
										<EmployeeForm currentUser={userData} />
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
							</Tab.Panel>
							<Tab.Panel>
								<Settings />
							</Tab.Panel>
							<Tab.Panel>
								<div className="w-full px-3">
									<UsersList user={userData} />
								</div>
							</Tab.Panel>
						</Tab.Panels>
						<Tab.Panel>
							<div className=" px-3 w-full">
								<TokenList currentUser={userData} />
							</div>
						</Tab.Panel>
					</Tab.Group>
				</div>
			</div>
		</DashBoard>
	);
};

export default Manage;
