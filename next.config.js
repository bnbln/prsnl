/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
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
