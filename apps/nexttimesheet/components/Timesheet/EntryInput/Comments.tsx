import cuid from "cuid";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import * as React from "react";

import { gql, useMutation } from "@apollo/client";
import { PaperAirplaneIcon } from "@heroicons/react/outline";

import { CreateEntryCommentDocument, EntryComment } from "../../../lib/apollo";
import Avatar from "../../common/Avatar";

import Comment from "./Comment";

const Comments = ({
    closeModal,
    comments,
    timeEntryId,
    timeEntryRowId,
    userId,
}: {
    closeModal: () => void;
    comments: Pick<EntryComment, "id">[];
    timeEntryId: string;
    timeEntryRowId: string;
    userId: string;
}) => {
    const { data: sessionData } = useSession();

    const [comment, setComment] = React.useState("");

    const onCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setComment(event.target.value);
    };

    const [createEntryCommentMutation] = useMutation(
        CreateEntryCommentDocument
    );

    const saveComment = () => {
        createEntryCommentMutation({
            variables: {
                entryId: timeEntryId,
                text: comment,
                userId: userId ?? "-1",
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
                        id: userId ?? "-1",
                        name: sessionData?.user?.name,
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
                                    userId={userId ?? "-1"}
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
                    <Avatar
                        image={sessionData?.user?.image}
                        name={sessionData?.user?.name}
                    />
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
        </>
    );
};

export default Comments;
