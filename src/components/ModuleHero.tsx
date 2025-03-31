import React from 'react';
import { Box, Flex, Button, Heading, Text, useBreakpointValue, Link, HStack, IconButton, Image, useColorMode } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Document, Node, Inline } from '@contentful/rich-text-types';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';


interface ImageFields {
  file: {
    url: string;
  };
}

interface ButtonFields {
  title: string;
  uri: string;
}

interface ModuleItem {
  // Define the properties that exist in each module item
  fields: {
    title?: string;
    subtitle?: string;
    image?: {
      fields: ImageFields;
    };
    mediaSource?: Array<{
      fields: {
        file: {
          url: string;
        };
      };
    }>;
    button?: Array<{
      fields: ButtonFields;
    }>;
  };
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
  modules?: Array<ModuleItem>;
}

interface ModuleHeroProps {
  title?: string;
  data: {
    fields: DataFields;
  };
}

const ModuleHero: React.FC<ModuleHeroProps> = ({ data }) => {
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
  const { scrollY } = useScroll();
  const y1 = useTransform(
    scrollY,
    [0,2000], // Start animation before element appears, end when it leaves viewport
    [0, 450]
  );

  const slides = data.fields.modules || [];
  const extendedSlides = slides.length > 0 ? [slides[slides.length - 1], ...slides, slides[0]] : [];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);

  return (
    <div style={{ overflow: 'hidden', position: 'relative', width: '100vw', height: '100vh' }}>
      <motion.div
        style={{ display: 'flex', width: `${extendedSlides.length * 100}vw` }}
        animate={{ x: -currentIndex * 100 + 'vw' }}
        transition={transitionEnabled ? { type: 'tween', duration: 0.5 } : { duration: 0 }}
        onAnimationComplete={() => {
          if (currentIndex === 0) {
            setTransitionEnabled(false);
            setCurrentIndex(slides.length);
          } else if (currentIndex === extendedSlides.length - 1) {
            setTransitionEnabled(false);
            setCurrentIndex(1);
          }
        }}
      >
        {extendedSlides.map((item, index) => (
          <div key={index} style={{ flex: 'none', width: '100vw', height: '100vh', position: 'relative' }}>
            {/* Background with parallax effect */}
            <motion.div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundImage: item.fields.image ? `url(${item.fields.image.fields.file.url})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 0,
                y: y1
              }}
            >
            {item.fields.mediaSource && item.fields.mediaSource[0] && item.fields.mediaSource[0].fields.file.url && (
              <video
                src={item.fields.mediaSource[0].fields.file.url}
                autoPlay
                loop
                muted
                playsInline
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0
                }}
              />
            )}
            <Flex
              id='personal'
              position='absolute'
              bottom={0}
              left={0}
              right={0}
              alignItems='flex-end'
              justifyContent='space-between'
              px={padding}
              pb={padding}
              background='linear-gradient(0deg, #0000009e, transparent)'
              zIndex={10}
            >
              <Box>
                {item.fields.title && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={index === currentIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Heading size='lg'>{item.fields.title}</Heading>
                  </motion.div>
                )}
                
                {item.fields.subtitle && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={index === currentIndex ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                    transition={{ duration: 0.4, delay: index === currentIndex ? 0.1 : 0 }}
                  >
                    <Heading mt={2} size='md'>
                      {item.fields.subtitle + " "}
                      {/* <a href={item.fields.button[0]?.fields.uri}> Read More</a> */}
                    </Heading>
                  </motion.div>
                )}
              </Box>
              
            </Flex>
            </motion.div>
            {/* Overlay with text and buttons, positioned at bottom */}
            
          </div>
        ))}
      </motion.div>
      <Box position='absolute' bottom={0} right={0} zIndex={20} padding={padding} >
                <HStack spacing={2}>
                  <IconButton
                    aria-label='Scroll left'
                    icon={<ChevronLeftIcon />}
                    onClick={() => {
                      setTransitionEnabled(true);
                      setCurrentIndex(prev => prev - 1);
                    }}
                  />
                  <IconButton
                    aria-label='Scroll right'
                    icon={<ChevronRightIcon />}
                    onClick={() => {
                      setTransitionEnabled(true);
                      setCurrentIndex(prev => prev + 1);
                    }}
                  />
                </HStack>
              </Box>
    </div>
  );
};

export default ModuleHero;
