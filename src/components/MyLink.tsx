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
  color?: string; // Optional color prop
  animationValue?: string;
}

// Create a motion component for MyLink
const MotionBox = motion.create(Box as any);

const MyLink: React.FC<MyLinkProps> = ({ href, onClick, children, fontSize, fontWeight, color, animationValue }) => {
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
      color={color}
      fontSize={fontSize} 
      fontWeight={fontWeight || 'normal'}
      p={3} 
      className='menuItem' 
      lineHeight={'24px'}
      onClick={handleClick}
      whileHover={animationValue && animationValue === "wiggle" ? 
        { 
          rotate: [0, 10, -10, 10, 0],
          transition: {
            duration: 0.5,
            repeat: Infinity
          }
        } 
        : { fontWeight: 900 }
      } 
      whileTap={{ scale: 0.95 }}
      style={{ transition: 'color 0.2s ease' }}
    >
      {children}
    </MotionBox>
  );
};

export default MyLink;