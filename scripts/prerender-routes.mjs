import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { seoRoutes, SITE_URL, DEFAULT_IMAGE } from './seo-routes.mjs';

function replaceTag(html, pattern, replacement) {
  if (pattern.test(html)) {
    return html.replace(pattern, replacement);
  }

  return html;
}

function injectRouteMeta(template, route) {
  const canonicalUrl = `${SITE_URL}${route.path}`;
  let html = template;

  html = replaceTag(html, /<title>.*?<\/title>/i, `<title>${route.title}</title>`);
  html = replaceTag(
    html,
    /<meta name="description" content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${route.description}" />`,
  );
  html = replaceTag(html, /<meta property="og:type" content="[^"]*"\s*\/?>/i, `<meta property="og:type" content="${route.type || 'website'}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonicalUrl}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${route.title}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${route.description}" />`);
  html = replaceTag(html, /<meta property="og:image" content="[^"]*"\s*\/?>/i, `<meta property="og:image" content="${route.image || DEFAULT_IMAGE}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${route.title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${route.description}" />`);
  html = replaceTag(html, /<meta name="twitter:image" content="[^"]*"\s*\/?>/i, `<meta name="twitter:image" content="${route.image || DEFAULT_IMAGE}" />`);

  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/gi, '');

  const structuredDataScripts = (route.structuredData || [])
    .map(
      (item) =>
        `<script type="application/ld+json">${JSON.stringify(item)}</script>`,
    )
    .join('');
  const bootstrapScript = route.bootstrapData
    ? `<script>window.__UNIVERZO_SEO_BOOTSTRAP__=${JSON.stringify({ path: route.path, ...route.bootstrapData })};</script>`
    : '';

  html = html.replace(
    '</head>',
    `<meta name="robots" content="index,follow,max-image-preview:large" /><link rel="canonical" href="${canonicalUrl}" />${structuredDataScripts}</head>`,
  );

  return html.replace('<div id="root"></div>', `<div id="root">${route.bodyHtml}</div>${bootstrapScript}`);
}

async function writeRoute(distDir, route, template) {
  const relativePath = route.path === '/' ? 'index.html' : join(route.path.replace(/^\//, ''), 'index.html');
  const outputPath = resolve(distDir, relativePath);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, injectRouteMeta(template, route), 'utf8');
}

const distDir = resolve('dist');
const template = await readFile(resolve(distDir, 'index.html'), 'utf8');

await Promise.all(seoRoutes.map((route) => writeRoute(distDir, route, template)));
