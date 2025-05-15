export const STORAGE_KEY = 'vendingMachineState';

export function saveStateToStorage<T>(state: T) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function loadStateFromStorage<T>(): T | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : null;
}

export function clearStorage() {
  localStorage.removeItem(STORAGE_KEY);
}
