import { getElementOffset } from "../../utils/helpers";
import { useSpring, a, config, useTransition } from "@react-spring/web";
import * as React from "react";
import { useStore } from "../../utils/store";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";

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

export const useManageData = () => {
	const session = useSession();

	const { data: userData } = trpc.useQuery(
		[
			"user.readFromAuth",
			{
				authId: String(session?.data?.user?.sub),
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!session?.data?.user?.sub,
		}
	);

	const {
		data: usersData,
		isFetching: usersLoading,
		error: usersError,
	} = trpc.useQuery(
		[
			"user.readAll",
			{
				tenantId: userData?.tenant?.id ?? "-1",
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!userData?.tenant?.id,
		}
	);

	const { data, error, isFetching } = trpc.useQuery(
		[
			"oneTimeToken.readAll",
			{
				tenantId: userData?.tenant?.id ?? "-1",
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!userData?.tenant?.id,
		}
	);

	const { data: tenantData, isFetching: tenantLoading } = trpc.useQuery(
		[
			"tenant.read",
			{
				id: String(userData?.tenant?.id),
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!userData?.tenant?.id,
		}
	);

	const { data: fieldsData } = trpc.useQuery(
		[
			"field.readAll",
			{
				tenantId: String(userData?.tenant?.id),
			},
		],
		{
			refetchOnWindowFocus: false,
			enabled: !!userData?.tenant?.id,
		}
	);

	return {
		user: userData,
		session,
		users: usersData,
		usersLoading,
		usersError,
		tokens: data,
		tokensError: error,
		tokensLoading: isFetching,
		tenant: tenantData,
		tenantLoading,
		fields: fieldsData,
	};
};
