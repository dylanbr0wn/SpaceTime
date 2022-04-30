import * as React from "react";

import { Menu, Popover } from "@headlessui/react";
import { animated, config, useTransition } from "@react-spring/web";
import { ViewGridIcon as ViewGridIconSolid } from "@heroicons/react/solid";
import { ViewGridIcon as ViewGridIconOutline } from "@heroicons/react/outline";

const NavMenuButton = ({ open }: { open: boolean }) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.gentle,
    });

    return (
        <Popover.Button
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="text-slate-200 h-full w-16 relative group"
        >
            {transition(({ opacity }, item) =>
                item ? (
                    <animated.div
                        className="absolute top-0 left-0 h-full"
                        style={{ opacity }}
                    >
                        <ViewGridIconSolid className="w-10 h-10 my-3 ml-4" />
                    </animated.div>
                ) : (
                    <animated.div
                        className="absolute top-0 left-0"
                        style={{ opacity }}
                    >
                        <ViewGridIconOutline className="w-10 h-10 my-3 ml-4" />
                    </animated.div>
                )
            )}
        </Popover.Button>
    );
};
export default NavMenuButton;
