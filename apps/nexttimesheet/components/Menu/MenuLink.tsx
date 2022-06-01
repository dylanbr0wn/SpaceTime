import * as React from 'react'
import Link from 'next/link'

const MenuLink = React.forwardRef(({ href, children, ...rest }: {href: string; children: React.ReactNode, className?: string}, ref: React.Ref<HTMLAnchorElement>) => {
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  )
})

export default MenuLink