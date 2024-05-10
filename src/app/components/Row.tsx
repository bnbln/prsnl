'use client'

import React, { useRef, useEffect, useState } from 'react'
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

    const [gutter, setGutter] = useState(0)
    const [inner, setInner] = useState(1206)
    const elementRef = useRef(null);
    
    useEffect(() => {
        // Ensure this code doesn't run during SSR
        if (typeof window !== 'undefined') {
          const handleResize = () => {
            if (elementRef.current) {
              const left = elementRef.current.offsetLeft;
              setGutter(left);
              setInner(window.innerWidth);
            }
          };
    
          // Call handleResize once to set initial state
          handleResize();
    
          // Setup event listener
          window.addEventListener('resize', handleResize);
    
          // Cleanup function to remove the event listener
          return () => window.removeEventListener('resize', handleResize);
        }
      }, []); // Empty dependency array ensures this effect only runs once
          
    return (
        <Box mt={"6.75rem"}>
            <Box maxW={"68rem"} ml={"auto"} mr={"auto"} ref={elementRef} id="test">
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
                overflowClipMargin: "calc(0.5*var(--document-width)-max(68rem,calc(var(--document-width)-40px)))"
            }}>
                <div style={{
                    //  width: "var(--document-width)", 
                    width: useBreakpointValue({base: "100%", xl: inner}) ,
                    marginLeft: useBreakpointValue({base: 0, xl: -gutter-12}),
                    //marginLeft: "calc(-1*var(--gutter-size))",
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
                            <Box pl={gutter} />
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
                            <Box pl={gutter} />
                   </div>
                </div>
            </div>
          
        </Box>

    )
  }    