import React from 'react';
import dynamic from 'next/dynamic';
import { Box, Flex, Heading, VStack, useBreakpointValue, Text, Button } from '@chakra-ui/react';
import Row from '../../components/Row'
import Module from '../../components/Module'
import Article from '../../components/Article'
//import Scene from '../app/Spline'
import Scene from '../../components/Scene'
import { sanitizeContentfulData } from '../../lib/utils';

import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';


//onst Scene = dynamic(() => import('../components/Scene'), { ssr: false });


// Define types for the data you expect from Contentful
interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position: any[];
}


// Create the Contentful client outside the component to avoid re-creation on re-renders
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN  as string,
  space: process.env.CONTENTFUL_SPACE_ID  as string,
});


export async function getStaticProps() {
  try {
    const entries = await client.getEntries<ISection>({
      content_type: 'home',
      include: 2,
      // locale: 'de-DE'
    });
    if (!entries) {
      return {
        notFound: true
      }
    }
    const mappedData = entries.items.map((item) => ({
      title: item.fields.title,
      hero: item.fields.hero || null,
      position: item.fields.position3 || null,
    }));

    return {
      props: {
        data: sanitizeContentfulData(mappedData),
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
    // console.log('Contentful Access Tokensss:', process.env.CONTENTFUL_ACCESS_TOKEN);
    // console.log('Contentful Space ID:', process.env.CONTENTFUL_SPACE_ID);
    //console.log(data);
    
  return (
    <>
      <Box
        height="65vh"
        width="100%"
        position="relative"
        overflow="hidden"
        //pt={45}
        mb={12}
      >
        {/* <Scene /> */}
        <Box position={'absolute'} left={0} top={-10} w={"100%"} h={150} zIndex={-1} backgroundColor={"#3362f0"} transform={"rotate(-3deg)"} filter={"blur(150px)"} />
        {/* <video src="./Hero.mp4" playsInline autoPlay muted className="heroVideo" /> */}
      </Box>
      <VStack gap={useBreakpointValue({ base: "3rem", xl: "6rem" })} w="100%">
        {data[0] && data[0].position.map((section, index) => (
          <React.Fragment key={index}>
            {section.sys.contentType.sys.id === "sections" && 
              <Row title={section.fields.title} small={section.fields.display} items={section.fields.articles} />
            }
            {section.sys.contentType.sys.id === "module" && <Module data={section} />}
            {section.sys.contentType.sys.id === "article" && <Article page={false} data={section.fields} />}
          </React.Fragment>
        ))}
      </VStack>
    </>
  );
}

export default Home;
