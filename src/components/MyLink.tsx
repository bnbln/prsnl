import React from 'react'
import { useRouter } from 'next/navigation'
import { Box } from '@chakra-ui/react';


export default function MyLink({
    children,
    href,
    fontSize = "inherit"
  }: {
    children: React.ReactNode,
    href: string,
    fontSize?: string
  }) {
    const router = useRouter()
    return (
        <Box as='button' fontSize={fontSize} p={3} className='menuItem' type="button" onClick={() => router.push(href)}>
        {children}
        </Box>
    )
  }