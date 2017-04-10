import Tracker from './tracker';

export default function reactiveProxy(initial = {}, compare = (a, b) => a === b, changeCallback) {
  const deps = {};
  const ensureDep = (name) => {
    if (!deps[name]) deps[name] = new Tracker.Dependency();
    return deps[name];
  };
  return new Proxy(initial, {
    get: (obj, key) => {
      const dep = ensureDep(key);
      dep.depend();
      return obj[key];
    },
    set: (obj, key, value) => {
      const dep = ensureDep(key);
      const oldValue = obj[key];
      const changed = () => {
        dep.changed();
        if (changeCallback) changeCallback(key, value);
      };

      obj[key] = typeof value === 'object'
        ? reactiveProxy(value, compare, changed)
        : value;

      if (!compare(oldValue, value)) changed();
      return value || true;
    },
    deleteProperty: (obj, key) => {
      const dep = ensureDep(key);
      const exists = key in obj;
      delete obj[key];
      const changed = () => {
        dep.changed();
        if (changeCallback) changeCallback(key);
      };

      if (exists) changed();
      return true;
    },
  });
}
