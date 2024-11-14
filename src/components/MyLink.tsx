import React from 'react';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface MyLinkProps {
  href: string;
  onClick?: () => void; // Optional onClick prop
  children: React.ReactNode;
  fontSize?: string; // Optional fontSize prop
  fontWeight?: string; // Optional fontWeight prop
}

// Create a motion component for MyLink
const MotionBox = motion.create(Box as any);

const MyLink: React.FC<MyLinkProps> = ({ href, onClick, children, fontSize, fontWeight }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Call the onClick prop if provided
    }
    router.push(href); // Navigate to the href
  };

  return (
    <MotionBox 
      as='button' 
      fontSize={fontSize} 
      fontWeight={fontWeight || 'normal'}
      p={3} 
      className='menuItem' 
      lineHeight={'24px'}
      onClick={handleClick}
      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
      
    >
      {children}
    </MotionBox>
  );
};

export default MyLink;