# Changelog

## [3.0.0](https://github.com/hemjs/notions/compare/2.0.0...3.0.0) (2026-11-04)

### ⚠ BREAKING CHANGES

* exports limits imports to the package root and package.json.
* **lang:** isEmpty no longer treats 0, 0n or false as empty by
  default, and no longer inspects array entries or object values, so [null]
  and { a: null } are non-empty. Empty Map and Set, zero-length binary data
  and invalid dates are now empty. isEmpty returns boolean rather than a type
  guard.
* **lang:** isPlainObject narrows to Record<Key, unknown>, and treats
  objects whose prototype has a null prototype as plain.
* **object:** omit now keeps symbol keys, and both helpers drop
  __proto__ keys. pick no longer copies non-enumerable properties, so
  pick(new Error('x'), ['message']) returns {}.
* **object:** omit returns Partial<Omit<T, K>> and pick returns
  Partial<Pick<T, K>>, so every property of the result is optional.
* **object:** the @hemjs/notions/object/omit and
  @hemjs/notions/object/pick module paths are removed. Import from the
  package root instead.
* **lang:** the EmptyLike, EmptyObject and Falsy types are removed.
* the package is ESM-only, targets ES2023 and requires Node.js 22.12 or later.
* **lang:** the value parameter is now required on all guards.

### Features

* **lang:** add isDefined, isError, isFiniteNumber, isPrimitive and isPromise ([fbbb26a](https://github.com/hemjs/notions/commit/fbbb26a8cfb88bcc1f316b7e399c3b897afcb352))
* **lang:** rework isEmpty and tighten type guards ([94adb9c](https://github.com/hemjs/notions/commit/94adb9c05ff4b405bd3d731620447863b46514c5))

### Bug Fixes

* **lang:** make isClass independent of toString overrides and formatting ([85dca3f](https://github.com/hemjs/notions/commit/85dca3fd87ed24568dc150a080762333b6341176))
* **lang:** recognize DOMException in isError ([69373d2](https://github.com/hemjs/notions/commit/69373d2800fb1fde487f35946656f26f3151854e))
* **object:** harden omit and pick and merge them into one module ([a9cf249](https://github.com/hemjs/notions/commit/a9cf249cffb1fe9b96ebb7cb2b6cf9649ad4d25c))

### Build System

* migrate to ESM, pnpm and Vitest ([d93a8eb](https://github.com/hemjs/notions/commit/d93a8ebce44fde149a5e635b7101fb241363667d))
