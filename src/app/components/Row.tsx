import React from 'react'
import { Box, Heading, HStack, useBreakpointValue } from '@chakra-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import Tile from './Tile'

interface Item {
  color?: string;
  title: string;
  desc: string;
  video?: string;
  image?: string;
}

interface RowProps {
  title?: string;
  small?: boolean;
  items: Item[];  // Stelle sicher, dass dies als Array von Items definiert ist
}


const Row: React.FC<RowProps> = ({ title, small, items }) => {
       
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
                            {items && items.map((item, i) => (
                              <Tile 
                                key={`rowItem-${i}`}
                                small={small}
                                color={item.color}
                                title={item.title}
                                desc={item.desc}
                                video={item.video}
                                image={item.image}
                              />
                            ))
                            }
                   </div>
                </div>
            </div>
          
        </Box>

    )
  }    

  export default Row;