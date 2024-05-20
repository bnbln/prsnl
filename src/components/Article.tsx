import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link, Button, useColorMode } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Block, Document, Inline, Node } from '@contentful/rich-text-types';
import Image from 'next/image';
import { useRouter } from 'next/navigation' 
import Carousel from './Carousel';
import Row from './Row';

interface AssetFields {
  file: {
    url: string;
  };
  title: string;
  description?: string;
}

interface EntryFields {
  slug: string;
  title: string;
  type: string;
  media?: unknown; // Replace with the appropriate type if known
}

interface RelatedPost {
  fields: {
    title: string;
    slug: string;
  };
}

interface ArticleData {
  title: string;
  page?: boolean;
  slug?: string;
  excerpts?: string;
  published: string;
  description?: string;
  color?: string;
  image?: {
    fields: AssetFields;
  };
  text?: Document;
  related?: RelatedPost[];
}

interface ArticleProps {
  page?: boolean;
  data: ArticleData;
}

// Embedded Asset Component
const EmbeddedAsset: React.FC<{ node: Node }> = ({ node }) => {
  const { file, title } = node.data.target.fields as AssetFields;
  return (
    <Box mb={4}>
      <Image
        src={"https:" + file.url}
        alt={title}
        width="500"
        height="500"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          borderRadius: "4.5px",
          position: "relative",
          width: "100%"
        }}
      />
    </Box>
  );
};

// Embedded Entry Component
const EmbeddedEntry: React.FC<{ node: Node }> = ({ node }) => {
  console.log(node);
  
  const { slug, title, type, media } = node.data.target.fields as EntryFields;
  return (
    <>
      {type === "Carousel" && media && <Carousel media={media} interval={9000} />}
    </>
  );
};

const formatDate = (inputDate: string): string => {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const formatter = new Intl.DateTimeFormat('de-DE', options);
  return formatter.format(date);
};

const Article: React.FC<ArticleProps> = ({ data, page = true }) => {
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
  const paddingTop = page ? padding : 0;

  const { colorMode } = useColorMode();
  const color = colorMode === 'dark' ? '#080808': '#f9f9f9' ;
  const gradient = `linear-gradient(to bottom, ${color}00, ${color}ff)`;
  
  const router = useRouter();

  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => <Text pb={4}>{children}</Text>,
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => <Link color='teal' href={(node as Inline).data.uri}>{children}</Link>,
      [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => <Heading fontWeight={200} size="lg" pb={4}>{children}</Heading>,
      [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => <Heading size="md" pt={4} pb={2}>{children}</Heading>,
      [INLINES.EMBEDDED_ENTRY]: (node: Node) => (
        <Link color="blue" href={`./${(node as Inline).data.target.fields.slug}`}>
          {(node as Inline).data.target.fields.title}
        </Link>
      ),
      [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => <EmbeddedEntry node={node} />,
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => <EmbeddedAsset node={node} />,
    },
    renderText: (text: string) => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
  };

  const formattedDate = data.published ? formatDate(data.published) : '';

  return (
    <>
      <Flex
        justifyContent="center"
        direction={useBreakpointValue({ base: 'column', md: 'row' })}
        overflow="hidden"
        position="relative"
        w={useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' })}
        mx="auto"
        mb={page ? 0 : "2rem"}
        borderRadius={4.5}
      >
        <Flex
          gap={4}
          direction="column"
          w={useBreakpointValue({ base: '100%', md: '80%' })}
          px={padding}
          pt={paddingTop}
          maxHeight={page ? "none" : "650px"}
          pos={"relative"}

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
              src={`https:${data.image.fields.file.url}`}
              alt={data.image.fields.title}
              width="900"
              height="500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              priority
              style={{
                objectFit: "cover",
                borderRadius: "4.5px",
                position: "relative",
                width: "100%"
              }}
            />
          }
          {page ?
            <Box w={textWidth}>
              {data.text && documentToReactComponents(data.text, options)}
            </Box>
            : 
            <Flex position={"absolute"} alignItems={"flex-end"} justifyContent={"center"} w={"100%"} bottom={0} left={0} height={325} background={gradient}>
              <Button borderRadius={100} onClick={() => router.push("/"+data.slug)}>Read more</Button>
            </Flex>
          }
        </Flex>
      </Flex>
      {page === true && data.related &&
        <Row title={"Related Posts"} small={true} items={data.related} />
      }
    </>
  );
};

export default Article;
