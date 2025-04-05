import React, { useEffect, useRef, useState } from "react";
import { Box, Flex, Heading, Text, useBreakpointValue, Show } from "@chakra-ui/react";
import { motion, useScroll, useTransform, useViewportScroll } from 'framer-motion';
import Tile from "./Tile";
// Create motion components
const MotionHeading = motion(Heading as any);
const MotionBox = motion(Box as any);
const MotionText = motion(Text as any);

interface ParallaxDivProps {
  speed?: number; // How fast the element moves relative to the scroll
  children: React.ReactNode;
  style?: React.CSSProperties;
  marginBottom?: number | 0;
}

const ParallaxDiv: React.FC<ParallaxDivProps> = ({ speed = 0, children, style, marginBottom }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  const [startScroll, setStartScroll] = useState<number | null>(null);
  const [endScroll, setEndScroll] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = ref.current;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && element) {
          const rect = entry.boundingClientRect;
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

          // When the element enters the viewport
          const start = rect.top + scrollTop - window.innerHeight;
          const end = start + rect.height + window.innerHeight;
          const height = rect.height;

          setStartScroll(start);
          setEndScroll(end - speed); // Adjust for parallax offset
          setHeight(height);
        }
      },
      { threshold: 0 } // Trigger when 10% of the element is visible
    );

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [speed]);

  // Map scrollY to animation range only when startScroll and endScroll are set
  const y = useTransform(
    scrollY,
    [startScroll ?? 0, endScroll ?? 0],
    [0, -speed],
    { clamp: false }
  );

  return (
    <motion.div ref={ref} style={{ y, willChange: "transform", ...style }}>
      {children}
    </motion.div>
  );
};



interface ClusterProps {
  title?: string;
  data: {
    fields: any;
  };
}

export default function Cluster({ data }: ClusterProps) {
  // console.log(data.fields.articles[0]);  
  const size3 = useBreakpointValue({ base: "Small", xl: "Square" });

  return (
    <>
    <Flex  
    justifyContent="center"
        direction={'column'}
        position="relative"
        w={useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' })}
        mx="auto"  
        gap={{base: 8, md: 16}}>
        <Box w="100%" maxW="400px" gap={4} display="flex" flexDirection="column" mx={{base: "auto", sm: 100}} >
            <Heading>{data.fields.title}</Heading>
            <Text>{data.fields.description}</Text>
        </Box>
        <Box position="relative" w="100%" >
          { data.fields.articles[0] &&
              <Tile 
                style={{
                    margin: 0,
                    zIndex: 100   
                }}
                overlay={true}
                fields={{
                    title: data.fields.articles[0].fields.title, 
                    description: data.fields.articles[0].fields.description, 
                    size: "Wide", 
                    color:  "#0052B0", 
                    slug: data.fields.articles[0].fields.slug,
                    image: data.fields.articles[0].fields.image,
                    imageLandscape: data.fields.articles[0].fields.imageLandscape,
                    video: data.fields.articles[0].fields.video
                }}
              />
            }
            <Show above="md">
              { data.fields.articles[1] &&
              <ParallaxDiv speed={150} style={{position: "absolute", zIndex: 10, left: 420, bottom: -20 }}>
                  <Tile 
                    overlay={true}
                    style={{
                        margin: 0,
                        boxShadow: "0px 4px 114px 0px rgba(0, 0, 0, 0.25)"
                    }}
                    fields={{
                        title: data.fields.articles[1].fields.title, 
                        description: data.fields.articles[1].fields.description, 
                        size: "Small", 
                        color: "#A0A91B", 
                        slug: data.fields.articles[1].fields.slug,
                        image: data.fields.articles[1].fields.image,
                        imageLandscape: data.fields.articles[1].fields.imageLandscape,
                        video: data.fields.articles[1].fields.video
                    }}
                  />
              </ParallaxDiv>
            }
            <Show above="lg">
            { data.fields.articles[2] &&
            <ParallaxDiv speed={250} style={{position: "absolute", zIndex: 20, right: 30, bottom: 20  }}>
                  <Tile 
                    overlay={true}
                    style={{
                        margin: 0,
                        boxShadow: "0px 4px 114px 0px rgba(0, 0, 0, 0.25)"
                    }}
                    fields={{
                        title: data.fields.articles[2].fields.title, 
                        description: data.fields.articles[2].fields.description, 
                        size: size3, 
                        color: "#6807A8", 
                        slug: data.fields.articles[2].fields.slug,
                        image: data.fields.articles[2].fields.image,
                        imageLandscape: data.fields.articles[2].fields.imageLandscape,
                        video: data.fields.articles[2].fields.video
                    }}
                  />
              </ParallaxDiv>
            }
            </Show>
            </Show>
        </Box>
    </Flex>
    </>
  
);
}