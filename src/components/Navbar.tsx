import React, { useEffect, useState } from 'react';
import { Box, Flex, Show, Hide, useColorMode, Button } from '@chakra-ui/react';
import { CloseIcon, HamburgerIcon, SunIcon, MoonIcon } from '@chakra-ui/icons';
import MyLink from './MyLink';
import Icon from './Icon';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

const MotionBox = motion.create(Box as any);
const MotionDiv = motion.div;

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

const Path = (props: any) => (
  <motion.path
    fill="transparent"
    strokeWidth="1.33"
    stroke={props.stroke || "currentColor"}
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle, isOpen, color }: { toggle: () => void, isOpen: boolean, color: string }) => (
  <Button 
    onClick={toggle} 
    variant="none" 
    aria-label={isOpen ? "Close Menu" : "Open Menu"}
    zIndex={1000}
  >
    <svg width="23" height="23" viewBox="0 0 19 18">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" }
        }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 }
        }}
        transition={{ duration: 0.1 }}
        animate={isOpen ? "open" : "closed"}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" }
        }}
        animate={isOpen ? "open" : "closed"}
      />
    </svg>
  </Button>
);

export default function Navbar({ data }: NavbarProps) {
  const [menu, setMenu] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = colorMode === 'dark' ? 'rgba(8, 8, 8, 0.8)' : 'rgba(249,249,249,0.8)';
  const router = useRouter();

  useEffect(() => {
    //(data);
  }, [data]);

  useEffect(() => {
    if (menu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [menu]);

  // Function to handle link click and close the menu
  const handleLinkClick = () => {
    setMenu(false);
  };

  // Animation variants for menu items
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.3,
      },
    }),
  };

  return (
    <header>
      <nav>
        <Box
          className='nav-container'
          // maxW="68rem"
          // mx="auto"
          // px={4}
          // pr={{ base: 0, xl: 4 }}
          // color={colorMode === 'dark' ? 'white' : '#080808'}
          px={{base: 0, md: 4}}
          backgroundColor={"rgba(0,0,0,0.3)"}
          borderRadius={{base: menu ? '0px' : '6px', md: '6px'}}
          marginTop={'12px'}
          backdropFilter="blur(24px)"
          boxShadow="rgb(0 0 0 / 55%) 9px 5px 50px 0"

        >
            <Show above="md">
              <Flex>
                {data.map((navItem, navIndex) => (
                  <React.Fragment key={navIndex}>
                    {navItem.title === "Main" && navItem.items.map((menuItem, itemIndex) => {
                      const isActive = router.asPath === menuItem.fields.url;
                      
                      return (
                        <Box
                          key={itemIndex}
                          position="relative"
                          className="link-text"
                            sx={{
                              position: 'relative',
                              transition: 'color 0.2s ease',
                              fontWeight: isActive ? '900' : 'normal',
                              color: isActive ? colorMode === 'dark' ? 'white' : '#080808' : 'inherit',
                            }}
                          _hover={{
                            '& .link-text': {
                              color: colorMode === 'dark' ? 'white' : '#080808',
                              fontWeight: '900'
                            },
                            '& .link-underline': {
                              width: '100%',
                              opacity: 0.5,
                            }
                          }}
                        >
                          <MyLink 
                            href={menuItem.fields.url}
                            fontWeight={isActive ? '900' : 'normal'}
                          >
                            {menuItem.fields.title}
                          </MyLink>
                          <motion.div
                            className="link-underline"
                            style={{
                              position: 'absolute',
                              bottom: -2,
                              left: 0,
                              height: '2px',
                              width: isActive ? '100%' : '0%',
                              backgroundColor: colorMode === 'dark' ? 'white' : '#080808',
                              opacity: isActive ? 1 : 0,
                              transition: 'width 0.2s ease, opacity 0.2s ease',
                            }}
                            initial={false}
                            animate={{
                              width: isActive ? '100%' : '0%',
                              opacity: isActive ? 1 : 0,
                            }}
                          />
                        </Box>
                      );
                    })}
                  </React.Fragment>
                ))}
              </Flex>
            </Show>


              <Hide above="md">
                <MenuToggle 
                  toggle={() => setMenu(prev => !prev)} 
                  isOpen={menu} 
                  color={colorMode === 'dark' ? 'white' : '#080808'}
                />
              </Hide>
        </Box>
        {menu && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              px={4}
              py={50}
              direction="column"
              w={"100%"}
              position="fixed"
              top={0}
              left={0}
              backgroundColor={backgroundColor}
              zIndex={-1}
              display={"flex"}
              justifyContent={"flex-start"}
              alignItems={"center"}
              backdropFilter="blur(10px)"
            >
              <Flex direction="column" alignItems="flex-start">
                {data.map((navItem, navIndex) => (
                  <React.Fragment key={navIndex}>
                    {navItem.items.map((menuItem, itemIndex) => (
                      <MotionDiv
                        key={navIndex === 0 ? itemIndex : itemIndex + 4}
                        variants={itemVariants}
                        initial="hidden"
                        animate="visible"
                        custom={navIndex === 0 ? itemIndex : itemIndex + 4}
                      >
                        <MyLink 
                          fontSize='40px'
                          href={menuItem.fields.url}
                          onClick={handleLinkClick}
                        >
                          {menuItem.fields.title}
                        </MyLink>
                      </MotionDiv>
                    ))}
                  </React.Fragment>
                ))}
              </Flex>
            </MotionBox>
          )}
      </nav>
      {/* {menu && <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', backdropFilter: 'blur(24px)' }} />} */}
    </header>
  );
}
