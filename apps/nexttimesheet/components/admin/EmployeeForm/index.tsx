import * as React from "react";

import { UserAddIcon } from "@heroicons/react/outline";
import { PlusIcon } from "@heroicons/react/solid";

import { User } from "../../../lib/apollo";
import Modal from "../../common/Modal";

import Form from "./Form";

/**
 * @name EmployeeForm
 * @component
 * @category Object Admin
 * @param {Object} props Props. See propTypes for details.
 * @description Form for editting a employee object and associated work codes.
 */

const EmployeeForm = ({ currentUser }: { currentUser: Partial<User> }) => {
    const [openForm, setOpenForm] = React.useState(false);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex  content-middle">
                <UserAddIcon className="w-7 h-7 mx-2 my-1 text-teal-500" />
                <div className="text-teal-300 text-xl w-full my-auto">
                    Invite
                </div>
            </div>
            <div className="text-sky-200 p-2">
                Add a user to your tenant so you can start using SpaceTime
                together!
            </div>
            <div>
                <button
                    onClick={() => setOpenForm(true)}
                    className="border-2 flex border-teal-500 shadow-transparent shadow-lg hover:shadow-cyan-500/20 text-teal-300 transition-all hover:text-white  hover:bg-teal-500 rounded-md p-2 mx-auto group "
                >
                    <PlusIcon className="h-6 w-6 mr-2" />

                    <div className="text-sm font-bold my-auto">Invite</div>
                </button>
            </div>
            <Modal
                title="Invite a user"
                show={openForm}
                onHide={() => setOpenForm(false)}
            >
                <Form currentUser={currentUser} />
            </Modal>
        </div>
    );
};

export default EmployeeForm;
