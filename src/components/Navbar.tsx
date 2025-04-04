import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
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
  
  const [activeSection, setActiveSection] = useState("/");
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const navContainerRef = useRef<HTMLDivElement>(null);
  const activeLinkRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      let determinedSection = "/"; // Default to Home

      const mainNavItems = data.find(navItem => navItem.title === "Main")?.items || [];
      // Filter for items that link to page sections
      const sectionItems = mainNavItems.filter(item => item.fields.url.startsWith('#'));
      // Reverse the order to check from bottom-most section up
      const reversedSectionItems = [...sectionItems].reverse();

      const threshold = 150; // Pixels from top of viewport to trigger activation

      for (const menuItem of reversedSectionItems) {
        // Decode URI component to handle IDs with spaces or special characters
        const id = decodeURIComponent(menuItem.fields.url.replace('#', ''));
        const section = document.getElementById(id);

        if (section) {
          const rect = section.getBoundingClientRect();
          // If the top of the section is at or above the threshold
          if (rect.top <= threshold) {
            determinedSection = menuItem.fields.url;
            break; // Found the highest section meeting the criteria, stop checking
          }
        } else {
          // Optional: Log a warning if an element ID is not found
          // console.warn(`Navbar: Element with ID '${id}' not found for URL '${menuItem.fields.url}'`);
        }
      }

      // Update the activeSection state only if it has changed
      setActiveSection(currentActiveSection => {
        if (determinedSection !== currentActiveSection) {
          return determinedSection;
        }
        return currentActiveSection; // No change needed
      });
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    // Run initially to set the correct section on load
    handleScroll();

    // Cleanup listener on component unmount
    return () => window.removeEventListener('scroll', handleScroll);

  }, [data]); // Dependency array only includes data

  // Update indicator position when activeSection changes or on resize
  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (activeLinkRef.current && navContainerRef.current) {
        const containerRect = navContainerRef.current.getBoundingClientRect();
        const activeRect = activeLinkRef.current.getBoundingClientRect();
        setIndicatorStyle({
          left: activeRect.left - containerRect.left,
          width: activeRect.width
        });
      } else {
         // Hide indicator if no ref is found (e.g., initial render)
         setIndicatorStyle({ left: 0, width: 0 });
      }
    };

    // Use setTimeout to ensure refs are updated after re-render caused by activeSection change
    const timerId = setTimeout(updateIndicator, 0);

    window.addEventListener('resize', updateIndicator);
    return () => {
      clearTimeout(timerId);
      window.removeEventListener('resize', updateIndicator);
    }
  }, [activeSection]); // Re-run when activeSection changes

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
          right={{base: "16px", md: "auto"}}
          zIndex={10}
        >
          <MyLink href={"./"} fontWeight={"900"} >
              Benedikt Schnupp
            </MyLink>
            <Show above="md">
              <Box position="relative" ref={navContainerRef}>
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
                  {data.map((navItem, navIndex) => (
                    <React.Fragment key={navIndex}>
                      {navItem.title === "Main" && navItem.items.map((menuItem, itemIndex) => {
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
                    </React.Fragment>
                  ))}
                </Flex>
              </Box>
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
                        // variants={itemVariants}
                        initial="hidden"
                        // animate="visible"
                        // custom={navIndex === 0 ? itemIndex : itemIndex + 4}
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
