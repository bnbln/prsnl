import React from 'react';
import { Box, Heading, HStack, useBreakpointValue, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Tile from './Tile';

interface Fields {
  color?: string;
  title: string;
  description?: string; // Changed 'desc' to 'description' to match your usage
  video?: string;
  image?: string;
  slug?: any; // Added slug as it's being used in Tile props
}

interface Item {
  fields: Fields;
}

interface RowProps {
  title?: string;
  small?: boolean;
  items: Item[];
}

const Row: React.FC<RowProps> = ({ title, small, items = [] }) => {
  const gutterSize = useBreakpointValue({ base: 0, xl: 'var(--gutter-size)' });
  const containerWidth = useBreakpointValue({ base: '100%', xl: '100vw' });
  const containerMarginLeft = useBreakpointValue({ base: 0, xl: 'calc(-1*var(--gutter-size))' });

  return (
    <Box w="100%">
      <Box maxW="68rem" mx="auto" px={4}>
        <HStack mb={8} w="100%" justifyContent="space-between">
          {title && <Heading fontSize="1.685625rem">{title}</Heading>}
          <HStack spacing={2}>
            <IconButton aria-label="Scroll left" icon={<ChevronLeftIcon />} />
            <IconButton aria-label="Scroll right" icon={<ChevronRightIcon />} />
          </HStack>
        </HStack>
      </Box>

      <Box maxW="68rem" mx="auto">
        <Box
          w={containerWidth}
          ml={containerMarginLeft}
          overflowX="auto"
          overflowY="hidden"
          display="flex"
          gap={3}
          scrollSnapType="x mandatory"
          sx={{
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch',
            scrollPaddingLeft: gutterSize,
            scrollPaddingRight: gutterSize,
          }}
        >
          {items.map((item, i) => (
            <Tile
              key={`rowItem-${i}`}
              small={small}
              color={item.fields.color}
              title={item.fields.title}
              desc={item.fields.description}
              image={item.fields.image}
              video={item.fields.video}
              slug={item.fields.slug}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Row;
