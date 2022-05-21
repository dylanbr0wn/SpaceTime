import { useQuery } from "@apollo/client";

import { EntryCommentDocument } from "../../../lib/apollo";
import Avatar from "../../common/Avatar";
import Loading from "../../common/Loading";

const Comment = ({
    comment,
    userId,
}: {
    comment: { id: string };
    userId: string;
}) => {
    const { data, loading, error } = useQuery(EntryCommentDocument, {
        variables: {
            id: comment.id,
        },
        skip: !comment.id,
    });

    return (
        <>
            {loading ? (
                <div className="mx-auto">
                    <Loading />
                </div>
            ) : error ? (
                <div>I have a bad feeling about this.</div>
            ) : (
                <div
                    className={`flex my-2 ${
                        data?.entryComment?.user.id !== userId
                            ? "flex-row-reverse text-right"
                            : ""
                    }`}
                >
                    <Avatar
                        bg={
                            data?.entryComment?.user.id !== userId
                                ? "bg-secondary"
                                : "bg-primary"
                        }
                        name={data?.entryComment?.user.name}
                        image={data?.entryComment?.user.avatar}
                    />

                    <p className="text-base-content px-2">
                        {data?.entryComment?.text}
                    </p>
                </div>
            )}
        </>
    );
};

export default Comment;
