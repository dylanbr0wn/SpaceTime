import Image from "next/image";

const Avatar = ({
	name,
	image,
	bg = "bg-primary",
}: {
	name: string | undefined | null;
	image: string | undefined | null;
	bg?: string;
}) => {
	return (
		<>
			{image ? (
				<div className="avatar ">
					<div className=" rounded-full w-8 h-8">
						<Image alt={name ?? ""} src={image ?? ""} width={32} height={32} />
					</div>
				</div>
			) : (
				<div className="avatar placeholder ">
					<div className={`${bg} text-neutral-content rounded-full w-8 h-8`}>
						<span className="text-sm text-base-content">{name?.charAt(0)}</span>
					</div>
				</div>
			)}
		</>
	);
};
export default Avatar;
