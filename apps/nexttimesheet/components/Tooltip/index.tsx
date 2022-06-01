// import * as React from "react";

// import {
//     autoUpdate,
//     flip,
//     offset,
//     shift,
//     useDismiss,
//     useFloating,
//     useFocus,
//     useHover,
//     useInteractions,
//     useRole,
// } from "@floating-ui/react-dom-interactions";
// import { Transition } from "@headlessui/react";

// const Tooltip = ({ children, content }) => {
//     const [open, setOpen] = React.useState(false);

//     const { x, y, reference, floating, strategy, context, refs, update } =
//         useFloating({
//             placement: "top",
//             open,
//             onOpenChange: setOpen,
//             middleware: [offset(5), flip(), shift({ padding: 8 })],
//         });

//     const { getReferenceProps, getFloatingProps } = useInteractions([
//         useHover(context),
//         useFocus(context),
//         useRole(context, { role: "tooltip" }),
//         useDismiss(context),
//     ]);

//     React.useEffect(() => {
//         if (refs.reference.current && refs.floating.current && open) {
//             return autoUpdate(
//                 refs.reference.current,
//                 refs.floating.current,
//                 update
//             );
//         }
//     }, [refs.reference, refs.floating, update, open]);

//     return (
//         <>
//             {React.isValidElement(children) &&
//                 React.cloneElement(
//                     children,
//                     getReferenceProps({ ref: reference })
//                 )}
//             <Transition
//                 show={open}
//                 enter="transition-opacity duration-200 "
//                 enterFrom="opacity-0"
//                 enterTo="opacity-100"
//                 leave="transition-opacity duration-200"
//                 leaveFrom="opacity-100"
//                 leaveTo="opacity-0"
//             >
//                 <div
//                     {...getFloatingProps({
//                         ref: floating,
//                         className:
//                             "pointer-events-none whitespace-no-wrap z-20 bg-zinc-800 text-white px-4 py-2 rounded flex flex-col items-center",
//                         style: {
//                             position: strategy,
//                             top: y ?? "",
//                             left: x ?? "",
//                         },
//                     })}
//                 >
//                     {content}
//                 </div>
//             </Transition>
//         </>
//     );
// };
// export default Tooltip;
