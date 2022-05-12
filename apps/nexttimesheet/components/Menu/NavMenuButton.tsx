import * as React from "react";

import { Popover } from "@headlessui/react";
import { ViewGridIcon as ViewGridIconOutline } from "@heroicons/react/outline";
import { ViewGridIcon as ViewGridIconSolid } from "@heroicons/react/solid";
import { animated, config, useTransition } from "@react-spring/web";

const NavMenuButton = ({ open }: { open: boolean }) => {
    const transition = useTransition(open, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: config.wobbly,
    });

    return (
        <Popover.Button className="btn-ghost btn btn-square mt-2 relative group">
            {transition(({ opacity }, item) =>
                item ? (
                    <animated.div
                        className="absolute inset-0 "
                        style={{ opacity }}
                    >
                        <ViewGridIconSolid className="w-9 h-9 mt-1 mx-auto stroke-1" />
                    </animated.div>
                ) : (
                    <animated.div
                        className="absolute inset-0"
                        style={{ opacity }}
                    >
                        <ViewGridIconOutline className="w-9 h-9 mt-1 mx-auto stroke-1" />
                    </animated.div>
                )
            )}
        </Popover.Button>
    );
};
export default NavMenuButton;
