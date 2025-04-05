import React, { useEffect, useState, useRef } from 'react';
import { Box, Flex, Heading, VStack, useBreakpointValue, useColorMode, Text, Button, border } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import ModuleHero from '../components/ModuleHero'
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
import { GetStaticProps } from 'next';

interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position3: any[];
}

const getContentfulClient = () => {
  const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;
  const space = process.env.CONTENTFUL_SPACE_ID;
  const nodeEnv = process.env.NODE_ENV;
  const targetEnv = nodeEnv === 'development' ? 'beta' : 'master';

  // --- ADD LOGS ---
  console.log(`[getContentfulClient] NODE_ENV: ${nodeEnv}`);
  console.log(`[getContentfulClient] Target Environment: ${targetEnv}`);
  console.log(`[getContentfulClient] Space ID: ${space}`);
  console.log(`[getContentfulClient] Access Token (first 5 chars): ${accessToken?.substring(0, 5)}...`);
  // --- END LOGS ---

  if (!accessToken || !space) {
    console.error("[getContentfulClient] ERROR: Contentful Access Token or Space ID is missing!");
    // You might want to throw an error or return a dummy client here
    // depending on how you want to handle missing env vars.
    // For now, let it proceed to potentially fail in createClient.
  }

  try {
    console.log(`[getContentfulClient] Attempting to create client for environment: ${targetEnv}`);
    return createClient({
      accessToken: accessToken as string,
      space: space as string,
      environment: targetEnv
    });
  } catch (error) {
    // This catch block might not catch environment resolution issues in createClient itself,
    // but good to keep for other potential init errors.
    console.warn('[getContentfulClient] Caught error during initial client creation attempt, falling back to master (if possible). Error:', error);
    // Fallback logic (though if the primary attempt fails with correct vars, this might too)
    try {
       console.log('[getContentfulClient] Attempting fallback to master environment');
       return createClient({
         accessToken: accessToken as string,
         space: space as string,
         environment: 'master'
       });
    } catch (fallbackError) {
       console.error('[getContentfulClient] ERROR: Fallback client creation failed!', fallbackError);
       // Handle fatal error - maybe throw?
       throw new Error("Failed to create Contentful client.");
    }
  }
};

const client = getContentfulClient();

// Helper function to recursively convert undefined to null
function convertUndefinedToNull(obj: any): any {
  if (obj === undefined) {
    return null;
  }
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => convertUndefinedToNull(item));
  }

  // Must be an object
  const newObj: { [key: string]: any } = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      newObj[key] = convertUndefinedToNull(obj[key]);
    }
  }
  return newObj;
}

// --- TEMPORARY MINIMAL getStaticProps ---
export const getStaticProps: GetStaticProps = async (context) => {
  const locale = context.locale;

  // --- Log environment variables directly ---
  console.log("[getStaticProps] Directly checking process.env:");
  console.log(`[getStaticProps] CONTENTFUL_SPACE_ID: ${process.env.CONTENTFUL_SPACE_ID}`);
  console.log(`[getStaticProps] CONTENTFUL_ACCESS_TOKEN (exists?): ${!!process.env.CONTENTFUL_ACCESS_TOKEN}`);
  // --- End Log ---

  if (!locale) {
    console.error("[getStaticProps] Locale is undefined.");
    return { notFound: true };
  }

  try {
    console.log(`[getStaticProps] Fetching entry 'IIqZvNg8GBx6XYe2Kg2bO' for locale: ${locale}`); // Restore locale logging

    const entry = await client.getEntry<ISection>('IIqZvNg8GBx6XYe2Kg2bO', {
      include: 2,
      locale: locale, // <--- RESTORE: Add locale back
    });

    console.log("[getStaticProps] RAW ENTRY FROM CONTENTFUL:", JSON.stringify(entry, null, 2));

    if (!entry || !entry.fields) {
      console.warn(`[getStaticProps] Entry IIqZvNg8GBx6XYe2Kg2bO not found or has no fields (locale: ${locale})`);
      return { notFound: true };
    }

    const mappedData = [{
      title: entry.fields.title,
      hero: entry.fields.hero,
      position3: entry.fields.position3, // <--- CHANGE: Use position3
    }];
    console.log("[getStaticProps] Raw mappedData (before sanitize):", JSON.stringify(mappedData, null, 2));

    // --- Ensure sanitizeContentfulData handles position3 ---
    // You might need to update sanitizeContentfulData if it specifically looks for 'position'
    const sanitizedData = sanitizeContentfulData(mappedData);
    console.log("[getStaticProps] Sanitized Data:", JSON.stringify(sanitizedData, null, 2));

    const serializableData = convertUndefinedToNull(sanitizedData);
    console.log("[getStaticProps] Serializable Data:", JSON.stringify(serializableData, null, 2));

    return {
      props: {
        data: serializableData,
      },
      revalidate: 60,
    };
  } catch (error) {
    console.error(`[getStaticProps] Error fetching entry IIqZvNg8GBx6XYe2Kg2bO for locale "${locale}":`, error);
    return {
      notFound: true
    }
  }
}
// --- END TEMPORARY ---

const Home: React.FC<{ data: ISection[] | null }> = ({ data }) => {
  // --- MOVED HOOKS HERE ---
  const { colorMode } = useColorMode()
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const gapSize = useBreakpointValue({ base: "3rem", xl: "6rem" });
  const controls = useControls('Lighting', {
    backLight: {
      value: [0, -5, 0],
      step: 0.1,
      min: -10,
      max: 10,
      joystick: 'invertY'
    },
    backIntensity: { value: 0.2, min: 0, max: 5, step: 0.1 }
  })
  // --- END MOVED HOOKS ---

  // Adjust the check to handle null data gracefully AND check position3
  if (!data || data.length === 0 || !data[0] || !data[0].position3) {
     console.warn("Index page received no valid data (or position3) to render.");
     return <Box>No content available.</Box>;
  }

  return (
    <>
      <VStack zIndex={10} gap={gapSize} w="100%" background="black">
         {/* CHANGE: Map over data[0].position3 */}
         {data[0].position3.map((section, index) => (
           <div key={section?.sys?.id || index} style={{position: "relative", zIndex: 10, width: "100%"}}>
             {section?.sys?.contentType?.sys?.id === "sections" && section.fields &&
               <Row title={section.fields.title} small={section.fields.display} items={section.fields.articles} />
             }
             {section?.sys?.contentType?.sys?.id === "module" && <Module data={section} />}
             {section?.sys?.contentType?.sys?.id === "moduleHero" && <ModuleHero data={section} />}
             {section?.sys?.contentType?.sys?.id === "cluster" && <Cluster data={section} />}
             {section?.sys?.contentType?.sys?.id === "article" && section.fields && <Article page={false} data={section.fields} />}
             {section?.sys?.contentType?.sys?.id === "cloud" && section.fields &&
               <Cloud
                 data={section.fields}
                 buttons={section.fields.buttons}
               />}
           </div>
         ))}
         <Corners />
       </VStack>
    </>
  );
}

export default Home;