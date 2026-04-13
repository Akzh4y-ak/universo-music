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
    label: 'JioSaavn',
    summary: 'Full tracks are streaming from JioSaavn with no listener login required. This is the active no-login catalog path for the app.',
  };
}
