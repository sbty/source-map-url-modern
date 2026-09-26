# Modernization

## Changed

- Replaced Mocha 1, expect.js, and JSHint with the built-in `node:test` and
  `node:assert` modules.
- Added a licensed 0.4.1 fixture and differential Golden Master tests.
- Added Playwright smoke tests for Chromium, Firefox, and WebKit as a development
  dependency only.
- Added GitHub Actions coverage for Node.js 22, 24, and 26 on Linux, plus Node.js
  24 on Windows and macOS.
- Updated npm metadata for `source-map-url-modern`, added an explicit file list,
  Node engine policy, an `exports` entry, and TypeScript declarations without a
  TypeScript build.
- Removed Bower, Component, xpkg, Testling, Travis CI, JSHint, and `.npmignore`
  metadata.
- Added compatibility, investigation, migration, and support documentation.

## Deliberately unchanged

- `source-map-url.js` is byte-for-byte the upstream 0.4.1 implementation.
- The public regex source, flags, capture groups, and state behavior are unchanged.
- UMD, CommonJS, AMD, and the `sourceMappingURL` browser global are unchanged.
- Known regex quirks, including matches in string literals, are preserved.
- Runtime dependencies remain zero.
- No build system, parser, decoder, resolver, URL validator, or new runtime API
  was added.

## Support policy

The package supports maintained Node.js lines beginning with Node.js 22. As of
September 2026, Node.js 22 and 24 are LTS and Node.js 26 is Current. CI tracks
all three. Browser CI uses the current Playwright-provided Chromium, Firefox,
and WebKit builds.

The package stays as one production JavaScript file. Compatibility changes must
first be expressed as differential tests against the original fixture.
