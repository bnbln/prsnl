import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { Box, Flex, Show, Hide, useColorMode, Button, ButtonGroup } from '@chakra-ui/react';
import { motion, AnimatePresence } from 'framer-motion';
import { chakra, ChakraProps } from "@chakra-ui/system";
import MyLink from './MyLink';
import { useRouter } from 'next/router';
import { NavSection } from './Layout';

const MotionBox = chakra(motion.div);
const MotionFlex = chakra(motion.div);

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"  // Änderung hier: Verwende einen vordefinierten Easing-Namen
    }
  })
};

interface NavbarProps {
  data: NavSection | null;
  mobile: NavSection | null;
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

// Füge diese Utility-Funktion am Anfang der Datei ein
const throttle = <T extends (...args: any[]) => any>(func: T, limit: number): T => {
  let inThrottle: boolean;
  return function(this: any, ...args: Parameters<T>): ReturnType<T> {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
    return undefined as ReturnType<T>;
  } as T;
};

export default function Navbar({ data = null, mobile = null }: NavbarProps) {
  console.log('Navbar component rendered with data:', data, 'mobile:', mobile);
  const [menu, setMenu] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { colorMode, toggleColorMode } = useColorMode();
  const backgroundColor = colorMode === 'dark' ? 'rgba(8, 8, 8, 0.8)' : 'rgba(249,249,249,0.8)';
  const router = useRouter();
  const { locale, locales = [], pathname, asPath, query } = router;
  
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

  useEffect(() => {
    const handleScroll = throttle(() => {
      if (!data?.items?.length || pathname !== '/') return;

      requestAnimationFrame(() => {
        let determinedSection = "/";
        const mainNavItems = data.items;
        
        if (window.scrollY < 10) {
          const homeItem = mainNavItems.find(item => item.fields.url === "/");
          if (homeItem) {
            determinedSection = homeItem.fields.url;
          }
        } else {
          const sectionItems = mainNavItems.filter(item => item.fields.url.startsWith('#'));
          const reversedSectionItems = [...sectionItems].reverse();
          
          const threshold = 150;
          for (const menuItem of reversedSectionItems) {
            const id = decodeURIComponent(menuItem.fields.url.replace('#', ''));
            const section = document.getElementById(id);
        
            if (section) {
              const rect = section.getBoundingClientRect();
              if (rect.top <= threshold) {
                determinedSection = menuItem.fields.url;
                break;
              }
            }
          }
        }
      
        setActiveSection(determinedSection);
      });
    }, 100); // Throttle auf 100ms

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [data, pathname]);

  useLayoutEffect(() => {
    if (pathname !== '/') return;

    const updateIndicator = throttle(() => {
      requestAnimationFrame(() => {
        if (activeLinkRef.current && navContainerRef.current) {
          const containerRect = navContainerRef.current.getBoundingClientRect();
          const activeRect = activeLinkRef.current.getBoundingClientRect();
          setIndicatorStyle({
            left: activeRect.left - containerRect.left,
            width: activeRect.width
          });
        }
      });
    }, 50);

    const timerId = setTimeout(updateIndicator, 100);
    window.addEventListener('resize', updateIndicator, { passive: true });
    
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeSection, pathname]);

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

  useEffect(() => {
    if (pathname === '/' && typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash) {
        const scrollToElement = () => {
          const element = document.querySelector(hash);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          } else {
            // Wiederhole die Überprüfung, falls das Element noch nicht existiert
            setTimeout(scrollToElement, 100);
          }
        };
        scrollToElement();
      }
    }
  }, [pathname]);

