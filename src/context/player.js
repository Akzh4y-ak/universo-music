import { createContext, useContext } from 'react';

export const PlayerContext = createContext(null);
export const PlayerProgressContext = createContext(null);

export function usePlayer() {
  return useContext(PlayerContext);
}

export function usePlayerProgress() {
  return useContext(PlayerProgressContext);
}
