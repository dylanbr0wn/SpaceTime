import { trpc } from "../../../utils/trpc";
import Avatar from "../../common/Avatar";
import Loading from "../../common/Loading";

const Comment = ({
	comment,
	userId,
}: {
	comment: { id: string };
	userId: string;
}) => {
	const { data, isLoading, error } = trpc.useQuery(
		[
			"entryComment.read",
			{
				id: comment.id,
			},
		],
		{
			enabled: !!comment.id,
		}
	);

	return (
		<>
			{isLoading ? (
				<div className="mx-auto">
					<Loading />
				</div>
			) : error ? (
				<div>I have a bad feeling about this.</div>
			) : (
				<div
					className={`flex my-2 ${
						data?.user.id !== userId ? "flex-row-reverse text-right" : ""
					}`}
				>
					<Avatar
						bg={data?.user.id !== userId ? "bg-secondary" : "bg-primary"}
						name={data?.user.name}
						image={data?.user.avatar}
					/>

					<p className="text-base-content px-2">{data?.text}</p>
				</div>
			)}
		</>
	);
};

export default Comment;
