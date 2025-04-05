import { Box, Heading, Text, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import Image from 'next/image';
import { motion } from 'framer-motion';

// Create motion components
const MotionHeading = motion.create(Heading as any);
const MotionBox = motion.create(Box as any);
const MotionText = motion.create(Text as any);


type ImageProps = {
    image: {
        fields: {
            file: {
                url: string;
            }
        }
    };
    title: string;
}
function ImageWrapper({image, title}: ImageProps) {
    return (
    <Image
    src={`https:${image.fields.file.url}`}
    alt={title}
    fill
    sizes="(max-width: 768px) 100vw, 
             (max-width: 1200px) 50vw, 
             33vw"
    style={{ 
      objectFit: "cover",
      borderRadius: "4.5px"
    }}
  />)
}
type TileProps = {
    style?: React.CSSProperties;
    fields: {
        title: string | 'Title';
        description?: string | null;
        size?: string | 'portrait'; //portrait, landscape, s-square, square, wide, video
        image?: any;
        imageLandscape?: any;
        color?: string | 'black';
        slug: string;
        video?: {
            fields?: {
                file?: {
                    url?: string;
                }
            }
        } | null;
    },
    height?: string;
    overlay?: boolean;
  }
  
export default function Tile({fields, style, overlay}: TileProps) {
    const aspectRatio = fields.size === 'Landscape' ? '4/3' :
                        fields.size === 'Small' ? '1/1' :
                        fields.size === 'Square' ? '1/1' :
                        fields.size === 'Wide' ? '16/9' :
                        fields.size === 'Video' ? '16/9' :
                        '3/4';
    return (
        <Box 
        style={style}
        sx={{
        '&:first-child': {
          marginLeft: useBreakpointValue({ base: 4, xl: 'calc( var(--gutter-size) + 12px)' }),
        },
        '&:last-child': {
          marginRight: useBreakpointValue({ base: 4, xl: 'calc(var(--gutter-size) - 12px)' }),
        }
      }}
      >
<Link href={fields.slug} className='tile'>

    <MotionBox 
    height={{base: '364px', md: fields.size === "Small" ? '364px' : "462px"}}
    width={fields.size === "Wide" ? "100%" : "auto"}
    aspectRatio={aspectRatio} 
    backgroundColor={fields.color}
    color="white"
    p={18}
    borderRadius={4}
    position="relative"
    display="flex" 
    flexDirection="column" 
    flexWrap="wrap"
    gap={4}
    justifyContent="space-between"
    overflow="hidden"
    whileHover="hover"
    initial="initial"
    variants={{
        initial: {},
        hover: {}
    }}
    >   
        
            <MotionBox  
            position="absolute" 
            zIndex={0}
            top={0} 
            left={0} 
            right={0} 
            bottom={0} 
            overflow="hidden"
            w="100%" 
            h="100%"
            variants={{
                initial: { opacity: overlay ? 0.5 : 1, scale: 1.05 },
                hover: { opacity: 0.5, scale: 1 }
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}

            >   
                        {/* console.log("TADA", aspectRatio === '3/4', aspectRatio); */}

            {
                fields.image?.fields ?
                    aspectRatio === '3/4' || aspectRatio === '1/1' ?
                    <ImageWrapper image={fields.image} title={fields.title} />
                    : fields.imageLandscape?.fields ?<ImageWrapper image={fields.imageLandscape} title={fields.title} />
                    : <ImageWrapper image={fields.image} title={fields.title} />
                : fields.imageLandscape?.fields ?
                    <ImageWrapper image={fields.imageLandscape} title={fields.title} />
                : null
            }
                {/* {(fields.size === 'Landscape' || fields.size === 'Wide' || fields.size === 'Video') ?
                 <ImageWrapper image={fields.imageLandscape ? fields.imageLandscape : fields.image} title={fields.title} />
                :
                 <ImageWrapper image={fields.image ? fields.image : fields.imageLandscape} title={fields.title} />} */}

                 { fields.video?.fields?.file?.url &&
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                >
                    <source src={`https:${fields.video.fields.file.url}`} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
                }
            </MotionBox> 
        <MotionText 
            zIndex={10}
            fontWeight={400} 
            fontSize="14px"
            variants={{
                initial: { y: -40 },
                hover: { y: 0 }
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        >{fields.description}</MotionText>
        <Box zIndex={10} maxW="328px" gap={1} display="flex" flexDirection="column">
            <MotionHeading 
                fontWeight={700} 
                fontSize="18px"

                variants={{
                    initial: { y: 26 },
                    hover: { y: 0 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {fields.title}
            </MotionHeading>
            <MotionBox display="flex" gap={1} 
                variants={{
                    initial: { y: 40 },
                    hover: { y: 0 }
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                >
                <Text fontWeight={400} fontSize="14px">Read</Text>
                <MotionText fontWeight={400} fontSize="14px">More</MotionText>
            </MotionBox>
        </Box>
    </MotionBox>
   
    </Link>
    </Box>
    )
}