import { DateTime } from "luxon";
import * as React from "react";
import { DayPicker } from "react-day-picker";

import { Popover } from "@headlessui/react";
import { CalendarIcon } from "@heroicons/react/outline";

import CustTransition from "../../common/CustTransition";

const DatePicker = ({ selected, onChange, filterDate }) => {
    return (
        <Popover className="relative w-full z-20">
            {({ open, close }) => (
                <>
                    <Popover.Button
                        className={`
               
                btn text-sm`}
                    >
                        {selected && (
                            <span>
                                {DateTime.fromJSDate(selected).toFormat(
                                    "dd/LLL/yyyy"
                                )}
                            </span>
                        )}

                        <CalendarIcon className="h-6 w-6 ml-3" />
                    </Popover.Button>
                    <CustTransition open={open}>
                        <Popover.Panel
                            static
                            className="absolute z-50 mt-1 w-64 left-0 right-0"
                        >
                            <div className="bg-base-200 rounded-lg shadow-lg shadow-black/30 p-2 h-full w-full z-50">
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
                                        day_disabled: "btn-disabled",
                                        day: "w-8 h-8 btn btn-square btn-primary btn-sm",
                                        head: "text-primary font-medium text-center text-xs pb-2",
                                        caption: "flex justify-between p-2",
                                        nav: "flex space-x-2",
                                        caption_label:
                                            "my-auto text-content font-medium",
                                        nav_button:
                                            "w-8 h-8 btn btn-square btn-sm btn-ghost",
                                    }}
                                />
                            </div>
                        </Popover.Panel>
                    </CustTransition>
                </>
            )}
        </Popover>
    );
};

// const DayContent = (props: DayContentProps) => {
//     return <DayContent {...props} />;
// };

export default DatePicker;
