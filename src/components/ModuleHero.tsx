import React from 'react';
import { Box, Flex, Button, Heading, Text, useBreakpointValue, Link, HStack, IconButton, Image, useColorMode } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Document, Node, Inline } from '@contentful/rich-text-types';
import { motion, useScroll, useTransform, Variants } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { Corners } from './Corners';


interface ImageFields {
  file: {
    url: string;
    details?: {
      image?: {
        width: number;
        height: number;
      };
    };
  };
  title?: string;
  description?: string;
}

// Add interface for Video Header Asset
interface VideoAsset {
  fields: {
    title?: string;
    description?: string;
    file: {
      url: string;
      details?: {
        size: number;
      };
      fileName?: string;
      contentType?: string;
    };
  };
  // Include sys details if needed, similar to ImageAsset
}

// Add interface for Image Asset
interface ImageAsset {
  fields: ImageFields;
  // Include sys details if needed
}

interface ButtonFields {
  title: string;
  uri: string;
}

// Define the structure for a single slide item, used for both modules and articles
interface SlideItemFields {
  title?: string;
  subtitle?: string; // Used for module subtitle or article description
  image?: ImageAsset; // Used for module image or article imageLandscape
  mediaSource?: Array<{ // Used for module mediaSource or article videoHeader
    fields: {
      file: {
        url: string;
      };
    };
  }>;
  button?: Array<{
    fields: ButtonFields;
  }>;
  slug?: string; // Add slug field for linking articles
  // Add other common fields if necessary
}

interface ModuleItem {
  // Use the unified SlideItemFields
  fields: SlideItemFields;
}

// Define the Article structure based on the provided JSON
interface ArticleFields {
  title?: string;
  slug?: string;
  published?: string;
  description?: string; // This will map to subtitle
  color?: string;
  image?: ImageAsset; // Main image, might not be used in hero if imageLandscape exists
  imageLandscape?: ImageAsset; // Preferred image for hero background
  videoHeader?: VideoAsset; // Video for hero background
  // Add other article fields if needed (related, size, etc.)
}

// Define a type guard to check if an item is an Article
// This helps distinguish items within the potentially mixed 'modules' array
const isArticle = (item: any): item is { sys: { contentType: { sys: { id: 'article' } } }, fields: ArticleFields } => {
  return item?.sys?.contentType?.sys?.id === 'article';
};

interface DataFields {
  title?: string;
  subtitle?: string;
  text?: Document;
  image?: ImageAsset; // Keep this for potential top-level image usage
  button?: Array<{
    fields: ButtonFields;
  }>;
  // The 'modules' array might contain both modules and articles based on the provided data
  modules?: Array<any>; // Use 'any' for now, or create a union type Module | Article
  // Remove the separate 'article' field if articles are now mixed into 'modules'
  // article?: {
  //   fields: ArticleFields;
  // };
}

interface ModuleHeroProps {
  title?: string;
  data: {
    fields: DataFields;
  };
}

// Define animation variants for the text elements
const textVariants: Variants = {
  // State when the text is hidden (slide not active)
  hidden: {
    opacity: 0,
    y: 25, // Start slightly lower
    transition: { duration: 0.4, ease: "easeOut" } // Faster fade out
  },
  // State when the text is visible (slide is active)
  // Accepts a delay value via the 'custom' prop
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7, // Slower, smoother fade-in duration
      delay: delay,   // Apply the passed delay
      ease: [0.4, 0, 0.2, 1], // Custom cubic bezier for smooth ease-in-out
    },
  }),
};

