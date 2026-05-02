import { writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { featuredPlaylists } from '../src/data/featuredPlaylists.js';
import { genres } from '../src/data/genres.js';

const SITE_URL = 'https://universo-music.vercel.app';
const today = new Date().toISOString().split('T')[0];

const staticRoutes = [
  { path: '/', changefreq: 'daily', priority: '1.0' },
  { path: '/trending', changefreq: 'daily', priority: '0.9' },
];

const genreRoutes = genres.map((genre) => ({
  path: `/genre/${genre.id}`,
  changefreq: 'weekly',
  priority: '0.8',
}));

const playlistRoutes = featuredPlaylists.map((playlist) => ({
  path: `/playlist/${playlist.id}`,
  changefreq: 'weekly',
  priority: '0.7',
}));

const routes = [...staticRoutes, ...genreRoutes, ...playlistRoutes];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes
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
