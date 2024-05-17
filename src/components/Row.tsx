import React from 'react'
import { Box, Heading, HStack, useBreakpointValue } from '@chakra-ui/react';
import {ChevronLeftIcon, ChevronRightIcon} from '@chakra-ui/icons'
import Tile from './Tile'

interface Fields {
    color?: string;
    title: string;
    desc: string;
    video?: string;
    image?: string;
  }
  
interface Item {
    fields: Fields[]
}

interface RowProps {
  title?: string;
  small?: boolean;
  items: Item[];
}


const Row: React.FC<RowProps> = ({ title, small, items = [] }) => {
    const gutterSize = useBreakpointValue({ base: 0, xl: 'var(--gutter-size)' });    

    return (
        <Box w={"100%"}>
            <Box maxW="68rem" mx="auto" px={4}>
                <HStack mb={8} w="100%" justifyContent="space-between">
                    <Heading fontSize="1.685625rem">{title}</Heading>
                    <HStack spacing={2}>
                        <ChevronLeftIcon />
                        <ChevronRightIcon />
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
                                color={item.fields.color}
                                title={item.fields.title}
                                desc={item.fields.description}
                                image={item.fields.image}
                                video={item.fields.video}
                                slug={item.fields.slug}
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