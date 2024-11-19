// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'

export const theme = extendTheme({ 
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  fonts: {
    body: 'GeneralSans-Variable',
    heading: 'GeneralSans-Variable',
  },
  colors: {
    black: '#080808',
    white: '#f9f9f9',
    gray: {
      800: '#080808',
    },
    brand: {
      900: '#1a365d',
      800: '#153e75',
      100: '#2a69ac',
    },
    blue: {
      100: '#0052B0',
      200: '#0069D9',
      300: '#007FFF',
      400: '#009FFF',
      500: '#00BFFF',
      600: '#00D3FF',
      700: '#00E5FF',
      800: '#00F5FF',
      900: '#00FFFF',
    }
  },
})

export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}