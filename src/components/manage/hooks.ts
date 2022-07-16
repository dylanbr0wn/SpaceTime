import { getElementOffset } from "../../utils/helpers";
import { useSpring, a, config, useTransition } from "@react-spring/web";
import * as React from "react";
import { useStore } from "../../utils/store";
import { useRouter } from "next/router";

export const useAnimate = () => {
	const {
		currentHover,
		setCurrentMenuHover,
		currentActive,
		setCurrentMenuActive,
	} = useStore((state) => ({
		currentActive: state.currentMenuActive,
		currentHover: state.currentMenuHover,
		setCurrentMenuHover: state.setCurrentMenuHover,
		setCurrentMenuActive: state.setCurrentMenuActive,
	}));
	const ref = React.useRef<HTMLButtonElement>(null);
	const [scaleSpring, scaleApi] = useSpring(() => ({
		scale: 1,
		config: config.stiff,
	}));
	const router = useRouter();

	const [ySpring, yApi] = useSpring(() => ({
		y: 0,
		config: config.wobbly,
	}));

	React.useEffect(() => {
		const currentPosition = getElementOffset(ref.current);

		const startPosition = getElementOffset(
			window.document.getElementById(currentActive ?? "dashboard")
		);

		yApi.set({
			y: startPosition.top - currentPosition.top,
		});
	}, []);

	const menuOnClick = (itemId: string) => {
		if (itemId === currentActive) return;
		setCurrentMenuActive(itemId);
		const currentPosition = getElementOffset(ref.current);

		const startPosition = getElementOffset(
			window.document.getElementById(itemId)
		);
		// const route = itemId === "dashboard" ? "/manage/" : `/manage/${itemId}`;
		yApi.start({
			y: startPosition.top - currentPosition.top,
			// onRest: () => router.push(route),
		});

		// router.push(route);
	};

	const transitions = useTransition(currentActive, {
		keys: (item) => item,
		from: { opacity: 0, rotate: -90 },
		enter: { opacity: 1, rotate: 0 },
		leave: { opacity: 0, rotate: 90 },
		initial: { opacity: 1, rotate: 0 },
	});
	return {
		currentActive,
		transitions,
		menuOnClick,
		scaleSpring,
		ySpring,
		ref,
		scaleApi,
		yApi,
	};
};
