import React from 'react';
import { Box, Flex, Button, Heading, Text, useBreakpointValue, Link, Image, useColorMode } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Document, Node, Inline } from '@contentful/rich-text-types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

import { IconLinkedin } from './Icon';
interface ImageFields {
  file: {
    url: string;
  };
}

interface ButtonFields {
  title: string;
  uri: string;
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
  const { colorMode } = useColorMode();
  const options: Options = {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => <Text pb={4}>{children}</Text>,
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => <Link color='teal' href={(node as Inline).data.uri}>{children}</Link>,
    },
    renderText: (text: string) => text.split('\n').flatMap((text, i) => [i > 0 && <br key={i} />, text]),
  };
  const moduleRef = useRef<HTMLDivElement>(null);
  const [elementTop, setElementTop] = useState(0);
  const [elementBottom, setElementBottom] = useState(0);

  useEffect(() => {
    const element = moduleRef.current;
    if (element) {
      const updatePosition = () => {
        const rect = element.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        setElementTop(rect.top + scrollTop);
        setElementBottom(rect.bottom + scrollTop);
      };

      updatePosition();
      window.addEventListener('resize', updatePosition);
      return () => window.removeEventListener('resize', updatePosition);
    }
  }, []);

  const { scrollY } = useScroll();
  const y1 = useTransform(
    scrollY,
    [elementTop - 800, elementBottom], // Start animation before element appears, end when it leaves viewport
    [200, -200]
  );
  const MotionFlex = motion(Flex as any);

  return (
    <Flex
      ref={moduleRef}
      id='personal'
      direction={flexDirection}
      position="relative"
      w={containerWidth}
      alignItems="center"
      justifyContent="space-between"
      margin="auto"
      borderRadius="4px"
      
    >
      {data.fields.image?.fields?.file?.url && (
        <Box
          w={{ md: "75%", base: "100%" }}
          h={{ base: 700, md: 700 }}
          position={"absolute"}
          style={{
            right: 0,
            top: 0,
            backgroundPosition: backgroundPosition,
            backgroundSize: "cover",
            backgroundImage: `url(${data.fields.image.fields.file.url})`,
            borderRadius: "4px",
            zIndex: -1,
          }}
        >
          <Box w="100%" h="100%" bg={`linear-gradient(to top, ${colorMode === 'dark' ? '#080808' : '#f9f9f9'}, transparent)`} opacity={1} position={"absolute"} />
        </Box>
      )}
      <MotionFlex
        zIndex={10}
        style={{y: y1 }}
        justifyContent="center"
        gap={4}
        direction="column"
        mt={{ md: 40, base: 500 }}
        w={{ lg: 550, md: 450, base: "100%" }}
        alignContent="center"
        p={padding}
        backdropFilter="blur(20px)"
        borderRadius="4px"
        boxShadow={colorMode === 'dark' ? '7px 7px 100px 20px rgba(0, 0, 0, 1)' : '7px 7px 130px 0px rgb(0 0 0 / 10%)' }
      >
        <Box>
          {data.fields.title && <Heading size="lg">{data.fields.title}</Heading>}
          {data.fields.subtitle && <Heading mt={2} size="md">{data.fields.subtitle}</Heading>}
        </Box>
        {data.fields.text && documentToReactComponents(data.fields.text, options)}
        <Flex gap={2}>
          {data.fields.button?.map((item, i) => (
            <Button key={i} colorScheme={item.fields.title === "LinkedIn" ? "blue" : "gray" } onClick={() => {
              window.open(item.fields.uri ? item.fields.uri : '#', '_blank');
            }}>{item.fields.title === "LinkedIn" ? <IconLinkedin width={20} height={20} color={colorMode === 'dark' ? 'white' : '#080808'} /> : item.fields.title}</Button>
          ))}
        </Flex>
      </MotionFlex>
      {/* TASK: Tags will go here!  */}
      
    </Flex>
  );
};

export default Module;
