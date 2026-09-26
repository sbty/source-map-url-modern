# source-map-url-modern

A maintained, dependency-free compatibility implementation of the archived
[`source-map-url`](https://github.com/lydell/source-map-url) package.

This package intentionally remains a small regex wrapper. It is for existing
code that needs the old API and output behavior on maintained Node.js and modern
browsers. For new source-map transformation work, consider a library designed
for that broader task.

## Compatibility policy

The four methods and public `regex` preserve `source-map-url` 0.4.1 behavior.
Changes are checked against a licensed copy of the original implementation,
including exact returned strings, capture groups, match index, and regex state.
Known regex quirks are retained rather than replaced with parser semantics.

See [COMPATIBILITY.md](COMPATIBILITY.md) for the complete matrix.

## Installation

```sh
npm install source-map-url-modern
```

## CommonJS

```js
const sourceMappingURL = require("source-map-url-modern")
```

## ESM

Node.js can import the CommonJS default without a second build:

```js
import sourceMappingURL from "source-map-url-modern"
```

## Browser global

Load `source-map-url.js` directly. The UMD bundle exposes
`window.sourceMappingURL`.

```html
<script src="source-map-url.js"></script>
<script>
  console.log(sourceMappingURL.getFrom("//# sourceMappingURL=app.js.map"))
</script>
```

## AMD

The original anonymous UMD definition is preserved:

```js
define(["source-map-url-modern"], function(sourceMappingURL) {
  return sourceMappingURL.existsIn("//# sourceMappingURL=app.js.map")
})
```

## API

### `sourceMappingURL.getFrom(code)`

Returns the URL from the first matching comment, `""` for an empty URL, or
`null` when there is no match.

### `sourceMappingURL.existsIn(code)`

Returns whether a matching comment exists.

### `sourceMappingURL.removeFrom(code)`

Removes the first matching comment and returns the exact resulting string.

### `sourceMappingURL.insertBefore(code, value)`

Inserts `value` immediately before the first matching comment. If there is no
match, appends `value` to `code`.

### `sourceMappingURL.regex`

The same non-global regular expression exposed by 0.4.1. Its pattern, empty
flags, two capture groups, match index, and `lastIndex` behavior are compatibility
tested. Do not assume that it parses JavaScript or CSS; it intentionally matches
compatible text patterns, including patterns inside string literals.

## Migration from `source-map-url`

Change the dependency and require target:

```diff
- const sourceMappingURL = require("source-map-url")
+ const sourceMappingURL = require("source-map-url-modern")
```

To keep existing `require("source-map-url")` calls after this package is
published, npm aliasing can map the old local dependency name to the new package:

```json
{
  "dependencies": {
    "source-map-url": "npm:source-map-url-modern@^1.0.0"
  }
}
```

## Support

- Node.js: maintained lines from Node.js 22 onward; CI covers 22, 24, and 26.
- Browsers: current Chromium, Firefox, and WebKit through Playwright.
- Runtime dependencies: zero.

## Known differences

The runtime implementation has no intended behavioral differences from 0.4.1.
Package name, metadata, supported environments, tests, CI, and documentation are
modernized. The minimum supported Node.js version is explicit; the original
package did not state one.

## Development

```sh
npm test
npx playwright install
npm run test:browser
npm pack --dry-run
```

## License

MIT. Original copyright is retained in [LICENSE](LICENSE).
