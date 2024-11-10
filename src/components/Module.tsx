import React from 'react';
import { Box, Flex, Button, Heading, Text, useBreakpointValue, Link, Image } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Document, Node, Inline } from '@contentful/rich-text-types';

interface ImageFields {
  file: {
    url: string;
  };
}

interface ButtonFields {
  title: string;
}

interface DataFields {
  title?: string;
  subtitle?: string;
  text?: Document;
  image?: {
    fields: ImageFields;
  };
  button?: Array<{
    fields: ButtonFields;
  }>;
}

interface ModuleProps {
  title?: string;
  data: {
    fields: DataFields;
  };
}

const Module: React.FC<ModuleProps> = ({ data }) => {
  const flexDirection = useBreakpointValue<'column' | 'row'>({ base: "column", md: "row" });
  const containerWidth = useBreakpointValue({ base: "calc(100vw - 26px)", xl: "1089px" });
  const imageWidth = useBreakpointValue({ base: "100%", md: "50%" });
  const imageHeight = useBreakpointValue({ base: "400px", md: "100%" });
  const backgroundPosition = useBreakpointValue({ base: "top", md: "center" });
  const contentMarginTop = useBreakpointValue({ base: 420, md: 0 });
  const contentWidth = useBreakpointValue({ base: "100%", md: "50%" });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });

  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => <Text pb={4}>{children}</Text>,
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => <Link color='teal' href={(node as Inline).data.uri}>{children}</Link>,
    },
    renderText: (text: string) => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
  };

  return (
    <Flex
      id='personal'
      direction={flexDirection}
      overflow="hidden"
      position="relative"
      w={containerWidth}
      alignItems="center"
      justifyContent="space-between"
      margin="auto"
      borderRadius="4.5px"
    >
      {data.fields.image?.fields?.file?.url && (
        <Box
          style={{
            width: imageWidth,
            height: imageHeight,
            position: "absolute",
            right: 0,
            top: 0,
            backgroundPosition: backgroundPosition,
            backgroundSize: "cover",
            backgroundImage: `url(${data.fields.image.fields.file.url})`,
            borderRadius: "4.5px",
          }}
        />
      )}
      <Flex
        justifyContent="center"
        gap={4}
        direction="column"
        mt={contentMarginTop}
        w={contentWidth}
        alignContent="center"
        p={padding}
      >
        <Box>
          {data.fields.title && <Heading size="lg">{data.fields.title}</Heading>}
          {data.fields.subtitle && <Heading mt={2} size="md">{data.fields.subtitle}</Heading>}
        </Box>
        {data.fields.text && documentToReactComponents(data.fields.text, options)}
        <Box>
          {data.fields.button?.map((item, i) => (
            <Button key={i}>{item.fields.title}</Button>
          ))}
        </Box>
      </Flex>
      {/* TASK: Tags will go here!  */}
      
    </Flex>
  );
};

export default Module;
