import React, { useMemo, useRef } from 'react';
import { Box, Flex, Heading, Text, Link, SimpleGrid, Button } from '@chakra-ui/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, Environment } from '@react-three/drei';
import { Text as DreiText }  from '@react-three/drei';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { motion } from 'framer-motion';
import * as THREE from 'three';
import { getMenuData, getFooterData } from '../hooks/useMenuData';

// Removed menu and footer data fetching as they are handled elsewhere
export async function getStaticProps() {
  try {
    const menuData = await getMenuData();
    const footerData = await getFooterData();

    return {
      props: {
        navData: menuData[0],
        footerData: footerData[0],
      },
    };
  } catch (error) {
    console.error('Error fetching menu or footer data:', error);
    return {
      props: {
        navData: null,
        footerData: null,
      },
    };
  }
}

/* Three.js particles: a small, rotating point cloud */
function ParticleField() {
  const ref = useRef();
  const numParticles = 1000;
  const positions = useMemo(() => {
    const pos = new Float32Array(numParticles * 3);
    for (let i = 0; i < numParticles; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [numParticles]);

  useFrame(() => {
    if (ref.current) {
      ref.current.rotation.y += 0.001;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial attach="material" color="#ffffff" size={0.03} transparent opacity={0.7} />
    </points>
  );
}

/* The hero animation: your name “bene” in 3D with particle flair */
function HeroAnimation() {
  return (
    <group>
      {/* <DreiText
        color="#ffffff"
        fontSize={1.5}
        position={[0, 0, 0]}
        anchorX="center"
        anchorY="middle"
      >
        bene
      </DreiText> */}
      <ParticleField />
    </group>
  );
}

/* HERO SECTION */
function HeroSection() {
  const heroVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1 } },
  };

  return (
    <Box height="100vh" position="relative" background="linear-gradient(to bottom, #000, #111)">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      >
        <ScrollControls pages={1} infinite={false} horizontal={false} damping={0.1}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1.5} />
          <Environment preset="city" />
          <HeroAnimation />
          <EffectComposer>
            <Bloom intensity={1.5} luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
            <Noise opacity={0.2} />
            <Vignette eskil={false} offset={0.1} darkness={1.1} />
          </EffectComposer>
        </ScrollControls>
      </Canvas>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={heroVariants}
        style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          top: '40%',
          transform: 'translateY(-40%)',
          color: 'white',
        }}
      >
        <Heading fontSize={['3xl', '4xl', '6xl']} mb={4}>
          29-year-old Tech-Savvy Creative
        </Heading>
        <Text fontSize={['md', 'lg', 'xl']} mb={8}>
          7+ years of experience in motion design, branding, and front-end development.
        </Text>
        <Button colorScheme="teal" size="lg">
          Hire Me
        </Button>
      </motion.div>
    </Box>
  );
}

/* PORTFOLIO SECTION: showcase your video work */
function PortfolioSection() {
  return (
    <Box
      height="100vh"
      position="relative"
      bg="gray.900"
      color="white"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Heading mb={4}>My Video Work</Heading>
      <Box width={['90%', '70%', '50%']} maxHeight="70vh" overflow="hidden" boxShadow="lg">
        {/* Replace '/videos/portfolio.mp4' with your video asset */}
        <video
          src="/videos/portfolio.mp4"
          autoPlay
          loop
          muted
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      </Box>
      <Text mt={4} textAlign="center" px={4}>
        Experience the fusion of motion, design, and code.
      </Text>
    </Box>
  );
}

/* CLIENTS SECTION: animated logo wall */
function ClientsSection() {
  // Dummy client logos: update these paths/names with your actual client logos.
  const clients = [
    { name: 'Client One', logo: '/logos/client1.png' },
    { name: 'Client Two', logo: '/logos/client2.png' },
    { name: 'Client Three', logo: '/logos/client3.png' },
    { name: 'Client Four', logo: '/logos/client4.png' },
    { name: 'Client Five', logo: '/logos/client5.png' },
    { name: 'Client Six', logo: '/logos/client6.png' },
  ];

  return (
    <Box py={16} bg="black" color="white">
      <Heading textAlign="center" mb={8}>
        Former Clients
      </Heading>
      <SimpleGrid columns={[2, 3, 6]} spacing={8} maxW="1200px" mx="auto">
        {clients.map((client, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
            style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Box
              as="img"
              src={client.logo}
              alt={client.name}
              maxW="100px"
              filter="grayscale(100%)"
              _hover={{ filter: 'grayscale(0%)' }}
            />
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
}

/* BLOG SECTION: a teaser feed of your latest posts */
function BlogSection() {
  // Dummy blog posts data—replace with dynamic data if available.
  const posts = [
    {
      title: 'The Future of Motion Design',
      excerpt:
        'Exploring the latest trends in motion design and how technology is shaping the creative landscape.',
      slug: '/blog/future-of-motion-design',
    },
    {
      title: 'Branding in the Digital Age',
      excerpt:
        'Strategies and insights into building and maintaining a brand in today’s digital-first world.',
      slug: '/blog/branding-digital-age',
    },
    {
      title: 'Code Meets Creativity',
      excerpt:
        'How blending code with creative design is setting new standards in digital experiences.',
      slug: '/blog/code-meets-creativity',
    },
  ];

  return (
    <Box py={16} bg="gray.100" color="gray.800">
      <Heading textAlign="center" mb={8}>
        From My Blog
      </Heading>
      <SimpleGrid columns={[1, 2, 3]} spacing={8} maxW="1200px" mx="auto" px={4}>
        {posts.map((post, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'white',
              padding: '1rem',
              borderRadius: '8px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
            }}
          >
            <Heading size="md" mb={2}>
              {post.title}
            </Heading>
            <Text mb={2}>{post.excerpt}</Text>
            <Link href={post.slug} color="teal.500" fontWeight="bold">
              Read More →
            </Link>
          </motion.div>
        ))}
      </SimpleGrid>
    </Box>
  );
}

/* CONTACT SECTION: a strong call-to-action for potential clients */
function ContactSection() {
  return (
    <Box py={16} bg="teal.600" color="white" textAlign="center">
      <Heading mb={4}>Let’s Create Something Amazing Together</Heading>
      <Text mb={8}>
        Ready to elevate your brand and digital experience? Get in touch today!
      </Text>
      <Button size="lg" colorScheme="whiteAlpha">
        Contact Me
      </Button>
    </Box>
  );
}

/* MAIN LANDING PAGE */
export default function LandingPage({ navData, footerData }) {
  return (
    <Box>
      <HeroSection />
      <PortfolioSection />
      <ClientsSection />
      <BlogSection />
      <ContactSection />
    </Box>
  );
}