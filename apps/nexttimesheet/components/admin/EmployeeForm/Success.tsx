import * as React from "react";

import { ClipboardCopyIcon } from "@heroicons/react/outline";

const Success = ({ token }: { token: string }) => {
    const [copied, setCopied] = React.useState(false);
    return (
        <div className="">
            <div className="text-teal-500 text-center mb-4 text-lg font-bold">
                User created successfully!
            </div>
            A one time token has been generated for them below. They can use
            this token to set up their account.
            <div className="mt-2 text-sm">
                <strong className="text-sky-500"> Note: </strong>
                You are able to access this token at any time in the Tokens
                section of the admin panel.
            </div>
            <div className=" text-center mt-5 flex justify-center">
                <div
                    className={`font-bold ${
                        copied ? "text-teal-500" : "text-slate-300"
                    }`}
                >
                    {token ?? ""}
                </div>
                <button
                    type="button"
                    onClick={() => {
                        navigator.clipboard.writeText(token ?? "");
                        setCopied(true);
                    }}
                    className="flex flex-col mx-2 w-20 h-14 text-slate-500 group "
                >
                    <ClipboardCopyIcon
                        className={`h-6 w-6 mx-auto cursor-pointer ${
                            copied
                                ? "text-teal-500"
                                : "group-hover:text-slate-400"
                        }`}
                    />
                    {copied ? (
                        <div className="text-teal-500 text-sm font-light">
                            Copied!
                        </div>
                    ) : (
                        <div className="text-slate-500 text-sm font-light group-hover:text-slate-400">
                            Copy code
                        </div>
                    )}
                </button>
            </div>
        </div>
    );
};
export default Success;
