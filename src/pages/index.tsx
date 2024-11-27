import React, { useEffect, useState, useRef } from 'react';
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
import { useSpring } from '@react-spring/three'
import { sanitizeContentfulData } from '../lib/utils';
import { Example } from '../components/example';
import Cluster from '../components/Cluster';
import MyCanvas from "../components/Canvas"
import { Corners } from '../components/Corners';

interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position: any[];
}

const getContentfulClient = () => {
  try {
    return createClient({
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: process.env.NODE_ENV === 'development' ? 'beta' : 'master'
    });
  } catch (error) {
    console.warn('Falling back to master environment');
    return createClient({
      accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
      space: process.env.CONTENTFUL_SPACE_ID as string,
      environment: 'master'
    });
  }
};

const client = getContentfulClient();

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
        data: sanitizeContentfulData(mappedData),
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
  console.log("data", data)
  // Controls for all three lights
  const { 
    backLight, 
    backIntensity 
  } = useControls('Lighting', {
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
      <Corners />
      <VStack zIndex={10} gap={useBreakpointValue({ base: "3rem", xl: "6rem" })} w="100%" mt={"-39vh"}>
        {data[0] && data[0].position.map((section, index) => (
          <React.Fragment key={index}>
            {section.sys.contentType.sys.id === "sections" &&
              <Row title={section.fields.title} small={section.fields.display} items={section.fields.articles} />
            }
            {section.sys.contentType.sys.id === "module" && <Module data={section} />}
            {section.sys.contentType.sys.id === "cluster" && <Cluster data={section} />}
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