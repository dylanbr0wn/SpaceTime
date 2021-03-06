import * as React from "react";

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";

import ErrorBoundary from "./ErrorBoundary";

/**
 * @name CustModal
 * @param {Object} props Props. See propTypes for details.
 * @component
 * @category Common Components
 * @description A general purpose modal.
 */
const CustModal = ({
	show,
	onHide,
	title,
	children = null,
}: {
	show: boolean;
	onHide: () => void;
	title: string;
	children?: React.ReactNode;
}) => {
	return (
		<Transition appear show={show} as={React.Fragment}>
			<Dialog
				data-theme="dark"
				as="div"
				className="relative z-50"
				onClose={onHide}
			>
				<Transition.Child
					as={React.Fragment}
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-500 bg-opacity-25" />
				</Transition.Child>

				<div className="fixed inset-0 overflow-y-auto">
					<div className="flex min-h-full items-center justify-center p-4 text-center">
						<Transition.Child
							as={React.Fragment}
							enter="ease-out duration-300"
							enterFrom="opacity-0 scale-95"
							enterTo="opacity-100 scale-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100 scale-100"
							leaveTo="opacity-0 scale-95"
						>
							<Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-base-300 p-6 text-left align-middle shadow-xl transition-all">
								<div className="absolute p-4 top-0 right-0">
									<button
										title="close"
										className="cursor-pointer"
										onClick={onHide}
									>
										<XIcon className="h-5 w-5 text-slate-500 hover:text-pink-500 " />
									</button>
								</div>
								<Dialog.Title
									as="h3"
									className="text-lg font-medium leading-6 text-slate-300"
								>
									{title}
								</Dialog.Title>
								<div className="mt-2">
									<ErrorBoundary>{children}</ErrorBoundary>
								</div>
							</Dialog.Panel>
						</Transition.Child>
					</div>
				</div>
			</Dialog>
		</Transition>
	);
};

export default CustModal;
