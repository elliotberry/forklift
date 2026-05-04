import { useCallback, useEffect, useState } from 'react';

const isBrowser = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const parseStoredValue = (rawValue, fallbackValue) => {
  if (rawValue === null) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    if (rawValue === 'true') {
      return true;
    }

    if (rawValue === 'false') {
      return false;
    }

    if (rawValue === 'null') {
      return null;
    }

    if (rawValue === 'undefined') {
      return undefined;
    }

    const numericValue = Number(rawValue);
    if (!Number.isNaN(numericValue) && rawValue.trim() !== '') {
      return numericValue;
    }

    return rawValue;
  }
};

const resolveInitialValue = (initialValue) => (
  typeof initialValue === 'function' ? initialValue() : initialValue
);

const useLocalStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    const initial = resolveInitialValue(initialValue);

    if (!isBrowser()) {
      return initial;
    }

    return parseStoredValue(window.localStorage.getItem(key), initial);
  });

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    const initial = resolveInitialValue(initialValue);
    setStoredValue(parseStoredValue(window.localStorage.getItem(key), initial));

    return undefined;
  }, [initialValue, key]);

  const setValue = useCallback((valueOrUpdater) => {
    setStoredValue((currentValue) => {
      const nextValue = typeof valueOrUpdater === 'function'
        ? valueOrUpdater(currentValue)
        : valueOrUpdater;

      if (isBrowser()) {
        window.localStorage.setItem(key, JSON.stringify(nextValue));
      }

      return nextValue;
    });
  }, [key]);

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    const handleStorage = (event) => {
      if (event.storageArea !== window.localStorage || event.key !== key) {
        return;
      }

      const initial = resolveInitialValue(initialValue);
      setStoredValue(parseStoredValue(event.newValue, initial));
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [initialValue, key]);

  return [storedValue, setValue];
};

export default useLocalStorage;
