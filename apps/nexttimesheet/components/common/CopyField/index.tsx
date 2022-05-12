import * as React from "react";
import toast from "react-hot-toast";

import { ClipboardCopyIcon } from "@heroicons/react/outline";
import { CheckIcon } from "@heroicons/react/solid";

import ErrorBoundary from "../ErrorBoundary";

const notify = (message: string) => {
    toast.success(message, { id: "copy-toast" });
};

const CopyField = ({ value }: { value: string | undefined }) => {
    const [copied, setCopied] = React.useState(false);

    React.useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 5000);
        }
    }, [copied]);

    return (
        <ErrorBoundary>
            <div
                className={`input input-bordered flex py-2 px-4 justify-between w-80 ${
                    copied ? "input-success text-accent" : "text-base-content"
                }`}
            >
                <div className="mr-4">{value ?? ""}</div>

                <label
                    onClick={() => {
                        navigator.clipboard.writeText(value ?? "");
                        notify("Copied token to clipboard");
                        setCopied(true);
                    }}
                    className="swap"
                >
                    <input
                        type="checkbox"
                        checked={copied}
                        onChange={() => {}}
                    />
                    <ClipboardCopyIcon
                        className={`h-6 w-6 mx-auto swap-off 
                                text-base-content
                        `}
                    />
                    <CheckIcon className="text-accent swap-on h-6 w-6 mx-auto" />
                </label>
            </div>
        </ErrorBoundary>
    );
};

export default CopyField;
