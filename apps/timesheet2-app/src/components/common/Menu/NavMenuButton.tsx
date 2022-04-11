import * as React from "react";

import { Menu, Popover } from "@headlessui/react";
import { animated, useTransition } from "@react-spring/web";

const NavMenuButton = ({ open }: { open: boolean }) => {
    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
    });

    return (
        <Popover.Button className="p-0.5 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-md group cursor-pointer transform active:translate-y-0.5 ">
            <div
                className={`rounded-md p-1 flex bg-slate-900 transition-colors`}
            >
                <div>
                    <div className="w-6 h-6 m-1 bg-transparent">
                        {transition(({ opacity }, item) =>
                            item ? (
                                <animated.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 absolute w-6 
                                text-sky-300 
                               transition-colors`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    style={{ opacity }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </animated.svg>
                            ) : (
                                <animated.svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className={`h-6 absolute w-6 
                              text-sky-300 
                             transition-colors`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth={2}
                                    style={{ opacity }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                </animated.svg>
                            )
                        )}
                    </div>

                    {/* <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 m-1 fill-current 
                          text-sky-300 
                         transition-colors`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg> */}
                </div>
                <div
                    className={`text-lg my-auto px-3 
                     text-sky-300
                   `}
                >
                    Menu
                </div>
            </div>
        </Popover.Button>
    );
};
export default NavMenuButton;
