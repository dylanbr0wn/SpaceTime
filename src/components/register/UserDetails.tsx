import { useSession } from "next-auth/react";
import * as React from "react";

const UserDetails = () => {
	const session = useSession();

	return (
		<div className="w-full h-full bg-base-100 flex flex-col ">
			{/* {showRegisterDebounced && ( */}
			<>
				{/* <SplashWaves /> */}
				<div className="card m-auto bg-base-300 min-w-96 min-h-1/2">
					<div className="flex flex-col card-body ">
						<div className="card-title">
							Welcome {session?.data?.user?.name}! 🎉
						</div>
					</div>
				</div>
			</>
			{/* )} */}
		</div>
	);
};

export default UserDetails;
