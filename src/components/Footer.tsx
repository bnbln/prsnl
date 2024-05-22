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
    console.log(data);
  }, [data]);

  return (
    <Box mt={24} py={8} style={{
      background: colorMode === 'dark' ? "rgba(8, 8, 8, 0.8)" : "rgba(249, 249, 249, 0.8)"
    }}>
        <Flex  maxW="68rem" mx="auto" p={4}>
            <Icon width={24} height={24} color={colorMode === 'dark' ? "#fff" : '#080808'}  />
        </Flex>
      <Flex direction="column" alignItems="flex-start" gap={12} maxW="68rem" mx="auto" p={useBreakpointValue({ base: 4, xl: 0 })} color={colorMode === 'dark' ? "white" : "#080808"}>
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
          {data.map((navItem, navIndex) => (
            <Flex key={navIndex} direction="column" alignItems="flex-start">
            {navItem.items.map((item, index)=> (
                <Box as='button' key={index} p={0} className='menuItem' type="button" onClick={() => router.push(item.fields.url)}>
                {item.fields.title}
             </Box>
            ))}
            </Flex>
          ))}
          </Flex>
        </HStack>

        <Flex justify="space-between" align="center" w="100%">
          <Text>
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
