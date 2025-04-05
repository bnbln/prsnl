'use client'
import React from 'react';
import { Box, Flex, Text, useBreakpointValue, HStack, useColorMode } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import { IconDribble, IconGithub, IconLinkedin, IconThreads, IconWhatsapp } from './Icon';
import { NavSection } from './Layout';

interface FooterProps {
  data: NavSection | null;
}

export default function Footer({ data = null }: FooterProps) {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const currentYear = new Date().getFullYear();
  console.log('Footer component rendered with data:', data);

  return (
    <Box mt={24} py={8} style={{
      background: colorMode === 'dark' ? "rgba(8, 8, 8, 0.8)" : "rgba(249, 249, 249, 0.8)"
    }}>
      <Flex direction="column" alignItems="flex-start" gap={12} maxW="68rem" mx="auto" p={useBreakpointValue({ base: 4, xl: 0 })} color={colorMode === 'dark' ? "white" : "#080808"}>
        <HStack gap={12} alignItems="flex-start">
          <Flex direction="column" gap={12}>
            <Flex direction="column">
              <Text fontWeight={900}>Benedikt Schnupp</Text>
              <Text>Motion Designer</Text>
              <Text>Developer</Text>
            </Flex>
          </Flex>

          <Flex direction="column" gap={1} alignItems={"flex-start"}>
            {data?.items?.map((item, index) => (
              <Box 
                as='button' 
                key={`footer-item-${index}`}
                p={0} 
                className='menuItem' 
                type="button" 
                onClick={() => router.push(item.fields.url)}
              >
                {item.fields.title}
              </Box>
            ))}
          </Flex>
        </HStack>

        <Flex justify="space-between" gap={8} align="center" w="100%" direction={{ base: 'column-reverse', sm: 'row' }}>
          <Text fontSize={"sm"}>
            &copy; Copyright {currentYear}
          </Text>
          <Flex gap="32px">
            <a href="mailto:mail@benedikt.berlin" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
              <EmailIcon color={colorMode === 'dark' ? "#fff" : '#080808'} />
            </a>
            <a href="https://de.linkedin.com/in/benedikt-schnupp-928112116" target="_blank" rel="noopener noreferrer">
              <IconLinkedin width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            </a>
            <a href="https://github.com/bnbln" target="_blank" rel="noopener noreferrer">
              <IconGithub width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            </a>
            <a href="https://www.threads.net" target="_blank" rel="noopener noreferrer">
              <IconThreads width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            </a>
            <a href="https://www.whatsapp.com" target="_blank" rel="noopener noreferrer">
              <IconWhatsapp width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            </a>
            <a href="https://www.dribbble.com" target="_blank" rel="noopener noreferrer">
              <IconDribble width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            </a>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
