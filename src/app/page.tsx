'use client'
import React from 'react'
import { Box, VStack } from '@chakra-ui/react'
import Row from './components/Row'
import { data } from './data'


export default function Home() {
  return (
    <>
    <Box 
      height="75vh"       // Ensures the Box is always 65vh tall
      width="100%"        // Box takes the full width of its container
      position="relative" // Positions the Box relatively to allow absolute positioning inside it
      overflow="hidden"   // Hides any overflow, cutting off the sides of the video if necessary
      pt={45}             // Padding top of 45 pixels
      color="white"
    >
      <video src="./Hero.mp4" playsInline autoPlay muted style={{
          position: 'absolute',   // Absolute position to center it
          top: '50%',             // Aligns the middle of the video with the middle of the Box
          left: '50%',            // Centers the video horizontally
          transform: 'translate(-50%, -50%)', // Shifts the video to truly center it
          height: '100%',         // Makes the video fill the height of the Box
          width: 'auto',          // Maintains the aspect ratio of the video
          minWidth: '100%',       // Ensures it covers the width
          objectFit: 'cover'      // Covers the area, clipping the video as needed
        }}/>
    </Box>
      <VStack gap={"6rem"} w={"100%"}>
        {data.map((section, index) => (
          <Row key={index} title={section.title} small={section.small} items={section.items} />
        ))}
    </VStack>
    </>
  )
}
