'use client'
import React from 'react'
import { Image, Box, Flex, Text, useBreakpointValue, VStack, HStack, useColorMode } from '@chakra-ui/react';
import { SearchIcon, EmailIcon } from '@chakra-ui/icons'
import { useRouter } from 'next/navigation' 

export default function Footer() {
    const router = useRouter()
    const { colorMode } = useColorMode();

    return (
        <Box mt={24} py={8} style={{
          background: colorMode === 'dark' ? "rgba(8, 8, 8, 0.8)" : "rgba(249, 249, 249, 0.8)"
        }}>
          <Flex direction="column" alignItems="flex-start" gap={12} maxW="68rem" mx="auto" p={useBreakpointValue({base: 4, xl: 0})} color={colorMode === 'dark' ? "white" : "#080808"}>
                <HStack gap={12}>
                    <Flex direction="column" gap={12}>
                        <Flex direction="column">
                            <Text>Benedikt Schnupp</Text>
                            <Text>Motion Designer</Text>
                            <Text>Developer</Text>
                        </Flex>

                        <Flex direction="column">
                            <Text>Danziger Str. 126A</Text>
                            <Text>10407 Berlin</Text>
                            <Text>Germany</Text>
                        </Flex>
                    </Flex>

                    <Flex direction="column" gap={12}>
                        <Flex direction="column" alignItems="flex-start">
                            <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("/about")}>
                            Personal
                            </Box>
                            <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("/about")}>
                            Work
                            </Box>
                            <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("/about")}>
                            Motion Design
                            </Box>
                            <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("/about")}>
                            Development
                            </Box>
                        </Flex>
                        <Flex direction="column" alignItems="flex-start">
                            <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("/impressum")}>
                            Impressum
                            </Box>
                            <Box as='button' p={0} className='menuItem' type="button" onClick={() => router.push("/datenschutz")}>
                            Datenschutz
                            </Box>
                        </Flex>
                    </Flex>
                </HStack>

                <Flex justify="space-between" align="center" w="100%">
                    <Text>
                        Copyright 2024
                    </Text>
                    <Flex gap="32px">
                        <EmailIcon />
                        <Image width={"16px"} src={"./linkedin.svg"} alt='LinkedIn' /> 
                        <Image width={"16px"} src={"./github.svg"} alt='GitHub' /> 
                        <Image width={"16px"} src={"./threads.svg"} alt='GitHub' /> 
                        <Image width={"16px"} src={"./whatsapp.svg"} alt='GitHub' /> 
                        <Image width={"16px"} src={"./dribble.svg"} alt='GitHub' /> 
                    </Flex>
                </Flex>
            </Flex>
        </Box>
    )
}
