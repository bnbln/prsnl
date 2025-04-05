import React from 'react';
import { Box, Flex, VStack, useBreakpointValue, useColorMode, Heading, Text , Link  } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import Cloud from '../components/Cloud'
import { createClient, EntrySkeletonType, EntryFields } from 'contentful';
import Image from 'next/image';
import { sanitizeContentfulData } from '../lib/utils';
import { getMenuData } from '../hooks/useMenuData';

interface ISection extends EntrySkeletonType {
  title: EntryFields.Text;
  hero: any;
  position3: any[];
}

const client = createClient({
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
  space: process.env.CONTENTFUL_SPACE_ID as string,
});

export async function getStaticProps() {
  try {
    // Fetch menu data
    const menuData = await getMenuData();

    const entry = await client.getEntry<ISection>('1RqjizB0Ykmd0HzroR1aag', {
      include: 2,
    });
    
    if (!entry) {
      return {
        notFound: true
      }
    }

    const mappedData = [{
      title: entry.fields.title || null,
      hero: entry.fields.hero || null,
      position3: Array.isArray(entry.fields.position3) ? entry.fields.position3.map(pos => pos || null) : null
    }];

    return {
      props: {
        data: sanitizeContentfulData(mappedData),
        navData: menuData,
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

const Design: React.FC<{ data: ISection[] }> = ({ data }) => {
  const { colorMode } = useColorMode()
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' }) || 'column';
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const contentWidth = useBreakpointValue({ base: '100%', md: '80%' });
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });

  if (!data || !data[0] || !data[0].position3) {
    return <Box>No content available.</Box>;
  }

  return (
    <>
      <Flex
        justifyContent="center"
        overflow="hidden"
        position="relative"
        w={containerWidth}
        mx="auto"
        borderRadius={4.5}
      >
        <Flex
          gap={4}
          direction="column"
          w={contentWidth}
          p={padding}
        >
          <Box>
            <Heading textAlign="center" size="xl">
              Design
            </Heading>
          </Box>
        </Flex>
      </Flex>
      <VStack gap={useBreakpointValue({ base: "3rem", xl: "6rem" })} w="100%">
        {data[0].position3.map((section, index) => (
          <React.Fragment key={section?.sys?.id || index}>
            {section?.sys?.contentType?.sys?.id === "sections" && section.fields &&
              <Row title={section.fields.title} small={section.fields.display} items={section.fields.articles} />
            }
            {section?.sys?.contentType?.sys?.id === "module" && <Module data={section} />}
            {section?.sys?.contentType?.sys?.id === "article" && section.fields && <Article page={false} data={section.fields} />}
            {section?.sys?.contentType?.sys?.id === "cloud" && section.fields &&
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

export default Design;