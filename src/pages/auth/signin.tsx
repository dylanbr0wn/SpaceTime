import { signIn } from "next-auth/react";
import { FaDiscord, FaGithub, FaTwitter } from "react-icons/fa";

const SignIn = () => {
    return (
        <div className="w-full h-full bg-base-100 flex flex-col ">
            <div className="card m-auto bg-base-300 w-96">
                <div className="flex flex-col card-body ">
                    <div className="card-title">Sign In</div>
                    <div className="flex flex-col space-y-2 mt-3">
                        <button
                            onClick={() =>
                                signIn("github", { callbackUrl: "/" })
                            }
                            className="btn mx-auto bg-neutral rounded-lg flex flex-nowrap px-4 w-3/4 text-white"
                        >
                            <FaGithub className="h-6 w-6 m-auto" />
                            <div className="w-full px-2 my-auto">
                                Sign in with GitHub
                            </div>
                        </button>
                        <button
                            onClick={() =>
                                signIn("discord", { callbackUrl: "/" })
                            }
                            className="btn mx-auto bg-[#5865F2] w-3/4 text-white rounded-lg flex flex-nowrap px-4 hover:bg-indigo-700"
                        >
                            <FaDiscord className="h-6 w-6 m-auto" />
                            <div className="w-full px-2 my-auto">
                                Sign in with Discord
                            </div>
                        </button>
                        <button
                            onClick={() =>
                                signIn("twitter", { callbackUrl: "/" })
                            }
                            className="btn mx-auto bg-[#1da1f2] w-3/4 text-white rounded-lg flex flex-nowrap px-4 hover:bg-sky-600"
                        >
                            <FaTwitter className="h-6 w-6 m-auto" />
                            <div className="w-full px-2 my-auto">
                                Sign in with Twitter
                            </div>
                        </button>
                        {/* <div className="h-14 w-3/4 mx-auto  rounded-lg "></div>
                        <div className="h-14 w-3/4 mx-auto bg-base-100 rounded-lg"></div> */}
                        {/* <div className="h-14 w-3/4 mx-auto bg-base-100 rounded-lg"></div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
