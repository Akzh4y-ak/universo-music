import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { SITE_URL, sitemapRoutes } from './seo-routes.mjs';

const today = new Date().toISOString().split('T')[0];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapRoutes
  .map((route) => `  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`)
  .join('\n')}
</urlset>
`;

await writeFile(resolve('public', 'sitemap.xml'), xml, 'utf8');
