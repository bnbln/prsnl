import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import { Box, IconButton, Image, Stack, Text } from "@chakra-ui/react";
import { useColorMode } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = ({ media, interval = 5000 }) => {
    const { colorMode, toggleColorMode } = useColorMode();
    const sliderRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 2,
        slidesToScroll: 1,
        swipeToSlide: true,
        appendDots: (dots) => (
            <Box display="flex" justifyContent="center" alignItems="center" style={{ display: "flex!important", position: "relative" }}>
                <IconButton
                    aria-label="Previous Slide"
                    icon={<ChevronLeftIcon />}
                    onClick={() => {
                        setElapsedTime(0);
                        sliderRef.current?.slickPrev();
                    }}
                    mr={2}
                />
                <Box display="flex">{dots}</Box>
                <IconButton
                    aria-label="Next Slide"
                    icon={<ChevronRightIcon />}
                    onClick={() => {
                        setElapsedTime(0);
                        sliderRef.current?.slickNext();
                    }}
                    ml={2}
                />
                {/* <IconButton
          aria-label={isPlaying ? "Pause" : "Play"}
          icon={isPlaying ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          onClick={togglePlayPause}
          ml={2}
        /> */}
            </Box>
        ),
        customPaging: (i) => (
            <Box
                as="button"
                width="10px"
                height="10px"
                bg={colorMode === 'dark' ? 'white' : '#080808'}
                borderRadius="50%"
                mx="2px"
            />
        ),
    };

    useEffect(() => {
        if (isPlaying) {
            const id = setInterval(() => {
                sliderRef.current?.slickNext();
            }, interval);
            setIntervalId(id);
        }
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isPlaying, interval]);

    useEffect(() => {
        let timeoutId = null;
        if (isPlaying) {
            timeoutId = setTimeout(() => {
                setElapsedTime((prev) => (prev + 1) % (interval / 1000));
            }, 1000);
        }
        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [elapsedTime, isPlaying, interval]);

    const togglePlayPause = () => {
        if (isPlaying && intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <Box position="relative" width="full" overflow="visible" mb={24} mt={16}>
            <Slider {...settings} ref={sliderRef}>
                {media.map((item, index) => (
                    <Box key={index} px={2} overflow="visible">
                        <Image src={`https:${item.fields.file.url}`} alt={item.fields.title} />
                    </Box>
                ))}
            </Slider>
            <Box bottom="20px" left="50%" transform="translateX(-50%)">
                {/* <Text>{`Elapsed Time: ${(elapsedTime / (interval / 1000)) * 100}%`}</Text> */}
            </Box>
        </Box>
    );
};

export default Carousel;
