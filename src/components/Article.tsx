import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link, Button, useColorMode } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Block, Document, Inline, Node } from '@contentful/rich-text-types';
import Image from 'next/image';
import SEO from './SEO';
import { useRouter } from 'next/navigation' 
import Carousel from './Carousel';
import Row from './Row';

interface AssetFields {
  file: {
    url: string;
    contentType: string;
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

export interface ArticleData {
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
  const isVideo = file.contentType.includes('video');

  if (isVideo) {
    return (
        <video
          controls
          autoPlay={false}
          loop={false}
          muted
          playsInline
          style={{
            borderRadius: "4.5px",
            width: "100%",
            height: "auto",
            maxWidth: "100%",
          }}
        >
          <source src={"https:" + file.url} type={file.contentType} />
          Your browser does not support the video tag.
        </video>
    );
  }

  return (
    <Box mt={4} mb={8}>
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
  const { slug, title, type, media } = node.data.target.fields as EntryFields;
  return (
    <>
      {type === "Carousel" && media && <Carousel media={media} interval={9000} />}
    </>
  );
};

const Wrapper: React.FC<{ node: Node, children: React.ReactNode }> = ({ node, children }) => {
  const isEmbeddedAsset = node.nodeType === 'embedded-asset-block';
  const isVideo = isEmbeddedAsset && 
  node.data?.target?.fields?.file?.contentType?.includes('video');

  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  
  
  return(
    <Flex
        justifyContent="center"
        w={useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' })}
        mx="auto"
      >
        <Flex
          gap={4}
          direction="column"
          w={useBreakpointValue({ base: '100%', md: '80%' })}
          px={padding}
          alignItems={"center"}
        >
          {isVideo ? (children) : (
          <Box className='text' w={textWidth}>
            {children}
          </Box>
          )}
          </Flex>
          </Flex>
  )
};

const formatDate = (inputDate: string, outputFormat: string): string => {
  const date = new Date(inputDate);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  };
  const formatter = new Intl.DateTimeFormat(outputFormat, options);
  return formatter.format(date);
};

const Article: React.FC<ArticleProps> = ({ data, page = true }) => {  
    // 'de-DE'
    //console.log("article", data);
    const formattedDate = data.published ? formatDate(data.published, 'en-US') : null;

  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
  const paddingTop = page ? padding : 0;

  const { colorMode } = useColorMode();
  const color = colorMode === 'dark' ? '#080808': '#f9f9f9' ;
  const gradient = `linear-gradient(to bottom, ${color}00, ${color}ff)`;
  
  const router = useRouter();

  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => <Wrapper node={node}><Text pb={4}>{children}</Text></Wrapper>,
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => <Link color='teal' href={(node as Inline).data.uri}>{children}</Link>,
      [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => <Wrapper node={node}><Heading fontWeight={200} size="lg" pb={4}>{children}</Heading></Wrapper>,
      [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => <Wrapper node={node}><Heading size="md" pt={4} pb={2}>{children}</Heading></Wrapper>,
      [INLINES.EMBEDDED_ENTRY]: (node: Node) => (
        <Link color="blue" href={`./${(node as Inline).data.target.fields.slug}`}>
          {(node as Inline).data.target.fields.title}
        </Link>
      ),
      [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => <EmbeddedEntry node={node} />,
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => <Wrapper node={node}><EmbeddedAsset node={node} /></Wrapper>,
    },
    renderText: (text: string) => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
  };

  return (
    <>
    {page && (
    <SEO 
        title={data.title + " | Design & Code"}
        description={data.description}
        image={`https:${data.image?.fields.file.url}`}
        article={true}
      />  
      )}
      <Flex
        justifyContent="center"
        direction={useBreakpointValue({ base: 'column', md: 'row' })}
        overflow="hidden"
        position="relative"
        w={useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' })}
        mx="auto"
        mb={page ? 0 : "2rem"}
        borderRadius={4.5}
        pt={page ? "2rem" : 0 }
      >
        <Flex
          gap={4}
          direction="column"
          w={useBreakpointValue({ base: '100%', md: '80%' })}
          px={padding}
          pt={paddingTop}
          maxHeight={page ? "none" : "650px"}
          pos={"relative"}
          alignItems={"center"}
        >

          {/* TITLE AREA */}
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
            {formattedDate && (
              <Heading textAlign="center" opacity={0.3} mt={4} size="xs">
                {formattedDate}
              </Heading>
            )}
            {data.excerpts && (
              <Text textAlign="center" mt={4} fontSize={"lg"} fontWeight={300} pb={4}>{data.excerpts}</Text>
            )}
          </Box>

          {/* HAS IMAGE */}
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
                width: "100%",
                height: "500px",
                marginBottom: "2rem"
              }}
            />
          }

          {/* IS TEASER */}
          {page === false &&
          <Flex position={"absolute"} alignItems={"flex-end"} justifyContent={"center"} w={"100%"} bottom={0} left={0} height={325} background={gradient}>
           <Button onClick={() => router.push("/"+data.slug)}>Read more</Button>
          </Flex>
         }

        {/* IS PAGE */}
        </Flex>
      </Flex>

      {/* MAPPING COMPONENTS */}
      {page && data.text && documentToReactComponents(data.text, options)}

         {/* HAS RELATED POSTS */}
      {page === true && data.related &&
      <Box mt={24}>
        <Row title={"Related Posts"} small={true} items={data.related} />
      </Box>
      }
    </>
  );
};

export default Article;
