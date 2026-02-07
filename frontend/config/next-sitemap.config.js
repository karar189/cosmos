/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || 'https://core3.io',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: ['/api/*', '/og'],
};
