import { useGetEntryCommentQuery } from "../../../lib/apollo";

const Comment = ({ comment }) => {
    const { data } = useGetEntryCommentQuery({
        variables: {
            commentId: comment.id,
        },
        skip: !comment.id,
    });

    return (
        <div className="flex my-2">
            {data?.getEntryComment?.user.avatar ? (
                <img
                    src={data?.getEntryComment?.user.avatar}
                    className="w-8 h-8 rounded-full mr-2 p-1"
                />
            ) : (
                <div className="rounded-full bg-sky-300 h-8 w-8 mr-2 p-1 font-medium text-center">
                    {data?.getEntryComment?.user?.name?.charAt(0)}
                </div>
            )}

            <p className="text-sky-300 p-1">{data?.getEntryComment?.text}</p>
        </div>
    );
};

export default Comment;
