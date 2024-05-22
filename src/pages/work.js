import React from 'react';
import { Box, Flex, Heading, Text, useBreakpointValue, Link } from '@chakra-ui/react';
import Image from 'next/image';

export default function Work(data) {
  const flexDirection = useBreakpointValue({ base: 'column', md: 'row' }) || 'column';
  const containerWidth = useBreakpointValue({ base: 'calc(100vw - 26px)', xl: '1089px' });
  const contentWidth = useBreakpointValue({ base: '100%', md: '80%' });
  const textWidth = useBreakpointValue({ base: '100%', md: '500px' });
  const padding = useBreakpointValue({ base: 4, sm: 12, xl: 20 });

    return (
      <Flex
      justifyContent="center"
      direction={flexDirection}
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
          {data.description && (
            <Heading mt={2} textAlign="center" size="md">
              {data.description}
            </Heading>
          )}
            <Heading textAlign="center" size="xl">
              Work
            </Heading>
          {data.published && (
            <Heading textAlign="center" opacity={0.3} mt={4} size="xs">
              {formattedDate}
            </Heading>
          )}
            <Text>
             
            </Text>
        </Box>
        {data.image &&
          <Image
            src={`https:${data.image.fields.file.url}`}
            alt={data.image.fields.title}
            width="900"
            height="500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            style={{
              objectFit: "cover",
              borderRadius: "4.5px",
              position: "relative",
              width: "100%"
            }}
          />
        }
        </Flex>
        </Flex>

    )
  }