import * as React from "react";

import { Tab } from "@headlessui/react";
import { PlusCircleIcon, UserGroupIcon } from "@heroicons/react/outline";

import { CreateUserMutation } from "../../lib/apollo";

import Create from "./Create";
import Join from "./Join";

// export enum RegisterTab {
//     Join,
//     Create,
// }

const Register = ({
    user,
}: {
    user: CreateUserMutation["createUser"] | undefined;
}) => {
    // const [tab, setTab] = React.useState<RegisterTab>(RegisterTab.Join);
    // const [showRegister, setShowRegister] = React.useState(true);
    // const showRegisterDebounced = useDebounce(showRegister, 500);
    // const router = useRouter();

    // const [touched, setTouched] = React.useState(false);

    return (
        <div className="w-full h-full bg-base-100 flex flex-col ">
            {/* {showRegisterDebounced && ( */}
            <>
                {/* <SplashWaves /> */}
                <div className="card m-auto bg-base-300 min-w-96 min-h-1/2 overflow-visible">
                    <div className="flex flex-col card-body ">
                        <div className="card-title mb-3">
                            Welcome {user?.name}! 🎉
                        </div>
                        {/* <div
                            className={`my-3 ${
                                touched && "opacity-0 scale-y-0"
                            } transform transition-all `}
                        >
                            What would you like to do?
                        </div> */}
                        <Tab.Group>
                            <Tab.List className="tabs mx-auto">
                                <Tab as={React.Fragment}>
                                    {({ selected }) => (
                                        <button
                                            // onClick={() => setTouched(true)}
                                            className={`tab tab-bordered flex ${
                                                selected && "tab-active"
                                            }`}
                                        >
                                            <UserGroupIcon
                                                className={`mr-2 w-5 h-5 `}
                                            />
                                            <div>Join a team</div>
                                        </button>
                                    )}
                                </Tab>
                                <Tab as={React.Fragment}>
                                    {({ selected }) => (
                                        <button
                                            // onClick={() => setTouched(true)}
                                            className={`tab tab-bordered flex ${
                                                selected && "tab-active"
                                            }`}
                                        >
                                            <PlusCircleIcon
                                                className={`mr-2 w-5 h-5 `}
                                            />
                                            <div>Create a team</div>
                                        </button>
                                    )}
                                </Tab>
                            </Tab.List>
                            <Tab.Panels>
                                <Tab.Panel>
                                    <Join />
                                </Tab.Panel>
                                <Tab.Panel>
                                    <Create user={user} />
                                </Tab.Panel>
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </div>
            </>
            {/* )} */}
        </div>
    );
};
export default Register;
