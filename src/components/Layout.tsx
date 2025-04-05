import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box } from '@chakra-ui/react';

export interface MenuItem {
  fields: {
    title: string;
    url: string;
  };
}

export interface NavSection {
  title?: string;
  items: MenuItem[];
}

interface LayoutProps {
  children: React.ReactNode;
  navData: NavSection | null;
  footerData: NavSection | null;
}

export default function Layout({ children, navData = null, footerData = null }: LayoutProps) {
  console.log('Layout component rendered with navData:', navData);
  console.log('Layout component rendered with footerData:', footerData);
  
  return (
    <>
      <Navbar data={navData} mobile={footerData} />
      <Box>
        {children}
      </Box>
      <Footer data={footerData} />
    </>
  );
}