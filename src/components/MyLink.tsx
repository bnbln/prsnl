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
const MotionLink = motion(Box);

const MyLink: React.FC<MyLinkProps> = ({ href, onClick, children, fontSize }) => {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(); // Call the onClick prop if provided
    }
    router.push(href); // Navigate to the href
  };

  return (
    <MotionLink 
      as='button' 
      fontSize={fontSize} 
      p={3} 
      className='menuItem' 
      type="button" 
      onClick={handleClick}
    >
      {children}
    </MotionLink>
  );
};

export default MyLink;