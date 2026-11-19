// Saves which trophies are earned plus the reader's settings in localStorage.
const STORAGE_KEY = 'leonida-ledger/v1';
const DEFAULT_SETTINGS = { spoiler: 'story', view: 'checklist', kind: 'all', grade: 'all', earned: 'all', selected: 'Positive Mental Attitude' };

export function createProgressStore(storage = window.localStorage) {
  let state = readState(storage);
  const listeners = new Set();

  function persist() {
    storage.setItem(STORAGE_KEY, JSON.stringify({ earned: [...state.earned], settings: state.settings }));
    for (const listener of listeners) listener(state);
  }

  return {
    get earned() { return state.earned; },
    get settings() { return state.settings; },
    isEarned: (name) => state.earned.has(name),
    toggle(name) {
      if (state.earned.has(name)) state.earned.delete(name);
      else state.earned.add(name);
      persist();
    },
    replaceEarned(names) {
      state.earned = new Set(names);
      persist();
    },
    updateSettings(patch) {
      state.settings = { ...state.settings, ...patch };
      persist();
    },
    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

function readState(storage) {
  try {
    const saved = JSON.parse(storage.getItem(STORAGE_KEY) ?? '{}');
    return { earned: new Set(saved.earned ?? []), settings: { ...DEFAULT_SETTINGS, ...(saved.settings ?? {}) } };
  } catch {
    return { earned: new Set(), settings: { ...DEFAULT_SETTINGS } };
  }
}
