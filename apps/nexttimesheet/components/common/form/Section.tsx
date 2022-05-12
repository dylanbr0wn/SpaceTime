const Section = ({ children, title = "" }) => {
    return (
        <div className=" divide-y divide-base-content/20">
            {title && (
                <div className="mx-1 text-medium text-secondary font-light py-1 ">
                    {title}
                </div>
            )}
            <div className="flex space-x-4 py-2">{children}</div>
        </div>
    );
};
export default Section;
