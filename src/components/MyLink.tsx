import React from 'react';
import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

interface MyLinkProps {
  href: string;
  onClick?: () => void; // Optional onClick prop
  children: React.ReactNode;
  fontSize?: string; // Optional fontSize prop
}

// Create a motion component for MyLink
const MotionBox = motion.create(Box as any);

const MyLink: React.FC<MyLinkProps> = ({ href, onClick, children, fontSize }) => {
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
      p={3} 
      className='menuItem' 
      onClick={handleClick}
    >
      {children}
    </MotionBox>
  );
};

export default MyLink;