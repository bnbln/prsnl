import React, { useEffect, useState } from 'react';
import { Box, Flex, Show, Hide, useColorMode, Button } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import MyLink from './MyLink';
import Icon from './Icon';

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

interface NavbarProps {
  data: INavbarData[];
}

export default function Navbar({ data }: NavbarProps) {
  const [menu, setMenu] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = colorMode === 'dark' ? 'rgba(8, 8, 8, 0.8)' : 'rgba(249,249,249,0.8)';

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <header>
      <nav style={{ background: backgroundColor }}>
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
                {data.map((navItem, navIndex) => (
                  <React.Fragment key={navIndex}>
                    {navItem.title === "Main" && navItem.items.map((menuItem, itemIndex) => (
                      <MyLink key={itemIndex} href={menuItem.fields.url}>
                        {menuItem.fields.title}
                      </MyLink>
                    ))}
                  </React.Fragment>
                ))}
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
          {menu && (
            <Flex
              pr={16}
              pb={50}
              direction="column"
              h={"100%"}
              w={"100%"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box>
                {data.map((navItem, navIndex) => (
                  <Flex key={navIndex} direction="column" alignItems="flex-start">
                    {navItem.items.map((menuItem, itemIndex) => (
                      <MyLink fontSize='xl' key={itemIndex} href={menuItem.fields.url}>
                        {menuItem.fields.title}
                      </MyLink>
                    ))}
                  </Flex>
                ))}
              </Box>
            </Flex>
          )}
        </Box>
      </nav>
    </header>
  );
}
