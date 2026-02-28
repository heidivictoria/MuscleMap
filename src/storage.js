// Storage polyfill
// In Claude artifacts, window.storage is available.
// Outside of Claude, we fall back to localStorage.

if (typeof window !== 'undefined' && !window.storage) {
  window.storage = {
    async get(key) {
      try {
        const value = localStorage.getItem(`musclemap:${key}`);
        if (value === null) throw new Error('Key not found');
        return { key, value };
      } catch (e) {
        throw e;
      }
    },
    async set(key, value) {
      try {
        localStorage.setItem(`musclemap:${key}`, value);
        return { key, value };
      } catch (e) {
        throw e;
      }
    },
    async delete(key) {
      try {
        localStorage.removeItem(`musclemap:${key}`);
        return { key, deleted: true };
      } catch (e) {
        throw e;
      }
    },
    async list(prefix = '') {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k.startsWith(`musclemap:${prefix}`)) {
          keys.push(k.replace('musclemap:', ''));
        }
      }
      return { keys };
    },
  };
}
