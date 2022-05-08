const Section = ({ children, title = "" }) => {
    return (
        <div className=" divide-y divide-slate-700">
            {title && (
                <div className="mx-1 text-medium text-sky-300 font-light py-1 ">
                    {title}
                </div>
            )}
            <div className="flex space-x-4 py-2">{children}</div>
        </div>
    );
};
export default Section;
