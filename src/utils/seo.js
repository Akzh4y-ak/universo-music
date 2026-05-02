export const SITE_NAME = 'Univerzo Music';
export const SITE_URL = 'https://universo-music.vercel.app';
export const DEFAULT_OG_IMAGE_PATH = '/og-image.png';
export const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_OG_IMAGE_PATH}`;

export function normalizePath(path = '/') {
  if (!path || path === '/') {
    return '/';
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return normalizedPath.replace(/\/+$/, '') || '/';
}

export function buildCanonicalUrl(path = '/') {
  return `${SITE_URL}${normalizePath(path)}`;
}

export function absoluteUrl(value = DEFAULT_OG_IMAGE_PATH) {
  if (!value) {
    return DEFAULT_OG_IMAGE;
  }

  if (/^https?:\/\//i.test(value)) {
    return value;
  }

  return `${SITE_URL}${value.startsWith('/') ? value : `/${value}`}`;
}

export function buildBreadcrumbStructuredData(items = []) {
  if (!Array.isArray(items) || items.length < 2) {
    return null;
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonicalUrl(item.path),
    })),
  };
}

export function formatIsoDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return undefined;
  }

  const totalSeconds = Math.round(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const remainingSeconds = totalSeconds % 60;
  let duration = 'PT';

  if (hours > 0) {
    duration += `${hours}H`;
  }

  if (minutes > 0) {
    duration += `${minutes}M`;
  }

  if (remainingSeconds > 0 || duration === 'PT') {
    duration += `${remainingSeconds}S`;
  }

  return duration;
}
