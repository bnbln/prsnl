'use client'
import './../app/globals.css'
import { AppProps } from 'next/app';
import App from 'next/app'; // Import App from next/app
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

function MyApp({ Component, pageProps }: AppProps & { navbarData: any; footerData: any }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("chakra-ui-color-mode-default")) {
      localStorage.setItem("chakra-ui-color-mode", "dark")
      localStorage.setItem("chakra-ui-color-mode-default", "set")
    }

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

  console.log('Navbar data:', pageProps.navbarData);
  console.log('Footer data:', pageProps.footerData);

  return (
    <Providers>
      <div className={inter.className}>
        <Navbar data={pageProps.navbarData} />
        <AnimatePresence mode='wait'>
          <motion.div
            key={router.route}
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={pageTransitionVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          >
            <Box pt={50}>
              <Component {...pageProps} />
            </Box>
            <Footer data={pageProps.footerData} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Providers>
  );
}

// Custom getInitialProps for _app
MyApp.getInitialProps = async (appContext: any) => {
  const appProps = await App.getInitialProps(appContext);

  // Fetch your initial data here
  const navbarData = await fetchNavbarData();
  const footerData = await fetchFooterData();

  return {
    ...appProps,
    pageProps: {
      ...appProps.pageProps,
      navbarData,
      footerData,
    },
  };
};

export default MyApp;

async function fetchNavbarData() {
  // Replace with your actual data fetching logic
  return { title: "My Navbar" };
}

async function fetchFooterData() {
  // Replace with your actual data fetching logic
  return { text: "My Footer" };
}
