import React from 'react'
import { Box, Flex, Button, Heading, Text , useBreakpointValue, Link } from '@chakra-ui/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';


interface ModuleProps {
  title?: string;
  data: []
}


const Module: React.FC<ModuleProps> = ({ data }) => {
       //console.log("button:", data.fields.button);
       const options = {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (node, children) => <Text>{children}</Text>,
          [INLINES.HYPERLINK]: (node, children) => <Link href={node.data.uri}>{children}</Link>,
        },
        renderText: text => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
      };
       
    return (
        <Flex id='personal' direction={useBreakpointValue({base: "column", md: "row"})} overflow={"hidden"} position={"relative"} w={useBreakpointValue({base: "calc(100vw - 26px)", xl: "1089px"})} alignItems="center" justifyContent={"space-between"} margin="auto" borderRadius={4.5}>
                {data.fields.image.fields.file.url && 
                    <Box style={{
                        width: useBreakpointValue({base: "100%", md: "50%"}),
                        height: useBreakpointValue({base: "400px", md: "100%"}),
                        position: "absolute",
                        right: 0,
                        top: 0,
                        backgroundPosition: useBreakpointValue({base: "top", md: "center"}),
                        backgroundSize: "cover",
                        backgroundImage: "url("+data.fields.image.fields.file.url+")",
                        borderRadius: 4.5
                        }} />
                    }
                <Flex justifyContent={"center"} gap={4} direction={"column"} mt={useBreakpointValue({base: 420, md: 0})} w={useBreakpointValue({base: "100%", md: "50%"})} alignContent="center" p={useBreakpointValue({base: 4, sm:12,  xl: 20})}>
                    <Box>
                        {data.fields.title && <Heading size={"lg"}>{data.fields.title}</Heading>}
                        <Heading mt={2} size={"md"}>{data.fields.subtitle}</Heading>
                    </Box>
                    {data.fields.text.content.map((item, index) => (
                        <React.Fragment key={index}>
                            {documentToReactComponents(item, options)}
                        </React.Fragment>
                    ))}
                    <Box>
                        {data.fields.button && data.fields.button.map((item,i)=> {
                            <Button key={i} variant={"none"}>{item.fields.title}</Button>
                        })}
                    </Box>
                </Flex>
                </Flex>
    )
}
export default Module;