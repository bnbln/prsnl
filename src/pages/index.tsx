import React, { useEffect, useState } from 'react';
import { Box, Flex, Heading, VStack, useBreakpointValue, useColorMode, Text, Button, border } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import Cloud from '../components/Cloud'
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Center, ScrollControls, Plane, Environment, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei'
import  ScrollText from '../components/ScrollText';
import { useControls } from 'leva'

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
    const entry = await client.getEntry<ISection>('IIqZvNg8GBx6XYe2Kg2bO', {
      include: 2,
    });
    
    if (!entry) {
      return {
        notFound: true
      }
    }

    const mappedData = [{
      title: entry.fields.title,
      hero: entry.fields.hero,
      position: entry.fields.position3,
    }];

    return {
      props: {
        data: mappedData,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error('Error fetching entry:', error);
    return {
      notFound: true
    }
  }
}
const Home: React.FC<{ data: ISection[] }> = ({ data }) => {
  // Controls for all three lights
  const { 
    mainLight, 
    mainIntensity,
    fillLight, 
    fillIntensity,
    backLight, 
    backIntensity 
  } = useControls('Lighting', {
    // Main Light
    mainLight: {
      value: [-27,1,7.9],
      //-2.4,11.4,0.3
      // old -2.3, 4.2, -20
      step: 0.1,
      min: -50,
      max: 50,
      joystick: 'invertY'
    },
    mainIntensity: { value: 9, min: 0, max: 200, step: 1 },
    
    // Fill Light
    fillLight: {
      value: [6.3, 3, -5],
      step: 0.1,
      min: -10,
      max: 10,
      joystick: 'invertY'
    },
    fillIntensity: { value: 2.8, min: 0, max: 5, step: 0.1 },
    
    // Back Light
    backLight: {
      value: [0, -5, 0],
      step: 0.1,
      min: -10,
      max: 10,
      joystick: 'invertY'
    },
    backIntensity: { value: 0.2, min: 0, max: 5, step: 0.1 }
  })
  const { colorMode } = useColorMode()

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
          shadows
          dpr={[1, 2]}
          gl={{
            antialias: true,
            preserveDrawingBuffer: true,
            alpha: true,
            stencil: false,
            powerPreference: "high-performance",
          }}
          performance={{ 
            min: 0.5,  // Minimum frame rate before quality reduction
            max: 1,    // Maximum frame rate to maintain
          }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          
          {/* <Environment preset="sunset" backgroundBlurriness={0.5} backgroundIntensity={0.1} /> */}
          <ambientLight intensity={0.01} />
           {/* 3-Point Lighting System */}
          <directionalLight 
            position={mainLight} 
            intensity={mainIntensity} 
            castShadow
          />
          <directionalLight 
            position={fillLight}
            intensity={fillIntensity} 
          />
          <directionalLight 
            position={backLight}
            intensity={backIntensity} 
          />
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
          backgroundColor={colorMode === 'dark' ? "#3362f0" : "#00224d"} 
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