  useEffect(() => {
    // Setze hasAnimated auf true nach der ersten Animation
    if (!hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasAnimated]);

  const handleLocaleChange = (nextLocale: string) => {
    router.push({ pathname, query }, asPath, { locale: nextLocale });
    setMenu(false);
  };

  const handleLinkClick = (url: string) => {
    if (!url.startsWith('#')) {
      setMenu(false);
      return;
    }
  
    if (pathname !== '/') {
      router.push({ pathname: '/', hash: url.slice(1) });
    } else {
      const element = document.querySelector(url);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMenu(false);
  };

  return (
    <motion.header 
      style={{
        zIndex: 1000, 
        position: "fixed", 
        top: 0, 
        left: 0, 
        width: "100%",
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none" // Erlaubt Klicks durch den Header hindurch
      }}
    >
      <nav style={{ pointerEvents: "auto" }}> {/* Aktiviert Klick-Events nur für die Nav */}
        <motion.div
          initial={!hasAnimated ? { y: -100, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.5,
            ease: [0.16, 1, 0.3, 1],
            opacity: { duration: 0.3 }
          }}
        >
          <Box
            className='nav-container'
            px={4}
            py={1}
            backgroundColor={ "rgb(166 166 166 / 45%);"}
            borderRadius="50px"
            marginTop={'12px'}
            marginX={'16px'}
            backdropFilter="blur(12px)"
            boxShadow={colorMode === 'dark' ? "rgb(0 0 0 / 25%) 0px 3px 20px" : "rgb(0 0 0 / 10%) 0px 3px 20px"}
            display="flex"
            alignItems="center"
            w="fit-content"
            transition="all 0.3s ease"
            borderColor={colorMode === 'dark' ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"}
            style={{
              WebkitBackdropFilter: "blur(12px)"
            }}
          >
            <MyLink href={"./"} fontWeight={"900"} opacity={1} >
              {data?.title}
            </MyLink>
            <Show above="md">
              <Flex alignItems="center">
                <Box position="relative" ref={navContainerRef} mr={4}>
                  {pathname === '/' && (
                    <motion.div
                      style={{
                        position: 'absolute',
                        backgroundColor: '#ffffff20',
                        borderRadius: '50px',
                        transition: 'all 0.3s ease',
                        top: "15%",
                        left: indicatorStyle.left,
                        border: '1px solid #ffffff40',
                        width: indicatorStyle.width,
                        height: '70%',
                        zIndex: 0
                      }}
                    />
                  )}
                  <Flex position="relative" zIndex={1}>
                    {/* <ScrollIndicator activeSection={activeSection} /> */}
                    {data?.items?.map((menuItem, itemIndex) => {
                      const isActive = pathname === '/' ? activeSection === menuItem.fields.url : pathname === menuItem.fields.url;
                      return (
                        <Box
                          key={itemIndex}
                          ref={isActive && pathname === '/' ? activeLinkRef : null}
                          position="relative"
                          className="link-text"
                          minW={{base: "auto", md: "90px"}}
                          textAlign="center"
                          sx={{
                            position: 'relative',
                            transition: 'color 0.2s ease',
                            fontWeight: 'normal',
                            color: isActive ? (colorMode === 'dark' ? 'white' : 'white') : 'inherit',
                            padding: '4px 8px',
                            borderRadius: '50px',
                            mixBlendMode: isActive ? 'difference' : 'normal',
                          }}
                          _hover={{
                            color: colorMode === 'dark' ? 'white' : '#080808',
                            fontWeight: '900'
                          }}
                        >
                          <MyLink 
                            href={menuItem.fields.url}
                            fontWeight={'500'}
                            color={isActive ? 'white' : 'inherit'}
                            onClick={() => handleLinkClick(menuItem.fields.url)}
                          >
                            {menuItem.fields.title}
                          </MyLink>
                        </Box>
                      );
                    })}
                  </Flex>
                </Box>
                <ButtonGroup size="sm" isAttached variant="outline">
                  {(locales ?? []).map((loc, index) => (
                    <Button
                      key={loc}
                      onClick={() => handleLocaleChange(loc)}
                      isActive={locale === loc}
                      fontWeight={locale === loc ? 'bold' : 'normal'}
                      borderRadius={
                        index === 0 
                          ? '100px 0 0 100px'
                          : index === locales.length - 1 
                            ? '0 100px 100px 0'
                            : 'none'
                      }
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
        </motion.div>
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
              justifyContent={"center"}
              alignItems={"center"}
              backdropFilter="blur(10px)"
            >
              <Flex direction="column" alignItems="center" w="100%">
                {(mobile?.items || data?.items)?.map((menuItem, itemIndex) => (
                  <motion.div
                    key={itemIndex}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    custom={itemIndex}
                  >
                    <MyLink 
                      fontSize='40px'
                      href={menuItem.fields.url}
                      onClick={() => handleLinkClick(menuItem.fields.url)}
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
    </motion.header>
  );
}
