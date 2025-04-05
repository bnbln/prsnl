import React from 'react';
import { Box, Flex, VStack, useBreakpointValue, useColorMode, Heading, Text , Link  } from '@chakra-ui/react';
import Row from '../components/Row'
import Module from '../components/Module'
import Article from '../components/Article'
import Cloud from '../components/Cloud'
import { createClient, EntrySkeletonType, EntryFields } from 'contentful';
import Image from 'next/image';
import { getMenuData } from '../hooks/useMenuData';
import { sanitizeContentfulData } from '../lib/utils';

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
      revalidate: 60,
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

const Development: React.FC<{ data: ISection[] }> = ({ data }) => {
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
              Development
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

export default Development;