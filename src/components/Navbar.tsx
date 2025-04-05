import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Box, Flex, Show, Hide, useColorMode, Button, ButtonGroup } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { chakra, ChakraProps } from "@chakra-ui/system";
import MyLink from './MyLink';
import { useRouter } from 'next/router';
import { NavSection } from './Layout';

const MotionBox = chakra(motion.div);
const MotionFlex = chakra(motion.div);

interface NavbarProps {
  data: NavSection | null;
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

export default function Navbar({ data = null }: NavbarProps) {
  console.log('Navbar component rendered with data:', data);
  const [menu, setMenu] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = colorMode === 'dark' ? 'rgba(8, 8, 8, 0.8)' : 'rgba(249,249,249,0.8)';
  const router = useRouter();
  const { locale, locales, pathname, asPath, query } = router;
  
  const [activeSection, setActiveSection] = useState("/");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    console.log("Navbar: Übergebene Daten:", data);

    if (!data || !Array.isArray(data.items) || data.items.length === 0) {
      console.warn("Navbar: Keine Daten zum Rendern verfügbar.", data);
      return;
    }
  }, [data]);

  useLayoutEffect(() => {
    // Entferne die Logik für den aktiven Indikator
  }, [activeSection]);

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

  const handleLocaleChange = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    setMenu(false);
  };

  const handleLinkClick = () => {
    setMenu(false);
  };

  return (
    <header style={{zIndex: 1000, position: "fixed", top: 0, left: 0, width: "100%"}}>
      <nav>
        <Box
          className='nav-container'
          px={4}
          backgroundColor={colorMode === 'dark' ? "rgba(100,100,100,0.3)" : "rgba(249,249,249,0.3)"}
          borderRadius={{base: menu ? '50px' : '50px', md: '50px'}}
          marginTop={'12px'}
          backdropFilter="blur(24px)"
          boxShadow={colorMode === 'dark' ? "rgb(0 0 0 / 55%) 9px 5px 50px 0" : "rgb(0 0 0 / 15%) 9px 5px 50px 0"}  
          display={"flex"}
          alignItems={"center"}
          position={{base: "absolute", md: "relative"}}
          left={{base: "16px", md: "auto"}}
          right={{base: "16px", md: "auto"}}
          zIndex={10}
        >
          <MyLink href={"./"} fontWeight={"900"} >
              Benedikt Schnupp
          </MyLink>
          <Show above="md">
            <Flex alignItems="center">
              <Box position="relative" ref={navContainerRef} mr={4}>
                <motion.div
                  style={{
                    position: 'absolute',
                    backgroundColor: 'white',
                    borderRadius: '50px',
                    transition: 'all 0.3s ease',
                    top: "15%",
                    left: indicatorStyle.left,
                    width: indicatorStyle.width,
                    height: '70%',
                    zIndex: 0
                  }}
                />
                <Flex position="relative" zIndex={1}>
                  {data?.items?.map((menuItem, itemIndex) => {
                    const isActive = activeSection === menuItem.fields.url;
                    return (
                      <Box
                        key={itemIndex}
                        ref={isActive ? activeLinkRef : null}
                        position="relative"
                        className="link-text"
                        minW={{base: "auto", md: "90px"}}
                        textAlign="center"
                        sx={{
                          position: 'relative',
                          transition: 'color 0.2s ease',
                          fontWeight: isActive ? '900' : 'normal',
                          color: isActive ? (colorMode === 'dark' ? 'white' : '#080808') : 'inherit',
                          padding: '4px 8px',
                          borderRadius: '50px'
                        }}
                        _hover={{
                          color: colorMode === 'dark' ? 'white' : '#080808',
                          fontWeight: '900'
                        }}
                      >
                        <MyLink 
                          href={menuItem.fields.url}
                          fontWeight={isActive ? '900' : 'normal'}
                          color={isActive ? 'black' : 'inherit'}
                        >
                          {menuItem.fields.title}
                        </MyLink>
                      </Box>
                    );
                  })}
                </Flex>
              </Box>
              <ButtonGroup size="sm" isAttached variant="outline">
                {(locales || []).map((loc) => (
                  <Button
                    key={loc}
                    onClick={() => handleLocaleChange(loc)}
                    isActive={locale === loc}
                    fontWeight={locale === loc ? 'bold' : 'normal'}
                  >
                    {loc.split('-')[0].toUpperCase()}
                  </Button>
                ))}
              </ButtonGroup>
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
        <AnimatePresence>
          {menu && (
            <MotionBox
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: '100vh' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ ease: "easeInOut", duration: 0.3 } as any}
              px={4}
              py={50}
              flexDirection="column"
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
              <Flex direction="column" alignItems="center" w="100%">
                {data?.items?.map((menuItem, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    initial="hidden"
                  >
                    <MyLink 
                      fontSize='40px'
                      href={menuItem.fields.url}
                      onClick={handleLinkClick}
                    >
                      {menuItem.fields.title}
                    </MyLink>
                  </motion.div>
                ))}
                <ButtonGroup size="md" variant="ghost" mt={8}>
                  {(locales || []).map((loc) => (
                    <Button
                      key={loc}
                      onClick={() => handleLocaleChange(loc)}
                      isActive={locale === loc}
                      fontWeight={locale === loc ? 'bold' : 'normal'}
                      fontSize="2xl"
                      color={colorMode === 'dark' ? 'white' : '#080808'}
                      _active={{ bg: 'transparent' }}
                    >
                      {loc.split('-')[0].toUpperCase()}
                    </Button>
                  ))}
                </ButtonGroup>
              </Flex>
            </MotionBox>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
