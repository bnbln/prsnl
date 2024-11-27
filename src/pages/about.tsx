import React from 'react';
import { Box, Flex, Heading, VStack, useBreakpointValue, Text, Button } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';
import { sanitizeContentfulData } from '../lib/utils';

// Define types for the data you expect from Contentful
interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position: any[];
}

// Create the Contentful client outside the component to avoid re-creation on re-renders
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.CONTENTFUL_SPACE_ID as string,
});

export async function getStaticProps() {
  try {
    const entries = await client.getEntries<ISection>({
      content_type: 'home',
      include: 2,
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

const About: React.FC<{ data: ISection[] }> = ({ data }) => {
  return (
    <>
      <Box
        height="75vh"
        width="100%"
        position="relative"
        overflow="hidden"
        pt={"2rem"}
        color="white"
      >
      </Box>
    </>
  );
}

export default About;
