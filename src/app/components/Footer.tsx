'use client'
import React, {useState} from 'react'
import { Box, Flex, Text, useBreakpointValue, Show, Hide, VStack, HStack } from '@chakra-ui/react';
import {SearchIcon, CloseIcon, HamburgerIcon} from '@chakra-ui/icons'
import { useRouter } from 'next/navigation'


export default function Footer() {
    const router = useRouter()

  const darkmode = true;

  return (
    <Box mt={60} mb={8} style={{
      background: darkmode ? "rgba(8, 8, 8, 0.8)" : "rgba(249,249,249,0.8)"}}>
      <Flex direction={"column"} alignItems={"flex-start"} gap={12} w={useBreakpointValue({base: "auto", xl: "1089px"})} margin="auto" p={useBreakpointValue({base: 4, xl: 0})} color={darkmode ? "white" : "#080808"}>
            <HStack gap={12}>
                
                <Flex direction={"column"} gap={12} >

                    <Flex direction={"column"} >
                        <Text size={"xl"}>Benedikt Schnupp</Text>
                        <Text size={"xl"}>Motion Designer</Text>
                        <Text size={"xl"}>Developer</Text>
                    </Flex>

                    <Flex direction={"column"} >
                        <Text size={"xl"}>Danziger Str. 126A</Text>
                        <Text size={"xl"}>10407 Berlin</Text>
                        <Text size={"xl"}>Germany</Text>
                    </Flex>



                </Flex>

                <Flex direction={"column"} gap={12} >
                    <Flex direction={"column"} alignItems={"flex-start"} >
                        <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("./about")}>
                        Personal
                        </Box>
                        <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("./about")}>
                        Work
                        </Box>
                        <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("./about")}>
                        Motion Design
                        </Box>
                        <Box as='button' p={0} textAlign={"left"} className='menuItem' type="button" onClick={() => router.push("./about")}>
                        Developement
                        </Box>
                    </Flex>
                    <Flex direction={"column"} alignItems={"flex-start"}>
                        <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("./impressum")}>
                        Impressum
                        </Box>
                        <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("./datenschutz")}>
                        Datenschutz
                        </Box>
                    </Flex>

                </Flex>
            </HStack>

            <Flex justify="space-between" align="center" w={"100%"}>
                <Text>
                    Copyright 2024
                </Text>
                <Flex gap="32px">
                <SearchIcon /> <SearchIcon /> <SearchIcon /> <SearchIcon /> <SearchIcon />
                </Flex>
            </Flex>
        </Flex>
    </Box>
    
  )
}
