# Changelog

## 1.0.0

### Compatibility

- Preserved `getFrom`, `existsIn`, `removeFrom`, `insertBefore`, and `regex`
  behavior from `source-map-url` 0.4.1.
- Preserved UMD, CommonJS, AMD, and the `sourceMappingURL` browser global.
- Preserved line/block comments, `#`/`@`, exact whitespace/newline behavior,
  Unicode, data URLs, first-match behavior, and known regex quirks.

### Implementation

- Kept `source-map-url.js` byte-for-byte unchanged.
- Kept runtime dependencies at zero.
- Added TypeScript declarations without a build step.

### Testing

- Replaced the legacy Mocha/expect.js/JSHint stack with `node:test` and
  `node:assert`.
- Added an original 0.4.1 fixture, differential Golden Master coverage, regex
  state checks, UMD checks, large-input regression coverage, and Playwright
  browser tests.

### CI

- Added GitHub Actions for maintained Node.js releases on Linux, Windows, and
  macOS.
- Added Chromium, Firefox, and WebKit jobs.

### Packaging

- Renamed the package to `source-map-url-modern`.
- Added explicit exports, package files, supported Node.js engines, repository
  metadata, and zero-runtime-dependency packaging.
- Removed obsolete Bower, Component, xpkg, Testling, Travis CI, and JSHint
  configuration.

### Documentation

- Added compatibility, modernization, migration, npm alias, support, and known
  difference documentation.

## Upstream history

This project begins from `source-map-url` 0.4.1. See the upstream history at
<https://github.com/lydell/source-map-url/blob/master/changelog.md>.
