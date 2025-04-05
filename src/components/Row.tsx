import React, { useRef, useCallback, useEffect, useState } from 'react';
import { Box, Heading, HStack, useBreakpointValue, IconButton } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Tile from './Tile';

interface Fields {
  title: string;
  slug: string;
  published: Date;
  description?: string | null;

  size?: string | 'portrait'; //portrait, landscape, s-square, square, wide, video
  
  image?: any;
  imageLandscape?: any;
  color?: string;
  video?: {
      fields?: {
          file?: {
              url?: string;
          }
      }
  } | null;
  videoHeader?: {
      fields?: {  
          file?: {
              url?: string;
          }
      }
  } | null;
  excerpts?: string | null;
  text?: string | null;
  related?: any;


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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  
  const gutterSize = useBreakpointValue({ base: 0, xl: 'var(--gutter-size)' });
  const containerWidth = useBreakpointValue({ base: '100%', xl: '100vw' });
  const containerMarginLeft = useBreakpointValue({ base: 0, xl: 'calc(-1*var(--gutter-size))' });
  const containerMaxWidth = useBreakpointValue({ base: '100%', xl: '68rem' });

  // Calculate tile width based on aspect ratio and fixed height
  const getTileWidth = useCallback(() => {
    const tileHeight = 471.55; // 29.471875rem in pixels
    const aspectRatio = small ? 3/4 : 4/3;
    return tileHeight * aspectRatio;
  }, [small]);

  // Check scroll possibilities
  const checkScrollability = useCallback(() => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const hasScrolledLeft = container.scrollLeft > 0;
    const hasMoreRight = container.scrollLeft < (container.scrollWidth - container.clientWidth);

    setCanScrollLeft(hasScrolledLeft);
    setCanScrollRight(hasMoreRight);
  }, []);

  // Add scroll event listener
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Check initial scroll state
    checkScrollability();

    // Add scroll event listener
    container.addEventListener('scroll', checkScrollability);
    window.addEventListener('resize', checkScrollability);

    return () => {
      container.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability]);

  // Function to scroll by one tile
  const scrollByTile = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const tileWidth = getTileWidth();
    const gap = 12; // 3rem in pixels
    const scrollAmount = tileWidth + gap;

    // Calculate the target scroll position
    const targetScroll = direction === 'left' 
      ? container.scrollLeft - scrollAmount
      : container.scrollLeft + scrollAmount;

    // Ensure we scroll to a multiple of tile width + gap
    const normalizedScroll = Math.round(targetScroll / scrollAmount) * scrollAmount;

    container.scrollTo({
      left: normalizedScroll,
      behavior: 'smooth'
    });
  }, [getTileWidth]);

  // Commenting out console.log statement
  // console.log("items", items);
  return (
    <Box w="100%" zIndex={10}>
      <Box maxW={containerMaxWidth} mx="auto" px={4}>
        <HStack mb={4} w="100%" justifyContent="space-between">
          {title && <Heading fontSize="1.685625rem">{title}</Heading>}
          <HStack spacing={2}>
            <IconButton 
              aria-label="Scroll left" 
              icon={<ChevronLeftIcon />} 
              onClick={() => scrollByTile('left')}
              isDisabled={!canScrollLeft}
            />
            <IconButton 
              aria-label="Scroll right" 
              icon={<ChevronRightIcon />} 
              onClick={() => scrollByTile('right')}
              isDisabled={!canScrollRight}
            />
          </HStack>
        </HStack>
      </Box>

      <Box maxW={containerMaxWidth} mx="auto">
        <Box
          ref={scrollContainerRef}
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
            '::-webkit-scrollbar': {
              display: 'none',
            },
          }}
        >
          {items.map((item, i) => {
            if (!item?.fields) {
              return null;
            }

            return (
              <Tile
                key={`rowItem-${i}`}
                fields={item.fields}
                />
            );
          })}
        </Box>
      </Box>
    </Box>
  );
};

export default Row;
