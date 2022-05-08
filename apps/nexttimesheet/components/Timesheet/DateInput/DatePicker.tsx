import { DateTime } from "luxon";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { Popover } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/outline";

const DatePicker = ({ selected, onChange, filterDate }) => {
    return (
        <Popover className="relative w-full">
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={`
                ${open ? "bg-sky-500 text-white" : ""}
                group inline-flex h-10 justify-around w-full items-center rounded-md bg-slate-800 border border-slate-700 hover:border-sky-500 p-2 transition-colors duration-75
                 text-sky-300 hover:bg-sky-500 hover:text-white focus:outline-none focus-visible:ring-2
                  focus-visible:ring-white focus-visible:ring-opacity-75`}
                    >
                        {selected && (
                            <span>
                                {DateTime.fromJSDate(selected).toFormat(
                                    "dd/LLL/yyyy"
                                )}
                            </span>
                        )}

                        <CalendarIcon className="h-6 w-6" />
                    </Popover.Button>
                    {/* <Transition
                        show={open}
                        as={"div"}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-1"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="opacity-100 translate-y-0"
                        leaveTo="opacity-0 translate-y-1"
                    > */}
                    <Popover.Panel
                        as="div"
                        className="absolute z-50 mt-1 w-64 h-64 "
                    >
                        <div className="bg-slate-800 border border-slate-700 rounded-md shadow-lg shadow-black/30 p-2 h-full w-full">
                            <DayPicker
                                mode="single"
                                selected={selected}
                                onSelect={(date) => {
                                    onChange(date);
                                    close();
                                }}
                                disabled={filterDate}
                                initialFocus
                                classNames={{
                                    cell: "w-8 h-8 m-1",
                                    day_hidden: "hidden",
                                    vhidden: "hidden",
                                    day: "w-8 h-8 justify-center font-medium  text-sm leading-loose transition-colors duration-75 text-sky-300 rounded hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-30 disabled:font-base disabled:hover:bg-slate-600 hover:text-white disabled:hover:text-slate-400",
                                    head: "text-sky-500 font-medium text-center text-xs",
                                    caption: "flex justify-between p-2",
                                    nav: "flex space-x-2",
                                    caption_label:
                                        "my-auto text-sky-300 font-medium",
                                    nav_button:
                                        "w-8 h-8 flex hover:bg-slate-700 text-sky-300 hover:text-sky-200 p-2 rounded transition-colors duration-75",
                                }}
                            />
                        </div>
                    </Popover.Panel>
                    {/* </Transition> */}
                </>
            )}
        </Popover>
    );
};

// const DayContent = (props: DayContentProps) => {
//     return <DayContent {...props} />;
// };

export default DatePicker;
