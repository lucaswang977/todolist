import { useState } from 'react';

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (newValue: T) => void] => {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  const saveValue = (newValue: T) => {
    try {
      const valueToSave =
        newValue instanceof Function ? newValue(value) : newValue;
      window.localStorage.setItem(key, JSON.stringify(valueToSave));
      setValue(valueToSave);
    } catch (error) {
      console.log(error);
    }
  };

  return [value, saveValue];
};
