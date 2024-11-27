'use client'
import './../app/globals.css'
import { Leva } from 'leva'
import { AppProps } from 'next/app';
import App from 'next/app'; // Import App from next/app
import { Providers } from "../app/providers";
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Inter } from 'next/font/google';
import Head from 'next/head';

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Box } from '@chakra-ui/react';
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';

const inter = Inter({ subsets: ['latin'] });

const DEFAULT_TITLE = "Design & Code - Benedikt Schnupp";
const DEFAULT_DESCRIPTION = "Your default site description goes here - make it compelling and keyword-rich, around 150-160 characters";
const DEFAULT_KEYWORDS = "keyword1, keyword2, keyword3";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://benedikt.berlin';
const DEFAULT_OG_IMAGE = `${SITE_URL}/images/og-image.jpg`;

const pageTransitionVariants = {
  hidden: { opacity: 0, x: 0, y: 0 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 0 },
};

function MyApp({ Component, pageProps }: AppProps & { mappedData: any }) {
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

console.log("pageProps", pageProps);
//pageProps.mappedData

  return (
    <Providers>
      <Head>
        <title>{DEFAULT_TITLE}</title>
        <meta name="description" content={DEFAULT_DESCRIPTION} />
        <meta name="keywords" content={DEFAULT_KEYWORDS} />
        
        {/* Viewport */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* Open Graph */}
        <meta property="og:title" content={DEFAULT_TITLE} />
        <meta property="og:description" content={DEFAULT_DESCRIPTION} />
        <meta property="og:image" content={DEFAULT_OG_IMAGE} />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:type" content="website" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={DEFAULT_TITLE} />
        <meta name="twitter:description" content={DEFAULT_DESCRIPTION} />
        <meta name="twitter:image" content={DEFAULT_OG_IMAGE} />
        
        {/* Additional SEO tags */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        <meta name="theme-color" content="#ffffff" /> {/* Adjust color to match your brand */}
        <link rel="canonical" href={SITE_URL} />
        
        {/* Preconnect to important third-party domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Head>
      <div className={inter.className}>
        <Navbar data={menuData} /> 
        <AnimatePresence mode='wait'>
          <motion.div
            key={router.route}
            initial="hidden"
            animate="enter"
            exit="exit"
            variants={pageTransitionVariants}
            transition={{ type: 'spring', damping: 25, stiffness: 100 }}
          >
            <Box >
            <Leva
            hidden={true}
            //hidden={process.env.NODE_ENV === 'production'} // Hides the GUI in production
             />
              <Component {...pageProps} />
            </Box>
            <Footer data={menuData} />
          </motion.div>
        </AnimatePresence>
      </div>
    </Providers>
  );
}

const menuData = [
  {
      "title": "Main",
      "items": [
          {
              "metadata": {
                  "tags": []
              },
              "sys": {
                  "space": {
                      "sys": {
                          "type": "Link",
                          "linkType": "Space",
                          "id": "1vhomxhsv3ci"
                      }
                  },
                  "id": "1aqCOWULMS6CotaS9nOdxk",
                  "type": "Entry",
                  "createdAt": "2024-05-17T15:07:07.466Z",
                  "updatedAt": "2024-05-20T20:12:33.512Z",
                  "environment": {
                      "sys": {
                          "id": "master",
                          "type": "Link",
                          "linkType": "Environment"
                      }
                  },
                  "revision": 2,
                  "contentType": {
                      "sys": {
                          "type": "Link",
                          "linkType": "ContentType",
                          "id": "menuItem"
                      }
                  },
                  "locale": "en-US"
              },
              "fields": {
                  "title": "Home",
                  "url": "/"
              }
          },
          {
              "metadata": {
                  "tags": []
              },
              "sys": {
                  "space": {
                      "sys": {
                          "type": "Link",
                          "linkType": "Space",
                          "id": "1vhomxhsv3ci"
                      }
                  },
                  "id": "2pNBeBLV0AN1ae2tOonlfH",
                  "type": "Entry",
                  "createdAt": "2024-05-17T17:57:08.600Z",
                  "updatedAt": "2024-05-20T20:12:30.612Z",
                  "environment": {
                      "sys": {
                          "id": "master",
                          "type": "Link",
                          "linkType": "Environment"
                      }
                  },
                  "revision": 2,
                  "contentType": {
                      "sys": {
                          "type": "Link",
                          "linkType": "ContentType",
                          "id": "menuItem"
                      }
                  },
                  "locale": "en-US"
              },
              "fields": {
                  "title": "Work",
                  "url": "/work"
              }
          },
          {
              "metadata": {
                  "tags": []
              },
              "sys": {
                  "space": {
                      "sys": {
                          "type": "Link",
                          "linkType": "Space",
                          "id": "1vhomxhsv3ci"
                      }
                  },
                  "id": "33JFSjFPBMkMgI7bTvlYT1",
                  "type": "Entry",
                  "createdAt": "2024-05-17T17:57:57.094Z",
                  "updatedAt": "2024-05-17T17:57:57.094Z",
                  "environment": {
                      "sys": {
                          "id": "master",
                          "type": "Link",
                          "linkType": "Environment"
                      }
                  },
                  "revision": 1,
                  "contentType": {
                      "sys": {
                          "type": "Link",
                          "linkType": "ContentType",
                          "id": "menuItem"
                      }
                  },
                  "locale": "en-US"
              },
              "fields": {
                  "title": "Design",
                  "url": "/design"
              }
          },
          {
              "metadata": {
                  "tags": []
              },
              "sys": {
                  "space": {
                      "sys": {
                          "type": "Link",
                          "linkType": "Space",
                          "id": "1vhomxhsv3ci"
                      }
                  },
                  "id": "4HD6CrNxbkII4issE34vv2",
                  "type": "Entry",
                  "createdAt": "2024-05-17T17:58:14.149Z",
                  "updatedAt": "2024-05-20T20:12:27.113Z",
                  "environment": {
                      "sys": {
                          "id": "master",
                          "type": "Link",
                          "linkType": "Environment"
                      }
                  },
                  "revision": 2,
                  "contentType": {
                      "sys": {
                          "type": "Link",
                          "linkType": "ContentType",
                          "id": "menuItem"
                      }
                  },
                  "locale": "en-US"
              },
              "fields": {
                  "title": "Code",
                  "url": "/developement"
              }
          }
      ]
  },
  {
      "title": "Footer",
      "items": [
          {
              "metadata": {
                  "tags": []
              },
              "sys": {
                  "space": {
                      "sys": {
                          "type": "Link",
                          "linkType": "Space",
                          "id": "1vhomxhsv3ci"
                      }
                  },
                  "id": "6Zu9LhHwUbgqlZNoEObRL0",
                  "type": "Entry",
                  "createdAt": "2024-05-20T20:10:46.874Z",
                  "updatedAt": "2024-05-20T20:10:46.874Z",
                  "environment": {
                      "sys": {
                          "id": "master",
                          "type": "Link",
                          "linkType": "Environment"
                      }
                  },
                  "revision": 1,
                  "contentType": {
                      "sys": {
                          "type": "Link",
                          "linkType": "ContentType",
                          "id": "menuItem"
                      }
                  },
                  "locale": "en-US"
              },
              "fields": {
                  "title": "Impressum",
                  "url": "/impressum"
              }
          },
          {
              "metadata": {
                  "tags": []
              },
              "sys": {
                  "space": {
                      "sys": {
                          "type": "Link",
                          "linkType": "Space",
                          "id": "1vhomxhsv3ci"
                      }
                  },
                  "id": "oJhZpgE42LYifOqSDA9KT",
                  "type": "Entry",
                  "createdAt": "2024-05-20T20:11:02.532Z",
                  "updatedAt": "2024-05-20T20:11:02.532Z",
                  "environment": {
                      "sys": {
                          "id": "master",
                          "type": "Link",
                          "linkType": "Environment"
                      }
                  },
                  "revision": 1,
                  "contentType": {
                      "sys": {
                          "type": "Link",
                          "linkType": "ContentType",
                          "id": "menuItem"
                      }
                  },
                  "locale": "en-US"
              },
              "fields": {
                  "title": "Datenschutz",
                  "url": "/datenschutz"
              }
          }
      ]
  }
]

export default MyApp;
