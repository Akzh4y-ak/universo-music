import { APPLE_MUSIC_CONFIG, hasAppleMusicCatalogAccess } from '../config/music';

const MUSIC_KIT_SCRIPT_URL = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js';

let scriptPromise = null;
let configured = false;

function appendMusicKitScript() {
  if (typeof window === 'undefined') {
    return Promise.resolve(null);
  }

  if (window.MusicKit) {
    return Promise.resolve(window.MusicKit);
  }

  if (!scriptPromise) {
    scriptPromise = new Promise((resolve, reject) => {
      const existingScript = document.querySelector(`script[src="${MUSIC_KIT_SCRIPT_URL}"]`);

      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(window.MusicKit));
        existingScript.addEventListener('error', () => reject(new Error('MusicKit script failed')));
        return;
      }

      const script = document.createElement('script');
      script.src = MUSIC_KIT_SCRIPT_URL;
      script.async = true;
      script.onload = () => resolve(window.MusicKit);
      script.onerror = () => reject(new Error('MusicKit script failed'));
      document.head.appendChild(script);
    });
  }

  return scriptPromise;
}

export async function getAppleMusicInstance() {
  if (!hasAppleMusicCatalogAccess) {
    return null;
  }

  const MusicKit = await appendMusicKitScript();

  if (!MusicKit) {
    return null;
  }

  if (!configured) {
    MusicKit.configure({
      developerToken: APPLE_MUSIC_CONFIG.developerToken,
      app: {
        name: APPLE_MUSIC_CONFIG.appName,
        build: '1.0.0',
      },
    });
    configured = true;
  }

  return MusicKit.getInstance();
}

export async function authorizeAppleMusic() {
  const instance = await getAppleMusicInstance();

  if (!instance) {
    return { ok: false, message: 'Apple Music is not configured.' };
  }

  try {
    if (!instance.isAuthorized && typeof instance.authorize === 'function') {
      await instance.authorize();
    }

    return { ok: true, instance };
  } catch (error) {
    return { ok: false, message: error?.message || 'Apple Music authorization failed.' };
  }
}

export async function playAppleMusicTrack(track) {
  const auth = await authorizeAppleMusic();

  if (!auth.ok) {
    return auth;
  }

  const instance = auth.instance;

  if (!track?.catalogId) {
    return { ok: false, message: 'Missing Apple Music catalog id.' };
  }

  try {
    if (typeof instance.setQueue === 'function') {
      await instance.setQueue({ song: track.catalogId });
    }

    if (typeof instance.play === 'function') {
      await instance.play();
    }

    return { ok: true, instance };
  } catch (error) {
    return { ok: false, message: error?.message || 'Apple Music playback failed.' };
  }
}
