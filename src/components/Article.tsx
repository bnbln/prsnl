import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link, Button, useColorMode, Spinner, useColorModeValue, FlexProps } from '@chakra-ui/react';
import { documentToReactComponents, Options } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, Block, Document, Inline, Node } from '@contentful/rich-text-types';
import Image from 'next/image';
import SEO from './SEO';
import { useRouter } from 'next/navigation' 
import Carousel from './Carousel';
import Row from './Row';
import { useScroll } from 'framer-motion';
import { useTransform } from 'framer-motion';
import CustomVideoPlayer from './CustomVideoPlayer';
import { FaPlay } from 'react-icons/fa';
import { useState } from 'react';
import ReactPlayer from 'react-player/lazy';

console.log('Imported CustomVideoPlayer in Article.tsx:', CustomVideoPlayer);

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
    published?: string;
  };
}

// Add this interface for Module entries
interface ModuleFields {
  title: string;
  subtitle?: string;
  image?: {
    fields: AssetFields;
  };
  // Add other module fields as needed
}

// Add this interface for Article entries
interface LinkedArticleFields {
  title: string;
  slug: string;
  published?: string;
  description?: string;
  color?: string;
  image?: {
    fields: AssetFields;
  };
  imageLandscape?: {
    fields: AssetFields;
  };
  usePortraitImage?: boolean;
  excerpts?: string;
  size?: string;
}

// Add this interface for Video entries
interface VideoEntryFields {
  title: string;
  video?: {
    fields: AssetFields;
  };
  thumbnail?: {
    fields: AssetFields;
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
  videoHeader?: {
    fields: AssetFields;
  };
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
// New ImageRow component for rendering image row embedded entry
const ImageRow: React.FC<{ node: Node }> = ({ node }) => {
  const files = node.data.target.fields.files;
  if (!files || files.length === 0) return null;
  const count = files.length;

  return (
    <Flex direction="row" justify="space-between" position="relative" w="100%" mb={4}>
      {files.map((file: any, index: number) => {
        const url = file.fields.file.url.startsWith('//')
          ? `https:${file.fields.file.url}`
          : file.fields.file.url;
        const title = file.fields.title;
        const imageDetails = file.fields.file.details?.image;
        const widthPercentage = `${100 / count}%`;
        return (
            <Image
              key={index}
              src={url}
              alt={title}
              width={imageDetails?.width || 500}
              height={imageDetails?.height || 500}
              style={{ width: "calc(" + widthPercentage + " - 6px)", height: "auto", borderRadius: "4.5px" }}
            />
        );
      })}
    </Flex>
  );
};

// Add a Module component to render embedded modules
const Module: React.FC<{ node: Node }> = ({ node }) => {
  const { title, subtitle, image } = node.data.target.fields as ModuleFields;
  // --- Move hook calls to top level ---
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const innerFlexWidth = useBreakpointValue({ base: '100%', md: '80%' });
  const paddingX = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
  // --- End hook calls ---

  return (
    <Flex
      justifyContent="center"
      w={containerWidth} // Use variable
      mx="auto"
      my={8}
    >
      <Flex
        direction="column"
        w={innerFlexWidth} // Use variable
        px={paddingX} // Use variable
        alignItems="center"
        borderRadius="md"
        borderWidth="1px"
        borderColor="gray.200"
        overflow="hidden"
        _dark={{
          borderColor: "gray.700"
        }}
      >
        {image && (
          <Box w="100%" mt={4}>
            <Image
              src={`https:${image.fields.file.url}`}
              alt={title}
              width={1200}
              height={675}
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: "4.5px",
              }}
            />
          </Box>
        )}
        
        <Box py={6} px={4} w="100%">
          <Heading size="md" mb={2}>{title}</Heading>
          {subtitle && <Text opacity={0.7}>{subtitle}</Text>}
        </Box>
      </Flex>
    </Flex>
  );
};

