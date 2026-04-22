export function readStoredJson(key, fallbackValue) {
  const storedValue = localStorage.getItem(key);

  if (!storedValue) {
    return fallbackValue;
  }

  try {
    return JSON.parse(storedValue);
  } catch (error) {
    console.warn(`Ignoring invalid local storage value for "${key}".`, error);
    localStorage.removeItem(key);
    return fallbackValue;
  }
}

export function readStoredNumber(key, fallbackValue) {
  const storedValue = localStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  const parsedValue = Number(storedValue);
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

export function readStoredString(key, fallbackValue = '') {
  const storedValue = localStorage.getItem(key);
  return storedValue === null ? fallbackValue : storedValue;
}
