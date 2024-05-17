import React from 'react';
import { Box, Flex, Heading, VStack, useBreakpointValue, Text, Button } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import { createClient } from 'contentful';

// Define types for the data you expect from Contentful
interface ISection {
  title: string;
  hero: any;
  position: any[];
}

// Create the Contentful client outside the component to avoid re-creation on re-renders
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN,
  space: process.env.CONTENTFUL_SPACE_ID,
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

const About: React.FC<{ data: ISection[] }> = ({ data }) => {
  return (
    <>
      <Box
        height="75vh"
        width="100%"
        position="relative"
        overflow="hidden"
        pt={45}
        color="white"
      >
      </Box>
    </>
  );
}

export default About;
