import React, { useEffect, useState } from 'react';
import { Box, Flex, Show, Hide, useBreakpointValue, useColorMode, Button } from '@chakra-ui/react';
import { SearchIcon, CloseIcon, HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import MyLink from './MyLink';
import Icon from './Icon';

interface IMenuItem {
  title: string;
  url: string;
}

interface INavbarData {
  title: string;
  items: IMenuItem[];
}

interface NavbarProps {
  data: INavbarData;
}

export default function Navbar({ data }: NavbarProps) {
  const [menu, setMenu] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    console.log('Navbar data:', data);
  }, [data]);

  return (
    <header>
      <nav
        style={{
          background: colorMode === 'dark' ? 'rgba(8, 8, 8, 0.8)' : 'rgba(249,249,249,0.8)',
        }}
      >
        <Box
          maxW="68rem"
          mx="auto"
          px={4}
          pr={{ base: 0, xl: 4 }}
          h={menu ? '100vh' : '50px'}
          alignContent={'flex-start'}
          color={colorMode === 'dark' ? 'white' : '#080808'}
          transition={"ease-in-out 3s height"}
        >
          <Flex justify="space-between" align="center">
            <MyLink href={"./"}>
              <Icon width={22} height={22} color={colorMode === 'dark' ? 'white' : '#080808'} />
            </MyLink>
            <Show above="md">
              <Flex>
                <MyLink href={"./"}>
                  Home
                </MyLink>
                <MyLink href={"/about"}>
                  Work
                </MyLink>
                <MyLink href={"/design"}>
                  Motion Design
                </MyLink>
                <MyLink href={"/dev"}>
                  Development
                </MyLink>
                {/* {data.items.map((item, index) => (
                  <MyLink key={index} href={item.url}>
                    {item.title}
                  </MyLink>
                ))} */}
              </Flex>
            </Show>
            <Flex gap="4px">
              <Button onClick={toggleColorMode} variant="none">
                {colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
              </Button>
              <Hide above="md">
                <Button onClick={() => setMenu(!menu)} variant="none">
                  {menu ? <CloseIcon /> : <HamburgerIcon />}
                </Button>
              </Hide>
            </Flex>
          </Flex>
        </Box>
      </nav>
    </header>
  );
}
