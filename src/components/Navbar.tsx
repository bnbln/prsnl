import React, { useEffect, useState } from 'react';
import { Box, Flex, Show, Hide, useBreakpointValue, useColorMode, Button } from '@chakra-ui/react';
import { SearchIcon, CloseIcon, HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import MyLink from './MyLink';
import Icon from './Icon';
import { createClient } from 'contentful';

interface IMenuItem {
  title: string;
  url: string;
}

interface INavbarData {
  title: string;
  items: IMenuItem[];
}
// console.log("i cant belieeeve my eyes:", process.env.CONTENTFUL_ACCESS_TOKEN);
// const client = createClient({
//   accessToken: process.env.CONTENTFUL_ACCESS_TOKEN as string,
//   space: process.env.CONTENTFUL_SPACE_ID as string,
// });

export default function Navbar() {
  const [menu, setMenu] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const [data, setData] = useState<INavbarData | null>(null);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Fetch the specific entry by ID
  //       const entry = await client.getEntry<INavbarData>('3w92kKa9R766uKF5maFNky', {
  //         include: 2,
  //       });

  //       // Resolve the nested Menu Items
  //       const items: IMenuItem[] = entry.fields.items.map((item: any) => ({
  //         title: item.fields.title,
  //         url: item.fields.url,
  //       }));

  //       setData({
  //         title: entry.fields.title,
  //         items,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching Navbar data from Contentful:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // if (!data) return <div>Loading...</div>;

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
          h={menu ? '400px' : '50px'}
          alignContent="center"
          color={colorMode === 'dark' ? 'white' : '#080808'}
        >
          <Flex justify="space-between" align="center">
            <Icon width={22} height={22} color={colorMode === 'dark' ? 'white' : '#080808'} />
            <Show above="md">
              <Flex>
              <MyLink href={"./"}>
                    Home
                </MyLink>
                <MyLink href={"/about"}>
                    Personal
                </MyLink>
                <MyLink href={"/work"}>
                    Work
                </MyLink>
                <MyLink href={"/design"}>
                    Design
                </MyLink>
                <MyLink href={"/dev"}>
                    Developement
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
