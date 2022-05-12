import { useGetEntryCommentQuery } from "../../../lib/apollo";
import Avatar from "../../common/Avatar";
import Loading from "../../common/Loading";

const Comment = ({
    comment,
    userId,
}: {
    comment: { id: string };
    userId: string;
}) => {
    const { data, loading, error } = useGetEntryCommentQuery({
        variables: {
            commentId: comment.id,
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
                        data?.getEntryComment?.user.id !== userId
                            ? "flex-row-reverse text-right"
                            : ""
                    }`}
                >
                    <Avatar
                        bg={
                            data?.getEntryComment?.user.id !== userId
                                ? "bg-secondary"
                                : "bg-primary"
                        }
                        name={data?.getEntryComment?.user.name}
                        image={data?.getEntryComment?.user.avatar}
                    />

                    <p className="text-base-content px-2">
                        {data?.getEntryComment?.text}
                    </p>
                </div>
            )}
        </>
    );
};

export default Comment;