// Add a LinkedArticle component to render embedded articles
const LinkedArticle: React.FC<{ node: Node }> = ({ node }) => {
  const fields = node.data.target.fields as LinkedArticleFields;
  const formattedDate = fields.published ? formatDate(fields.published, 'en-US') : null;

  // Determine which image to use (Define this *before* using it in hooks)
  const imageToUse = fields.usePortraitImage ?
    fields.image :
    (fields.imageLandscape || fields.image);

  // --- Move hook calls to top level ---
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const innerFlexWidth = useBreakpointValue({ base: '100%', md: '80%' });
  const imageBoxWidth = useBreakpointValue({ base: '100%', md: '40%' });
  const imageBoxHeight = useBreakpointValue({ base: '200px', md: 'auto' });
  const contentFlexWidth = useBreakpointValue({ base: '100%', md: imageToUse ? '60%' : '100%' });
  const cardDirection = useBreakpointValue<'column' | 'row'>({ base: 'column', md: 'row' });
  // --- End hook calls ---

  return (
    <Flex
      justifyContent="center"
      w={containerWidth} // Use variable
      mx="auto"
      my={8}
    >
      <Flex
        direction="column"
        w={innerFlexWidth} // Use variable
        borderRadius="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.200"
        transition="transform 0.3s ease, box-shadow 0.3s ease"
        _hover={{
          transform: "translateY(-4px)",
          boxShadow: "lg",
        }}
        _dark={{
          borderColor: "gray.700"
        }}
      >
        <Link href={`/${fields.slug}`} style={{ textDecoration: 'none' }}>
          {/* Article Card Content */}
          <Flex direction={cardDirection} w="100%">
            {/* Image Section */}
            {imageToUse && (
              <Box 
                w={imageBoxWidth} // Use variable
                h={imageBoxHeight} // Use variable
                position="relative"
              >
                <Image
                  src={`https:${imageToUse.fields.file.url}`}
                  alt={fields.title}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}
            
            {/* Content Section */}
            <Flex 
              direction="column" 
              p={6} 
              w={contentFlexWidth} // Use variable
              justifyContent="space-between"
            >
              {/* Top content */}
              <Box>
                {fields.description && (
                  <Text 
                    fontSize="sm" 
                    fontWeight="500"
                    color={fields.color || "teal.500"}
                    mb={2}
                  >
                    {fields.description}
                  </Text>
                )}
                
                <Heading size="md" mb={3}>
                  {fields.title}
                </Heading>
                
                {fields.excerpts && (
                  <Text opacity={0.8} mb={4}>
                    {fields.excerpts}
                  </Text>
                )}
              </Box>
              
              {/* Bottom content */}
              <Flex justifyContent="space-between" alignItems="center" mt={4}>
                {formattedDate && (
                  <Text fontSize="sm" opacity={0.6}>
                    {formattedDate}
                  </Text>
                )}
                
                <Text 
                  fontSize="sm" 
                  fontWeight="500" 
                  color={fields.color || "teal.500"}
                >
                  Read more →
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Link>
      </Flex>
    </Flex>
  );
};

// Restore EmbeddedVideo to use CustomVideoPlayer
const EmbeddedVideo: React.FC<{ node: Node, color?: string }> = ({ node, color }) => {
  console.log("EmbeddedVideo Component - Received color prop:", color);
  const fields = node.data.target.fields as VideoEntryFields;
  const { title, video, thumbnail } = fields;
  const [showPlayer, setShowPlayer] = useState(false);
  // --- Move hook calls to top level ---
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  // --- Add mobile detection hook ---
  const isMobile = useBreakpointValue({ base: true, md: false });
  // --- End hook calls ---

  const videoUrl = video?.fields?.file?.url;
  const thumbnailUrl = thumbnail?.fields?.file?.url;
  const thumbnailAlt = thumbnail?.fields?.title || title || 'Video thumbnail';

  const finalVideoUrl = videoUrl?.startsWith('//') ? `https:${videoUrl}` : videoUrl;
  const finalThumbnailUrl = thumbnailUrl?.startsWith('//') ? `https:${thumbnailUrl}` : thumbnailUrl;

  if (!finalVideoUrl) {
    console.warn("Embedded video is missing video URL:", fields);
    return <Text color="red.500">Embedded video is missing its source.</Text>;
  }

  const handleThumbnailClick = () => {
    setShowPlayer(true);
  };

  return (
    <Flex
      justifyContent="center"
      w={containerWidth} // Use variable
      mx="auto"
      my={8}
      direction="column"
      alignItems="center"
    >
      <Box
        position="relative"
        w="100%"
        borderRadius="md"
        overflow="hidden"
        borderWidth="1px"
        borderColor="gray.200"
        _dark={{ borderColor: "gray.700" }}
        aspectRatio={16 / 9}
        bg="black"
      >
        {!showPlayer && finalThumbnailUrl ? (
          // Thumbnail part
          <Box
             position="absolute"
             top="0"
             left="0"
             width="100%"
             height="100%"
             onClick={handleThumbnailClick}
             cursor="pointer"
          >
            <Image
              src={finalThumbnailUrl}
              alt={thumbnailAlt}
              width={1200}
              height={675}
              style={{
                display: 'block',
                width: '100%',
                height: 'auto',
                aspectRatio: '16/9',
                objectFit: 'cover',
              }}
            />
            {/* Overlay Flex - REMOVE backdropFilter from here */}
            <Flex
              position="absolute"
              top="0"
              left="0"
              right="0"
              bottom="0"
              align="center"
              justify="center"
              // sx prop removed or cleared of backdropFilter
              bg="rgba(0, 0, 0, 0.4)" // Keep a semi-transparent background for the overlay
              transition="background-color 0.2s ease"
              _hover={{ bg: "rgba(0, 0, 0, 0.6)" }} // Darken overlay on hover
            >
              {/* Play Button Box - KEEP frosted glass style here */}
              <Box
                 // Apply the frosted glass style ONLY to the button's background
                 sx={{
                   backdropFilter: 'blur(5px)', // Blur only behind this element
                   backgroundColor: 'rgba(0, 0, 0, 0.4)', // Semi-transparent background for the button
                   WebkitBackdropFilter: 'blur(5px)', // Safari support
                 }}
                 borderRadius="full"
                 p={5} // Keep padding
                 display="inline-flex"
                 alignItems="center"
                 justifyContent="center"
                 // Add transition for hover effect on the button itself
                 transition="background-color 0.2s ease"
                 _hover={{
                   backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darken button slightly on hover
                 }}
              >
                <FaPlay size="2em" color="white" style={{ marginLeft: '3px' }} />
              </Box>
            </Flex>
          </Box>
        ) : finalVideoUrl ? (
          // --- Conditional Player Rendering ---
          isMobile ? (
            // Mobile: Use ReactPlayer with native controls
            <ReactPlayer
              url={finalVideoUrl}
              controls={true}
              playing={true} // Native player starts immediately
              width="100%"
              height="100%"
              playsinline
            />
          ) : (
            // Desktop: Use CustomVideoPlayer and tell it to start playing
            <CustomVideoPlayer
              videoUrl={finalVideoUrl}
              color={color}
              startPlaying={true} // Pass the new prop here
            />
          )
        ) : (
           // Fallback remains the same
           <Flex position="absolute" top="0" left="0" right="0" bottom="0" align="center" justify="center">
             <Text color="orange.500">Video source not available.</Text>
           </Flex>
        )}
      </Box>

      {title && (
        <Heading size="md" mt={4} textAlign="left" w="100%">
          {title}
        </Heading>
      )}
    </Flex>
  );
};

// Update the EmbeddedEntry component to handle different entry types
const EmbeddedEntry: React.FC<{ node: Node }> = ({ node }) => {
  // Check the content type to determine how to render
  const contentTypeId = node.data.target.sys.contentType.sys.id;

  if (contentTypeId === 'module') {
    return <Module node={node} />;
  }

  if (contentTypeId === 'article') {
    return <LinkedArticle node={node} />;
  }

  // Add the new video type check
  if (contentTypeId === 'video') {
    return <EmbeddedVideo node={node} />;
  }

  // Original carousel handling (assuming 'type' field exists on other types)
  // Consider making this more robust if other types don't have 'type' field
  const fields = node.data.target.fields as EntryFields; // Use a base type or check fields exist
  if (fields.type === "Carousel" && fields.media) {
     return <Carousel media={fields.media} interval={9000} />;
  }

  // Fallback or render nothing/error for unhandled types
  console.warn("Unhandled embedded entry type:", contentTypeId, node.data.target.fields);
  return null; // Or render a placeholder/error message
};

// Update Wrapper to accept props instead of using hooks directly
interface WrapperProps {
  node: Node;
  children: React.ReactNode;
}

// Call hooks inside the component
const Wrapper: React.FC<WrapperProps> = ({ node, children }) => {
  // --- Move hook calls to top level ---
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const innerFlexWidth = useBreakpointValue({ base: '100%', md: '100%' }); // Or adjust as needed
  const textWidthValue = useBreakpointValue({ base: '100%', md: '500px' }); // Calculate textWidth here
  // --- End hook calls ---

  const isEmbeddedAsset = node.nodeType === 'embedded-asset-block';
  const isVideo = isEmbeddedAsset &&
  node.data?.target?.fields?.file?.contentType?.includes('video');

  return(
    <Flex
        justifyContent="center"
        w={containerWidth} // Use variable
        mx="auto"
      >
        <Flex
          gap={4}
          direction="column"
          w={innerFlexWidth} // Use variable
          alignItems={"center"}
        >
          {/* Use calculated textWidthValue */}
          {isVideo ? (children) : (
          <Box className='text' w={textWidthValue}> {/* Use variable */}
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
    // --- DEBUGGING START ---
    // console.log("Article Component Received Data:", JSON.stringify(data, null, 2)); // Log the entire data object
    // console.log("Is Page:", page);
    // console.log("Has videoHeader field:", data && data.hasOwnProperty('videoHeader'));
    if (data && data.videoHeader) {
      // console.log("videoHeader Content:", JSON.stringify(data.videoHeader, null, 2));
      // console.log("videoHeader URL:", data.videoHeader.fields?.file?.url);
    } else {
      // console.log("videoHeader is missing or null.");
    }
    // --- DEBUGGING END ---

    const formattedDate = data.published ? formatDate(data.published, 'en-US') : null;

    // --- Move Hook Calls to Top Level ---
    const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });
    const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
    const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
    const headerInnerFlexWidth = useBreakpointValue({ base: '100%', md: '80%' });
    // Use FlexProps['direction'] for type safety if needed, or keep as is if simpler
    const headerDirection = useBreakpointValue<'column' | 'row'>({ base: 'column', md: 'row' });
    const mainContentWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' }); // For main content section
    const teaserInnerFlexWidth = useBreakpointValue({ base: '100%', md: '80%' }); // Specific for teaser if different, else reuse headerInnerFlexWidth
    const teaserDirection = useBreakpointValue<'column' | 'row'>({ base: 'column', md: 'row' }); // Specific for teaser if different, else reuse headerDirection

    const { scrollY } = useScroll(); // Keep hooks for potential re-introduction
    const y1 = useTransform(scrollY, [0, 800], [0, 200]);

    const { colorMode } = useColorMode();
    const color = colorMode === 'dark' ? '#080808': '#f9f9f9' ;
    const gradient = `linear-gradient(to bottom, ${color}00, ${color}ff)`;
  
    const router = useRouter();


    const options: Options = {
      renderNode: {
        // Remove props passed to Wrapper
        [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => <Wrapper node={node}><Text pb={4}>{children}</Text></Wrapper>,
        [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => <Link color='teal' href={(node as Inline).data.uri}>{children}</Link>,
        // Remove props passed to Wrapper
        [BLOCKS.HEADING_1]: (node: Node, children: React.ReactNode) => <Wrapper node={node}><Heading fontWeight={200} size="lg" pb={4}>{children}</Heading></Wrapper>,
        // Remove props passed to Wrapper
        [BLOCKS.HEADING_2]: (node: Node, children: React.ReactNode) => <Wrapper node={node}><Heading size="md" pt={4} pb={2}>{children}</Heading></Wrapper>,
        [INLINES.EMBEDDED_ENTRY]: (node: Node) => (
          <Link color="blue" href={`./${(node as Inline).data.target.fields.slug}`}>
            {(node as Inline).data.target.fields.title}
          </Link>
        ),
        [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => {
          const contentTypeId = node.data.target.sys.contentType?.sys?.id;

          if (contentTypeId === 'video') {
            return <EmbeddedVideo node={node} color={data.color} />;
          }
          if (contentTypeId === 'imageRow') {
            return <ImageRow node={node} />;
          }

          console.warn("Unhandled embedded entry type in main text:", contentTypeId, node.data.target.fields);
          return <EmbeddedEntry node={node} />;
        },
        // Remove props passed to Wrapper
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

        {/* === FULL PAGE VIEW === */}
        {page && (
          <>
            {/* --- HEADER SECTION (Video or Image/Title) --- */}
            {(() => { // IIFE for easier logging inside JSX conditional
              const hasVideo = data && data.videoHeader && data.videoHeader.fields?.file?.url;
              // console.log("Rendering Header - Has Video:", hasVideo); // Log if video header branch should render

              if (hasVideo) {
                // VIDEO HEADER (Simplified - No Parallax Motion Div)
                // console.log("Rendering VIDEO Header (Simplified)"); // Confirm this block is reached
                const videoUrl = data.videoHeader!.fields.file.url;
                const finalVideoUrl = videoUrl.startsWith('//') ? `https:${videoUrl}` : videoUrl;
                // console.log("Final Video URL:", finalVideoUrl);

                return (
                  <Box
                    position="relative"
                    w="100%"
                    h={{ base: '60vh', md: '70vh' }} // Define container height
                    overflow="hidden" // Keep overflow hidden
                    mb={8}
                    bg="black" // Add temporary background to see the container
                  >
                    {/* Video Element directly positioned */}
                    <video
                      src={finalVideoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      style={{
                        position: 'absolute', // Position relative to the Box
                        top: 0,
                        left: 0,
                        width: '100%',    // Make video fill the container width
                        height: '100%',   // Make video fill the container height
                        objectFit: 'cover', // Cover the area, maintain aspect ratio
                        zIndex: 0,        // Behind the overlay
                      }}
                      onError={(e) => console.error("Video Error:", e)} // Log video specific errors
                    />

                    {/* Content Overlay (Remains the same) */}
                    <Flex
                      position="absolute"
                      bottom={0}
                      left={0}
                      right={0}
                      direction="column"
                      alignItems="center"
                      justifyContent="flex-end"
                      px={padding ?? 4}
                      pb={padding ?? 4}
                      pt={20}
                      background="linear-gradient(0deg, #000000c0 40%, transparent)"
                      zIndex={10} // Ensure overlay is on top
                      h="100%"
                      textAlign="center"
                      color="white"
                    >
                      {/* TITLE AREA within Video Header */}
                      {data.description && ( <Heading mt={2} size="md">{data.description}</Heading> )}
                      {data.title && ( <Heading size="xl">{data.title}</Heading> )}
                      {formattedDate && ( <Heading opacity={0.7} mt={4} size="xs">{formattedDate}</Heading> )}
                      {data.excerpts && ( <Text mt={4} fontSize={"lg"} fontWeight={300} pb={4}>{data.excerpts}</Text> )}
                    </Flex>
                  </Box>
                );
              } else {
                // ORIGINAL IMAGE/TITLE HEADER
                // console.log("Rendering IMAGE Header"); // Confirm this block is reached
                return (
                  <>
                    {/* Original Title Area Flex */}
                    <Flex
                      justifyContent="center"
                      direction={headerDirection ?? 'column'}
                      overflow="hidden"
                      position="relative"
                      w={containerWidth ?? 'calc(100vw - 26px)'}
                      mx="auto"
                      borderRadius={4.5}
                      pt={page ? "6rem" : 0 }
                    >
                      <Flex
                        gap={4}
                        direction="column"
                        w={headerInnerFlexWidth ?? '100%'}
                        px={padding ?? 4}
                        pos={"relative"}
                        alignItems={"center"}
                      >
                        {/* TITLE AREA */}
                        <Box>
                          {data.description && ( <Heading mt={2} textAlign="center" size="md">{data.description}</Heading> )}
                          {data.title && ( <Heading textAlign="center" size="xl">{data.title}</Heading> )}
                          {formattedDate && ( <Heading textAlign="center" opacity={0.3} mt={4} size="xs">{formattedDate}</Heading> )}
                          {data.excerpts && ( <Text textAlign="center" mt={4} fontSize={"lg"} fontWeight={300} pb={4}>{data.excerpts}</Text> )}
                        </Box>
                      </Flex>
                    </Flex>

                    {/* Original Image Flex */}
                    {data.image &&
                      <Flex justifyContent="center" mx="auto" w={containerWidth ?? 'calc(100vw - 26px)'}> 
                        <Image
                          src={data.image.fields.file.url.startsWith('//') ? `https:${data.image.fields.file.url}` : data.image.fields.file.url}
                          alt={data.image.fields.title}
                          width="1024"
                          height="1024"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1089px"
                          priority
                          style={{
                            objectFit: "cover",
                            borderRadius: "4.5px",
                            width: "100%",
                            height: "auto",
                            aspectRatio: "16/9",
                            margin: "1rem 0",
                            marginBottom: "2rem",
                          }}
                        />
                      </Flex>
                    }
                  </>
                );
              }
            })()}

            {/* --- MAIN CONTENT SECTION --- */}
             {data.text && (
               <Flex
                  justifyContent="center"
                  direction="column"
                  w={mainContentWidth ?? 'calc(100vw - 26px)'}
                  mx="auto"
               >
                  {documentToReactComponents(data.text, options)}
               </Flex>
            )}

            {/* --- RELATED POSTS --- */}
            {/* {data.related && ... } */}
          </>
        )}

        {/* === TEASER VIEW === */}
        {!page && (
           // ... Keep existing teaser code ...
           <>
            {/* Original Teaser Structure */}
            <Flex
              justifyContent="center"
              direction={teaserDirection ?? 'column'}
              overflow="hidden"
              position="relative"
              w={containerWidth ?? 'calc(100vw - 26px)'}
              mx="auto"
              mb={"2rem"}
              borderRadius={4.5}
            >
              <Flex
                gap={4}
                direction="column"
                w={teaserInnerFlexWidth ?? '100%'}
                px={padding ?? 4}
                maxHeight={"650px"}
                pos={"relative"}
                alignItems={"center"}
              >
                {/* Teaser Title Area */}
                <Box>
                  {data.description && ( <Heading mt={2} textAlign="center" size="md">{data.description}</Heading> )}
                  {data.title && ( <Heading textAlign="center" size="xl">{data.title}</Heading> )}
                  {formattedDate && ( <Heading textAlign="center" opacity={0.3} mt={4} size="xs">{formattedDate}</Heading> )}
                  {data.excerpts && ( <Text textAlign="center" mt={4} fontSize={"lg"} fontWeight={300} pb={4}>{data.excerpts}</Text> )}
                </Box>

                {/* Teaser Read More Button Overlay */}
                <Flex position={"absolute"} alignItems={"flex-end"} justifyContent={"center"} w={"100%"} bottom={0} left={0} height={325} background={gradient}>
                  <Button onClick={() => router.push("/"+data.slug)}>Read more</Button>
                </Flex>
              </Flex>
            </Flex>

            {/* Teaser Image */}
            {data.image &&
              <Flex justifyContent="center" mx="auto" w={containerWidth ?? 'calc(100vw - 26px)'}>
                <Image
                  src={data.image.fields.file.url.startsWith('//') ? `https:${data.image.fields.file.url}` : data.image.fields.file.url}
                  alt={data.image.fields.title}
                  width="1024"
                  height="1024"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1089px"
                  priority
                  style={{
                    objectFit: "cover",
                    borderRadius: "4.5px",
                    width: "100%",
                    height: "auto",
                    aspectRatio: "4/3",
                    margin: "1rem 0",
                    marginBottom: "2rem",
                  }}
                />
              </Flex>
            }
          </>
        )}
      </>
    );
};

export default Article;
