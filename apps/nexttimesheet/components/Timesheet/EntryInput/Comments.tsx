import cuid from "cuid";
import { DateTime } from "luxon";
import * as React from "react";

import { gql } from "@apollo/client";
import { PaperAirplaneIcon } from "@heroicons/react/outline";

import {
    EntryComment,
    useCreateEntryCommentMutation,
    User,
} from "../../../lib/apollo";
import Avatar from "../../common/Avatar";

import Comment from "./Comment";

const Comments = ({
    closeModal,
    comments,
    user,
    timeEntryId,
    timeEntryRowId,
}: {
    closeModal: () => void;
    comments: Pick<EntryComment, "id">[];
    user: Partial<User>;
    timeEntryId: string;
    timeEntryRowId: string;
}) => {
    const [comment, setComment] = React.useState("");

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const [createEntryCommentMutation] = useCreateEntryCommentMutation();

    const saveComment = () => {
        createEntryCommentMutation({
            variables: {
                entryComment: {
                    timeEntryId,
                    text: comment,
                    userId: user?.id ?? "-1",
                },
            },
            optimisticResponse: {
                createEntryComment: {
                    __typename: "EntryComment",
                    id: cuid(),
                    text: comment,
                    createdAt: DateTime.now().toISO(),
                    updatedAt: DateTime.now().toISO(),
                    user: {
                        __typename: "User",
                        id: user?.id ?? "-1",
                        name: user?.name,
                        avatar: "",
                    },
                },
            },
            update: (cache, { data }) => {
                cache.modify({
                    id: cache.identify({
                        __typename: "TimeEntry",
                        id: timeEntryId,
                    }),
                    fields: {
                        entryComments(existingComments, { readField }) {
                            const newCommentRef = cache.writeFragment({
                                data: data?.createEntryComment,
                                fragment: gql`
                                    fragment NewComment on EntryComment {
                                        id
                                    }
                                `,
                            });
                            if (
                                existingComments.some(
                                    (ref) =>
                                        readField("id", ref) ===
                                        data?.createEntryComment?.id
                                )
                            ) {
                                return existingComments;
                            }
                            return [...existingComments, newCommentRef];
                        },
                    },
                });
            },
        });
        setComment("");
    };

    return (
        <>
            <div className="w-72 mx-auto">
                {comments.length > 0 ? (
                    <>
                        {comments?.map((comment, i) => (
                            <div key={i}>
                                <Comment
                                    comment={comment}
                                    userId={user?.id ?? "-1"}
                                />
                            </div>
                        ))}
                    </>
                ) : (
                    <div className="my-5 text-slate-500 text-center">
                        Looks like there are no comments here...
                    </div>
                )}
            </div>

            <div className="mt-4 flex space-x-2 justify-center">
                <div className="my-auto">
                    <Avatar image={user?.avatar} name={user?.name} />
                </div>

                <input
                    placeholder="Add a comment..."
                    type="text"
                    disabled={false}
                    onChange={onCommentChange}
                    onKeyUp={(event) => {
                        if (event.key === "Enter") saveComment();
                    }}
                    className="input input-bordered input-md py-1 px-2 "
                    value={comment}
                />
                <button
                    onClick={saveComment}
                    type="button"
                    className="btn btn-square btn-ghost"
                    // onClick={}
                >
                    <PaperAirplaneIcon className="h-6 w-6 text-teal-300" />
                </button>
            </div>

            {/* <div className="mt-4 flex justify-end">
                <button
                    type="button"
                    className="justify-center px-4 py-2 text-sm font-medium text-red-500 bg-slate-800 rounded-md hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
                    onClick={closeModal}
                >
                    Close
                </button>
            </div> */}
        </>
    );
};

export default Comments;
