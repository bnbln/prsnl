'use client'
import React, { useEffect } from 'react';
import { Box, Flex, Text, useBreakpointValue, HStack, useColorMode } from '@chakra-ui/react';
import { EmailIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import Icon, { IconDribble, IconGithub, IconLinkedin, IconThreads, IconWhatsapp } from './Icon';

interface IFields {
  title: string;
  url: string;
}

interface IMenuItem {
  fields: IFields;
}

interface INavbarData {
  title: string;
  items: IMenuItem[];
}
  
  interface FooterProps {
    data: INavbarData[];
  }


export default function Footer({ data }: FooterProps) {
  const router = useRouter();
  const { colorMode } = useColorMode();

  const currentYear = new Date().getFullYear();
  useEffect(() => {
    //console.log(data);
  }, [data]);

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
            {data.map((navItem, navIndex) => (
              <React.Fragment key={`nav-section-${navIndex}`}>
                {navItem.items.map((item, index) => (
                  <Box 
                    as='button' 
                    key={`nav-item-${navIndex}-${index}`}
                    p={0} 
                    className='menuItem' 
                    type="button" 
                    onClick={() => router.push(item.fields.url)}
                  >
                    {item.fields.title}
                  </Box>
                ))}
              </React.Fragment>
            ))}
          </Flex>
        </HStack>

        <Flex justify="space-between" gap={8} align="center" w="100%" direction={{ base: 'column-reverse', sm: 'row' }}>
          <Text fontSize={"sm"}>
            &copy; Copyright {currentYear}
          </Text>
          <Flex gap="32px">
            <EmailIcon color={colorMode === 'dark' ? "#fff" : '#080808'} />
            <IconLinkedin width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            <IconGithub width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            <IconThreads width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            <IconWhatsapp width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
            <IconDribble width={16} height={16} color={colorMode === 'dark' ? "#fff" : '#080808'} />
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
}
