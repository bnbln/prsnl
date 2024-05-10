import React from 'react'
import { Box, Heading, HStack, useBreakpointValue } from '@chakra-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import Tile from './Tile'


export default function Row({
    children,
    href,
    title,
    small,
    items
  }: {
    children: React.ReactNode,
    href: string
    title?: string,
    small?: boolean,
    items: object 
  }) {
       
    return (
        <Box mt={"6.75rem"}>
            <Box maxW={"68rem"} ml={"auto"} mr={"auto"}>
                <HStack mb={8} w={"100%"} justifyContent={"space-between"} pl={useBreakpointValue({base: 4, xl: 0})} pr={useBreakpointValue({base: 4, xl: 0})} >
                    <Heading fontSize='1.685625rem' color={"white"}>{title}</Heading>
                    <HStack gap={2} color={"white"}>
                        <ChevronLeftIcon/>
                        <ChevronRightIcon/>
                    </HStack>
                </HStack>
            </Box>

            <div style={{
                maxWidth: "68rem",
                marginLeft: "auto",
                marginRight: "auto",
            }}>
                <div style={{
                    width: useBreakpointValue({base: "100%", xl: "100vw"}) ,
                    marginLeft: useBreakpointValue({base: 0, xl: "calc(-1*var(--gutter-size))"}) ,
                }}>
                    <div style={{
                        gap: 12,
                        scrollSnapType: "x mandatory", 
                        scrollbarWidth: "none", 
                        WebkitOverflowScrolling: "touch", 
                        overflowY: "hidden", 
                        overflowX: "auto", 
                        scrollPaddingLeft: "var(--gutter-size)",
                        scrollPaddingRight: "var(--gutter-size)",
                        display: "flex",
                        minWidth:"100%"
                        }}>
                            {items && items.map((item, i) => {
                                // console.log(item);
                                return(
                                    <Tile 
                                        key={"rowItem-"+i}
                                        small={small && small} 
                                        color={item.color && item.color} 
                                        title={item.title && item.title} 
                                        desc={item.desc && item.desc} 
                                        video={item.video && item.video} 
                                        image={item.image && item.image} 
                                        />
                                )
                            })}
                   </div>
                </div>
            </div>
          
        </Box>

    )
  }    