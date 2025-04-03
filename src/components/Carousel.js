import React, { useRef } from "react";
import Slider from "react-slick";
import { Box, IconButton, Image } from "@chakra-ui/react";
import { useColorMode, useBreakpointValue } from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Custom arrow components
const PrevArrow = ({ onClick }) => (
  <IconButton
    aria-label="Previous Slide"
    icon={<ChevronLeftIcon />}
    onClick={onClick}
    position="absolute"
    top="50%"
    left="0"
    transform="translateY(-50%)"
    zIndex="2"
    variant="ghost"
  />
);

const NextArrow = ({ onClick }) => (
  <IconButton
    aria-label="Next Slide"
    icon={<ChevronRightIcon />}
    onClick={onClick}
    position="absolute"
    top="50%"
    right="0"
    transform="translateY(-50%)"
    zIndex="2"
    variant="ghost"
  />
);

const Carousel = ({ media, interval = 5000 }) => {
  const { colorMode } = useColorMode();
  const sliderRef = useRef(null);
  const slidesToShow = useBreakpointValue({ base: 1, sm: 2, md: 3, lg: 4, xl: 5 });

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    swipe: true,
    swipeToSlide: true,
    draggable: true,
    touchMove: true,
    // Use react-slick's built-in autoplay
    autoplay: true,
    autoplaySpeed: interval,
    // Provide custom arrows instead of placing them in appendDots
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    // Add onSwipe callback for debugging
    onSwipe: (direction) => {
      console.log(`Swipe detected: ${direction}`);
    },
  };

  return (
    <Box position="relative" width="full" mb={24} mt={16}>
      <Slider {...settings} ref={sliderRef}>
        {media.map((item, index) => (
          <Box key={index} px={2} overflow="visible">
            <Image
              src={`https:${item.fields.file.url}`}
              alt={item.fields.title}
            />
          </Box>
        ))}
      </Slider>
    </Box>
  );
};

export default Carousel;