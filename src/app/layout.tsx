import './globals.css'
import type { Metadata } from 'next'
import Head from 'next/head';
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { Inter } from 'next/font/google'
import { Providers } from "./providers";
import { Analytics } from '@vercel/analytics/react';

const inter = Inter({ subsets: ['latin'] })


export const metadata: Metadata = {
  title: 'benedikt.berlin - Motion Design',
  description: 'Motion Design and Web Developent',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (

    <html lang="en">
      <body className={inter.className} style={{background: "rgb(8, 8, 8)"}}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
          <Analytics />
        </Providers>
      </body>
    </html>
  )
}
