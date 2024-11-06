import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading, VStack, useBreakpointValue, useColorMode, Text, Button, border } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import Cloud from '../components/Cloud'
import Scene from '../components/Scene'
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, ScrollControls } from '@react-three/drei'
import  ScrollText from '../components/ScrollText';
interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position: any[];
}

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN  as string,
  space: process.env.CONTENTFUL_SPACE_ID  as string,
});

export async function getStaticProps() {
  try {
    const entries = await client.getEntries<ISection>({
      content_type: 'home',
      include: 2,
    });
    const mappedData = entries.items.map((item) => ({
      title: item.fields.title,
      hero: item.fields.hero,
      position: item.fields.position3,
    }));

    return {
      props: {
        data: mappedData,
      },
      revalidate: 60, // Optional: Revalidate at most once every minute
    };
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return {
      props: {
        data: [],
      },
    };
  }
}
const Home: React.FC<{ data: ISection[] }> = ({ data }) => {
  return (
    <>
      <Box
        height="65vh"
        width="100%"
        position="relative"
        overflow="hidden"
        mb={12}
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 60 }}
        >
          <ambientLight intensity={1} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          <Center>
            <ScrollText />
          </Center>
          {/* <OrbitControls enableZoom={false} /> */}
        </Canvas>
        <Box 
          position={'absolute'} 
          left={0} 
          top={-10} 
          w={"100%"} 
          h={150} 
          zIndex={-1} 
          backgroundColor={"#3362f0"} 
          transform={"rotate(-3deg)"} 
          filter={"blur(150px)"} 
        />
      </Box>
      <VStack gap={useBreakpointValue({ base: "3rem", xl: "6rem" })} w="100%">
        {data[0] && data[0].position.map((section, index) => (
          <React.Fragment key={index}>
            {section.sys.contentType.sys.id === "sections" &&
              <Row title={section.fields.title} small={section.fields.display} items={section.fields.articles} />
            }
            {section.sys.contentType.sys.id === "module" && <Module data={section} />}
            {section.sys.contentType.sys.id === "article" && <Article page={false} data={section.fields} />}
            {section.sys.contentType.sys.id === "cloud" && 
              <Cloud 
                data={section.fields} 
                buttons={section.fields.buttons}
              />}
          </React.Fragment>
        ))}
      </VStack>
    </>
  );
}

export default Home;