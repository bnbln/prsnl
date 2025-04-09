'use client'
import './../app/globals.css'
import { Leva } from 'leva'
import { AppProps } from 'next/app';
import { Providers } from "../app/providers";
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Layout from '../components/Layout';
import { Box } from '@chakra-ui/react';

const inter = Inter({ subsets: ['latin'] });

const DEFAULT_TITLE = "Design & Code - Benedikt Schnupp";
const DEFAULT_DESCRIPTION = "Your default site description goes here";
const DEFAULT_KEYWORDS = "keyword1, keyword2, keyword3";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://benedikt.berlin';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const pageTransitionVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

function MyApp({ Component, pageProps }: AppProps) {
    console.log('MyApp component rendered with pageProps:', pageProps);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("chakra-ui-color-mode-default")) {
      localStorage.setItem("chakra-ui-color-mode", "dark");
      localStorage.setItem("chakra-ui-color-mode-default", "set");
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

  useEffect(() => {
    if (router.pathname === '/' && typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth';
    }

    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, [router.pathname]);

  return (
    <Providers>
      <Head>
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="canonical" href={SITE_URL} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <div className={inter.className}>
        <Layout navData={pageProps.navData} footerData={pageProps.footerData}>
          <AnimatePresence mode='wait'>
            <motion.div
              key={router.route}
              initial="hidden"
              animate="enter"
              exit="exit"
              variants={pageTransitionVariants}
              transition={{ type: 'spring', damping: 25, stiffness: 100 }}
            >
              <Box>
                <Leva hidden={true} />
                <Component {...pageProps} />
              </Box>
            </motion.div>
          </AnimatePresence>
        </Layout>
      </div>
    </Providers>
  );
}

export default MyApp;