const ModuleHero: React.FC<ModuleHeroProps> = ({ data }) => {
  const flexDirection = useBreakpointValue<'column' | 'row'>({ base: "column", md: "row" });
  const containerWidth = useBreakpointValue({ base: "calc(100vw - 26px)", xl: "1089px" });
  const imageWidth = useBreakpointValue({ base: "100%", md: "50%" });
  const imageHeight = useBreakpointValue({ base: "400px", md: "100%" });
  const backgroundPosition = useBreakpointValue({ base: "top", md: "center" });
  const contentMarginTop = useBreakpointValue({ base: 420, md: 0 });
  const contentWidth = useBreakpointValue({ base: "100%", md: "50%" });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
  const slideHeight = useBreakpointValue({ base: '60vh', md: '100vh' });
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
    [0, 500]
  );

  // Determine slides based on available data
  let slides: ModuleItem[] = []; // Use ModuleItem which wraps SlideItemFields

  // Process the 'modules' array which might contain both modules and articles
  if (data.fields.modules) {
    data.fields.modules.forEach(item => {
      if (isArticle(item)) {
        // It's an article
        const article = item.fields;
        const articleSlide: ModuleItem = {
          fields: {
            title: article.title,
            subtitle: article.description, // Use description as subtitle
            image: article.imageLandscape || article.image,
            mediaSource: article.videoHeader ? [{ fields: { file: article.videoHeader.fields.file } }] : undefined,
            slug: article.slug, // Add the slug here
          }
        };
        slides.push(articleSlide);
      } else if (item?.sys?.contentType?.sys?.id === 'module') {
        // It's a module (assuming contentType 'module')
        // Ensure the item structure matches ModuleItem expectations
        // If 'item' already fits ModuleItem structure, push directly
        // Otherwise, adapt it like the articleSlide creation
         // Rename 'module' to avoid conflict with the built-in 'module' object
         const moduleFields = item.fields as SlideItemFields; // Rename variable
         slides.push({ fields: moduleFields }); // Use the renamed variable
      }
      // Add handling for other potential item types if necessary
    });
  }

  const extendedSlides = slides.length > 0 ? [slides[slides.length - 1], ...slides, slides[0]] : [];
  const [currentIndex, setCurrentIndex] = useState(1);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isInitialPositionSet, setIsInitialPositionSet] = useState(false);

  useEffect(() => {
    // Set the initial position without transition after the component mounts
    // The initial index is already set by useState(1) above.
    // setCurrentIndex(1); // Removed redundant state update
    setTransitionEnabled(false); // Disable transition for the very first positioning
    // Use a timeout to re-enable transitions shortly after the initial positioning
    const timer = setTimeout(() => {
        setTransitionEnabled(true);
        setIsInitialPositionSet(true); // Mark initial positioning as done
    }, 50); // 50ms delay

    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, []); // Empty dependency array ensures this runs only once on mount


  return (
    <Box h={slideHeight} style={{ overflow: 'hidden', position: 'relative', width: '100vw' }}>
        <motion.div style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 20, padding: padding, y: y1 }}>
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
        </motion.div>
      <motion.div
        style={{ display: 'flex', width: `${extendedSlides.length * 100}vw` }}
        // Set the initial position directly based on the starting index (1)
        // Only apply this initial style before the effect has run
        initial={!isInitialPositionSet ? { x: '-100vw' } : false}
        // Animate normally based on the currentIndex
        animate={{ x: -currentIndex * 100 + 'vw' }}
        // Apply transition based on the transitionEnabled state
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
        // --- Add Drag Functionality ---
        drag="x" // Enable horizontal dragging
        dragConstraints={{ left: 0, right: 0 }} // Constrain drag visually (doesn't affect slide logic)
        dragElastic={0.1} // Add slight resistance at constraints
        onDragEnd={(event, { offset, velocity }) => {
          const swipeThreshold = 50; // Minimum pixels dragged to trigger swipe
          const velocityThreshold = 300; // Minimum velocity to trigger swipe

          // Check if swipe distance OR velocity is significant enough
          if (Math.abs(offset.x) > swipeThreshold || Math.abs(velocity.x) > velocityThreshold) {
            setTransitionEnabled(true); // Ensure animation is smooth
            if (offset.x < -swipeThreshold || velocity.x < -velocityThreshold) {
              // Swiped left (go to next slide)
              setCurrentIndex(prev => prev + 1);
            } else if (offset.x > swipeThreshold || velocity.x > velocityThreshold) {
              // Swiped right (go to previous slide)
              setCurrentIndex(prev => prev - 1);
            } else {
              // Not a strong enough swipe, snap back (handled by animate prop)
            }
          }
          // If the drag wasn't enough to trigger a slide change,
          // the 'animate' prop will automatically snap the div back
          // to the position defined by the current `currentIndex`.
        }}
        // --- End Drag Functionality ---
      >

        
        {extendedSlides.map((item, index) => {
          // Determine if the current slide in the map is the active slide
          const isActive = index === currentIndex;

          const slideContent = (
            <Box h={slideHeight} style={{ flex: 'none', width: '100vw', position: 'relative' }}>
              {/* Background with parallax effect */}
              <motion.div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundImage: item.fields.image?.fields?.file?.url ? `url(${item.fields.image.fields.file.url})` : undefined,
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
                <Box w='calc(100vw - 120px)'>
                  {/* Title Animation */}
                  {item.fields.title && (
                    <motion.div
                      // Use a key that changes ONLY when this specific slide instance should re-animate
                      // Combining index and a unique slide identifier (like slug or title if unique) is robust
                      // Using just index might suffice here given how currentIndex changes
                      key={`title-${index}`}
                      custom={0} // Pass delay=0 to variants
                      initial="hidden" // Always start hidden
                      animate={isActive ? "visible" : "hidden"} // Animate based on isActive
                      variants={textVariants} // Use defined variants
                    >
                      {/* Apply responsive font size: 1rem on base, keep 'lg' size otherwise */}
                      <Heading size='lg' fontSize={{ base: '1rem', md: 'lg' }}>{item.fields.title}</Heading>
                    </motion.div>
                  )}

                  {/* Subtitle Animation */}
                  {item.fields.subtitle && (
                    <motion.div
                      key={`subtitle-${index}`}
                      custom={0.15} // Pass delay=0.15 to variants for subtitle
                      initial="hidden"
                      animate={isActive ? "visible" : "hidden"}
                      variants={textVariants}
                    >
                      {/* Apply responsive font size: 0.8rem on base, keep 'md' size otherwise */}
                      <Heading mt={2} size='md' fontSize={{ base: '0.8rem', md: 'md' }}>
                        {item.fields.subtitle}
                      </Heading>
                    </motion.div>
                  )}
                </Box>

              </Flex>
              </motion.div>
              {/* Overlay with text and buttons, positioned at bottom */}

            </Box>
          );

          // Conditional Linking
          return item.fields.slug ? (
            <Link href={`/${item.fields.slug}`} key={index} _hover={{ textDecoration: 'none' }} isExternal={false}>
              {slideContent}
            </Link>
          ) : (
            <Box key={index}>{slideContent}</Box>
          );
        })}

      </motion.div>
      
    </Box>
  );
};

export default ModuleHero;
