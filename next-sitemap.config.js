 /** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://benedikt.berlin',
    generateRobotsTxt: true,
    generateIndexSitemap: true,
    exclude: ['/server-sitemap.xml'],
  }