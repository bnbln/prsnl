import React from 'react';
import { Box, Flex, Heading, VStack, useBreakpointValue, Text, Button } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';
import { sanitizeContentfulData } from '../lib/utils';
import { getMenuData } from '../hooks/useMenuData';

// Define types for the data you expect from Contentful
interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position3: any[];
}

// Create the Contentful client outside the component to avoid re-creation on re-renders
const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.CONTENTFUL_SPACE_ID as string,
});

export async function getStaticProps() {
  try {
    // Fetch menu data
    const menuData = await getMenuData();

    // Fetch page content
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
      title: item.fields.title || null,
      hero: item.fields.hero || null,
      position3: Array.isArray(item.fields.position3) ? item.fields.position3.map(pos => pos || null) : null
    }));

    return {
      props: {
        data: sanitizeContentfulData(mappedData),
        navData: menuData,
      },
      revalidate: 60, // Optional: Revalidate at most once every minute
    };
  } catch (error) {
    console.error("Error fetching data from Contentful:", error);
    return {
      props: {
        data: [],
        navData: null,
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
