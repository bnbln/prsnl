/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.ctfassets.net'], // Erlaubt Bilder von Contentful
        deviceSizes: [640, 750, 828, 1080, 1200, 1920], // Optimierte Größen
        imageSizes: [16, 32, 48, 64, 96, 128, 256], // Kleinere Thumbnail-Größen
        formats: ['image/avif', 'image/webp'], // Moderne Bildformate
        minimumCacheTTL: 60 * 60 * 24, // 24 Stunden Cache
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.ctfassets.net',
            port: '',
            pathname: '/**',
          },
        ],
      },
  reactStrictMode: true,
  i18n: {
    locales: ['en-US', 'de-DE'],
    defaultLocale: 'en-US',
  },
}

module.exports = nextConfig
