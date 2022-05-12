import { ReactNode } from "react";

import { animated, config, Transition } from "@react-spring/web";

const CustTransition = ({
    children,
    open,
}: {
    children: ReactNode;
    open: boolean;
}) => {
    return (
        <Transition
            items={open}
            from={{ opacity: 0, scale: 0.95 }}
            enter={{ opacity: 1, scale: 1 }}
            leave={{ opacity: 0, scale: 0.95 }}
            reverse={open}
            config={config.stiff}
        >
            {(styles, item) =>
                item && <animated.div style={styles}>{children}</animated.div>
            }
        </Transition>
    );
};

export default CustTransition;
