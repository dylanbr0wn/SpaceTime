const Section = ({ children, title = "" }) => {
    return (
        <div className=" divide-y divide-base-content/20">
            {title && (
                <div className="mx-1 text-lg text-base-content font-semibold py-1 ">
                    {title}
                </div>
            )}
            <div className="flex space-x-4">{children}</div>
        </div>
    );
};
export default Section;
