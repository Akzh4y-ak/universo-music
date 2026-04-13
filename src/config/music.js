export const MUSIC_PROVIDER = 'jiosaavn';

export function getActiveMusicProvider() {
  return 'jiosaavn';
}

export function getMusicProviderInfo() {
  return {
    requestedProvider: 'jiosaavn',
    activeProvider: 'jiosaavn',
    hasLiveCatalog: true,
    supportsFullPlayback: true,
    requiresUserLogin: false,
    isUsingPublicCatalog: true,
    label: 'Univerzo Catalog',
    summary: 'Full tracks are streaming from our secure catalog with no login required.',
  };
}
