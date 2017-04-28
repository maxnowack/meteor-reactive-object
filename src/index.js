import Tracker from './tracker';

const internalKeys = ['constructor', '__proto__'];

export function isSupported() {
  return typeof Proxy !== 'undefined';
}

export default function reactiveProxy(initial = {}, compare = (a, b) => a === b, changeCallback) {
  if (!isSupported()) throw new Error('ES6 proxies are not supported by your environment!');

  const deps = {};
  const ensureDep = (name) => {
    if (!deps[name]) deps[name] = new Tracker.Dependency();
    return deps[name];
  };
  return new Proxy(initial, {
    get: (obj, key) => {
      if (!internalKeys.includes(key)) {
        const dep = ensureDep(key);
        dep.depend();
      }
      return obj[key];
    },
    set: (obj, key, value) => {
      const oldValue = obj[key];
      const changed = () => {
        if (!internalKeys.includes(key)) {
          const dep = ensureDep(key);
          dep.changed();
        }
        if (changeCallback) changeCallback(key, value);
      };

      obj[key] = typeof value === 'object'
        ? reactiveProxy(value, compare, changed)
        : value;

      if (!compare(oldValue, value)) changed();
      return value || true;
    },
    deleteProperty: (obj, key) => {
      const exists = key in obj;
      delete obj[key];
      const changed = () => {
        if (!internalKeys.includes(key)) {
          const dep = ensureDep(key);
          dep.changed();
        }
        if (changeCallback) changeCallback(key);
      };

      if (exists) changed();
      return true;
    },
  });
}
