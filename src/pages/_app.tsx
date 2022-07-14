import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import * as React from "react";
import { Toaster } from "react-hot-toast";

import "../styles/globals.css";
import { withTRPC } from "@trpc/next";
import { AppRouter } from "../server/router";
import superjson from "superjson";
import { httpBatchLink } from "@trpc/client/links/httpBatchLink";
// import { httpLink } from "@trpc/client/links/httpLink";
// import { splitLink } from "@trpc/client/links/splitLink";
const getBaseUrl = () => {
	if (typeof window !== "undefined") {
		return "";
	}
	if (process.browser) return ""; // Browser should use current path
	if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url

	return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
	return (
		<SessionProvider session={session}>
			<Component {...pageProps} />
			<Toaster />
		</SessionProvider>
	);
}

export default withTRPC<AppRouter>({
	config({ ctx }) {
		/**
		 * If you want to use SSR, you need to use the server's full URL
		 * @link https://trpc.io/docs/ssr
		 */
		const url = `${getBaseUrl()}/api/trpc`;

		return {
			url,
			transformer: superjson,
			/**
			 * @link https://react-query.tanstack.com/reference/QueryClient
			 */
			queryClientConfig: {
				defaultOptions: {
					queries: {
						notifyOnChangeProps: "tracked",
					},
				},
			},
			// links: [
			// 	// 	// splitLink({
			// 	// 	// 	condition(op) {
			// 	// 	// 		// check for context property `skipBatch`
			// 	// 	// 		return op.context.skipBatch === true;
			// 	// 	// 	},
			// 	// 	// 	// when condition is true, use normal request
			// 	// 	// 	true: httpLink({
			// 	// 	// 		url,
			// 	// 	// 	}),
			// 	// 	// 	// when condition is false, use batching
			// 	// 	// 	false: httpBatchLink({
			// 	// 	// 		url,
			// 	// 	// 		maxBatchSize: 10, // a reasonable size
			// 	// 	// 	}),
			// 	// 	// }),
			// 	httpBatchLink({
			// 		url,
			// 		maxBatchSize: 5, // a reasonable size
			// 	}),
			// ],
		};
	},
	/**
	 * @link https://trpc.io/docs/ssr
	 */
	ssr: false,
})(MyApp);
