import Link from "next/link";
import * as React from "react";

const MenuLink = (
    {
        href,
        children,
        ...rest
    }: { href: string; children: React.ReactNode; className?: string },
    ref: React.Ref<HTMLAnchorElement>
) => {
    return (
        <Link href={href}>
            <a ref={ref} {...rest}>
                {children}
            </a>
        </Link>
    );
};

export default React.forwardRef(MenuLink);
