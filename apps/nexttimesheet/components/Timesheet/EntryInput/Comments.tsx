import { useUser } from "@auth0/nextjs-auth0";
import { Dialog } from "@headlessui/react";
import { PaperAirplaneIcon, XIcon } from "@heroicons/react/outline";
import * as React from "react";
import { useCreateEntryCommentMutation } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import Comment from "./Comment";
import cuid from "cuid";
import { DateTime } from "luxon";

const Comments = ({
    closeModal,
    comments,
    userId,
    timeEntryId,
    timeEntryRowId,
}) => {
    const [comment, setComment] = React.useState("");

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const { user } = useUser();

    const [createEntryCommentMutation, { data, loading, error }] =
        useCreateEntryCommentMutation();

    const saveComment = () => {
        createEntryCommentMutation({
            variables: {
                entryComment: {
                    timeEntryId,
                    text: comment,
                    userId,
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
                        id: userId,
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
            <div>
                <button
                    onClick={closeModal}
                    className="absolute top-0 right-0 h-10 w-10 p-2 text-slate-500 hover:text-pink-600 transition-colors"
                >
                    <XIcon className="h-6 w-6 " />
                </button>
            </div>
            <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-sky-200"
            >
                Comments
            </Dialog.Title>
            {comments.length > 0 ? (
                <>
                    {comments?.map((comment, i) => (
                        <div key={i}>
                            <Comment comment={comment} />
                        </div>
                    ))}
                </>
            ) : (
                <div className="my-5 text-slate-500 text-center">
                    Looks like there are no comments here...
                </div>
            )}

            <div className="mt-3 flex space-x-2">
                {user?.picture ? (
                    <img
                        src={user?.picture}
                        className="w-8 h-8 rounded-full my-auto"
                    />
                ) : (
                    <div className="rounded-full bg-sky-300 h-8 w-8 p-1 font-medium text-center text-slate-900">
                        {user?.name?.charAt(0)}
                    </div>
                )}

                <input
                    placeholder="Add a comment..."
                    type="text"
                    disabled={false}
                    onChange={onCommentChange}
                    className="bg-slate-800 placeholder:text-slate-500 appearance-none py-1 px-2 rounded-r-md rounded-tl-md border border-slate-700 caret-sky-300 text-sky-300 focus:border-sky-500 outline-none ring-transparent"
                    value={comment}
                />
                <button
                    onClick={saveComment}
                    type="button"
                    className="flex justify-center text-sm font-medium h-9 w-9 p-1 text-sky-300 bg-slate-800 border border-slate-700 rounded-md hover:bg-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-sky-500"
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
