import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link, Button, useColorMode } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Block, Document, Inline, Node } from '@contentful/rich-text-types';
import { useRouter } from 'next/navigation' 


export interface CloudData {
  title: string;
  slug?: string;
  text?: Document;
  uri?: string;
}

interface CloudProps {
  page?: boolean;
  buttons: CloudData;
}

const Cloud: React.FC<CloudProps> = ({ data, page = true }) => {  
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
  const paddingTop = page ? padding : 0;

  const { colorMode } = useColorMode();
  const color = colorMode === 'dark' ? '#080808': '#f9f9f9' ;
  const gradient = `linear-gradient(to bottom, ${color}00, ${color}ff)`;
  console.log(data.buttons);
  
  
  const router = useRouter();

  return (
    <>
      <Flex
        justifyContent="center"
        direction={useBreakpointValue({ base: 'column', md: 'row' })}
        overflow="hidden"
        position="relative"
        w={useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' })}
        mx="auto"
        borderRadius={4.5}
      >
        <Flex
          gap={4}
          direction="column"
          w={useBreakpointValue({ base: '100%', md: '80%' })}
          px={padding}
          pt={paddingTop}
          maxHeight={"650px"}
          pos={"relative"}
          alignItems={"center"}
        >

          {/* TITLE AREA */}
          <Box>
            {data.title && (
              <Heading textAlign="center" size="xl">
                {data.title}
              </Heading>
            )}
          </Box>

          {/* IS TEASER */}
          {/* {page === false &&
          <Flex position={"absolute"} alignItems={"flex-end"} justifyContent={"center"} w={"100%"} bottom={0} left={0} height={325} background={gradient}>
           <Button borderRadius={100} onClick={() => router.push("/"+data.slug)}>Read more</Button>
          </Flex>
         } */}

          <Flex flexWrap={"wrap"} justifyContent={"center"} gap={"1rem"}>
            {data.buttons && data.buttons.map((item, i)=>  (<Button cursor={"inherit"} key={i}>{item.fields?.title}</Button>)
            )}
          </Flex>
         </Flex>
         </Flex>
         
    </>
  );
};

export default Cloud;
