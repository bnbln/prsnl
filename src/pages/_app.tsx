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

import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import { Box } from '@chakra-ui/react';
import { createClient, EntrySkeletonType, EntryFields, Asset } from 'contentful';

const inter = Inter({ subsets: ['latin'] });


const pageTransitionVariants = {
  hidden: { opacity: 0, x: 0, y: -200 },
  enter: { opacity: 1, x: 0, y: 0 },
  exit: { opacity: 0, x: 0, y: 100 },
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

console.log(pageProps);
//pageProps.mappedData

  return (
    <Providers>
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
            <Box pt={50}>
            <Leva
            hidden={process.env.NODE_ENV === 'production'} // Hides the GUI in production
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
                  "title": "Motion Design",
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
                  "title": "Developement",
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
