import NextLink from 'next/link'
import type { ComponentProps } from 'react'
import { isPublicLinkEnabled } from '@/core/lib/modules'
export default function ModuleLink(props: ComponentProps<typeof NextLink>) {
 const path = typeof props.href === 'string' ? props.href : props.href.pathname || '/'
 return isPublicLinkEnabled(path) ? <NextLink {...props} /> : null
}
