'use client'
import './../app/globals.css'
import { AppProps } from 'next/app';
import { Providers } from "../app/providers";
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';


import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Box } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

const pageTransitionVariants = {
  hidden: { opacity: 0, x: 0, y: -200 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 100 },
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <Providers>
      <div className={inter.className}>
        <Navbar />
        <AnimatePresence mode='wait'>
          <motion.div
            key={router.route}
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={pageTransitionVariants}
            transition={{ type: 'spring', damping: 25, stiffness:100 }}
          >
            <Box pt={50}>
            <Component {...pageProps} />
            </Box>
            <Footer />
          </motion.div>
        </AnimatePresence>
      </div>
    </Providers>
  );
}

export default MyApp;
