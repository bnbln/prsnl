import React from 'react'
import { Box, Flex, Button, Heading, Text , useBreakpointValue, Link } from '@chakra-ui/react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES } from '@contentful/rich-text-types';


// Embedded Asset Component
const EmbeddedAsset: React.FC<{ node: any }> = ({ node }) => {
    const { file, title, description } = node.data.target.fields;
    return (
      <Box mb={4}>
        <img src={file.url} alt={title} />
        {description && <Box>{description}</Box>}
      </Box>
    );
  };
  
  // Embedded Entry Component
  const EmbeddedEntry: React.FC<{ node: any }> = ({ node }) => {
    const { slug, title } = node.data.target.fields;
    return (
      <Link color="blue" href={`./${slug}`}>
        {title}
      </Link>
    );
  };


interface ArticleProps {
  title?: string;
  data: any
}


const Article: React.FC<ArticleProps> = ({ data }) => {
       //console.log("data article:", data.fields.text);
       const options = {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (node, children) => <Text size={node.data} pb={4}>{children}</Text>,
          [INLINES.HYPERLINK]: (node, children) => <Link href={node.data.uri}>{children}</Link>,
          [BLOCKS.HEADING_1]: (node, children) => <Heading fontWeight={200} size={"lg"} pb={4}>{children}</Heading>,
          [BLOCKS.HEADING_2]: (node, children) => <Heading size={"md"} pt={4} pb={2}>{children}</Heading>,
          [INLINES.EMBEDDED_ENTRY]: (node, children) => <Link color={"blue"} href={"./"+node.data.target.fields.slug}>{node.data.target.fields.title}</Link>,
          [BLOCKS.EMBEDDED_ENTRY]: (node, children) => <EmbeddedEntry node={node} />,
          [BLOCKS.EMBEDDED_ASSET]: (node, children) => <EmbeddedAsset node={node} />,        
        },
        renderText: text => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
      };
      const optionsExcerpt = {
        renderNode: {
          [BLOCKS.PARAGRAPH]: (node, children) => <Text textAlign={"center"} size={node.data} pb={4}>{children}</Text>,
          [INLINES.HYPERLINK]: (node, children) => <Link href={node.data.uri}>{children}</Link>,
          [BLOCKS.HEADING_1]: (node, children) => <Heading fontWeight={200} size={"lg"} pb={4}>{children}</Heading>,
          [BLOCKS.HEADING_2]: (node, children) => <Heading size={"md"} pt={4} pb={2}>{children}</Heading>,
          [INLINES.EMBEDDED_ENTRY]: (node, children) => <Link color={"blue"} href={"./"+node.data.target.fields.slug}>{node.data.target.fields.title}{console.log(node)}</Link>,
          [BLOCKS.EMBEDDED_ENTRY]: (node, children) => <EmbeddedEntry node={node} />,
          [BLOCKS.EMBEDDED_ASSET]: (node, children) => <EmbeddedAsset node={node} />,        
        },
        renderText: text => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
      };
       
    return (
        <Flex id='personal' justifyContent={"center"} direction={useBreakpointValue({base: "column", md: "row"})} overflow={"hidden"} position={"relative"} w={useBreakpointValue({base: "calc(100vw - 26px)", xl: "1089px"})} margin="auto" borderRadius={4.5}>
                <Flex justifyContent={"center"} gap={4} direction={"column"} w={useBreakpointValue({base: "100%", md: "80%"})} alignContent="center" p={useBreakpointValue({base: 4, sm:12,  xl: 20})}>
                    <Box>
                        {data.description && <Heading mt={2} textAlign={"center"} size={"md"}>{data.description}</Heading>}
                        {data.title && <Heading textAlign={"center"} size={"xl"}>{data.title}</Heading>}
                        {data.excerpt && data.excerpt.content.map((item, index) => (
                        <React.Fragment key={index}>
                            {documentToReactComponents(item, optionsExcerpt)}
                        </React.Fragment>
                    ))}
                    </Box>
                    <Box w={useBreakpointValue({base: "100%", md: "60%"})}>
                    {data.text && data.text.content.map((item, index) => (
                        <React.Fragment key={index}>
                            {documentToReactComponents(item, options)}
                        </React.Fragment>
                    ))}
                    </Box>
                </Flex>
                </Flex>
    )
}
export default Article;