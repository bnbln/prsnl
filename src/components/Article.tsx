import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Block, Document, Inline, Node } from '@contentful/rich-text-types';
import Image from 'next/image';

// Type guard to check if a node is of type Block
const isBlock = (node: Node): node is Block => {
  return (node as Block).nodeType in BLOCKS;
};

// Type guard to check if a node is of type Inline
const isInline = (node: Node): node is Inline => {
  return (node as Inline).nodeType in INLINES;
};

// Embedded Asset Component
const EmbeddedAsset: React.FC<{ node: Block }> = ({ node }) => {
  const { file, title, description } = node.data.target.fields;
  //console.log(node);
  
  return (
    <Box mb={4}>
      <img src={file.url} alt={title} />
      {description && <Box>{description}</Box>}
    </Box>
  );
};

// Embedded Entry Component
const EmbeddedEntry: React.FC<{ node: Block }> = ({ node }) => {
  const { slug, title } = node.data.target.fields;
  return (
    <Link color="blue" href={`./${slug}`}>
      {title}
    </Link>
  );
};

interface ArticleProps {
  title?: string;
  data: {
    title: string;
    slug?: string;
    excerpts?: string;
    published: string;
    description?: string;
    color?: string;
    image?: {
      fields: {
        title: string;
        file: {
          url: string;
        };
      };
    };
    text?: Document;
    related?: Array<{
      fields: {
        title: string;
        slug: string;
      };
    }>;
  };
}

function formatDate(inputDate: string): string {
  const date = new Date(inputDate);
  
  // Define options for formatting the date
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };

  // Create a formatter for the German locale
  const formatter = new Intl.DateTimeFormat('de-DE', options);

  return formatter.format(date);
}

const Article: React.FC<ArticleProps> = ({ data }) => {
  const flexDirection: 'column' | 'row' = useBreakpointValue({ base: 'column', md: 'row' }) || 'column';
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const contentWidth = useBreakpointValue({ base: '100%', md: '80%' });
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });

  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => <Text pb={4}>{children}</Text>,
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => <Link color='teal' href={(node as Inline).data.uri}>{children}</Link>,
      [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => <Heading fontWeight={200} size="lg" pb={4}>{children}</Heading>,
      [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => <Heading size="md" pt={4} pb={2}>{children}</Heading>,
      [INLINES.EMBEDDED_ENTRY]: (node: Node) => (
        <Link href={`./${(node as Inline).data.target.fields.slug}`}>
          {(node as Inline).data.target.fields.title}
        </Link>
      ),
      [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => isBlock(node) ? <EmbeddedEntry node={node} /> : null,
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => isBlock(node) ? <EmbeddedAsset node={node} /> : null,
    },
    renderText: (text: string) => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
  };

  const formattedDate: string = formatDate(data.published);
  return (
    <Flex
      justifyContent="center"
      direction={flexDirection}
      overflow="hidden"
      position="relative"
      w={containerWidth}
      mx="auto"
      borderRadius={4.5}
    >
      <Flex
        gap={4}
        direction="column"
        w={contentWidth}
        p={padding}
      >
        <Box>
          {data.description && (
            <Heading mt={2} textAlign="center" size="md">
              {data.description}
            </Heading>
          )}
          {data.title && (
            <Heading textAlign="center" size="xl">
              {data.title}
            </Heading>
          )}
          {data.published && (
            <Heading textAlign="center" opacity={0.3} mt={4} size="xs">
              {formattedDate}
            </Heading>
          )}
          {data.excerpts && (
            <Text textAlign="center" mt={4} fontSize={"lg"} fontWeight={300} pb={4}>{data.excerpts}</Text>
          )}
        </Box>
        {data.image &&
          <Image
            src={`https:${data?.image?.fields?.file.url}`}
            alt={data?.image?.fields?.title}
            width="900"
            height="500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{ 
              objectFit: "cover",
              borderRadius: "4.5px",
              position: "relative",
              width: "100%"
            }}
          />
        }
        <Box w={textWidth}>
          {data.text && documentToReactComponents(data.text, options)}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Article;
