import React from 'react'
import { Box, Flex, Button, Heading, Text , useBreakpointValue } from '@chakra-ui/react';

interface ModuleProps {
  title?: string;
}


const Module: React.FC<ModuleProps> = ({ title }) => {
       
    return (
        <Flex id='personal' direction={useBreakpointValue({base: "column", md: "row"})} overflow={"hidden"} position={"relative"} w={useBreakpointValue({base: "calc(100vw - 26px)", xl: "1089px"})} alignItems="center" justifyContent={"space-between"} margin="auto" color={"#080808"} background={"white"} borderRadius={4.5}>
                <Box style={{
                    width: useBreakpointValue({base: "100%", md: "50%"}),
                    height: useBreakpointValue({base: "400px", md: "100%"}),
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundPosition: useBreakpointValue({base: "top", md: "center"}),
                    backgroundSize: "cover",
                    backgroundImage: "url(./Bene.jpg)"
                    }}></Box>
                <Flex justifyContent={"center"} gap={4} direction={"column"} mt={useBreakpointValue({base: 420, md: 0})} w={useBreakpointValue({base: "100%", md: "50%"})} alignContent="center" p={useBreakpointValue({base: 4, sm:12,  xl: 20})} color={"#080808"}>
                    <Box>
                        <Heading size={"lg"}>Crafting Connections through Code & Creativity</Heading>
                        <Heading mt={2} size={"md"}>with Video and Artificial Intelligence</Heading>
                    </Box>
                    <Text>Lets work together on anything from video production to web development using React, Node.js, Three.js and CSS, branding, animation, corporate design, 3D modeling, AI-generated artworks, Adobe After Effects and any other Creative Cloud product, Blender, Stable Diffusion, Midjourney, Figma and also Microsoft Office (Im good at Excel too).</Text>
                    <Text>If youre interested in collaborating, feel free to reach out.</Text>
                    <Box>
                    <Button>LinkedIn</Button> <Button variant={"none"}>Mail</Button>
                    </Box>
                </Flex>
                </Flex>
    )
}
export default Module;