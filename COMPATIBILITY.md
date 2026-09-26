# Compatibility

`source-map-url-modern` preserves the behavior of `source-map-url` 0.4.1.

| Area | Compatibility |
| --- | --- |
| `getFrom()` | Exact return-value comparison against 0.4.1, including `null` and empty URLs |
| `existsIn()` | Exact boolean comparison against 0.4.1 |
| `removeFrom()` | Exact returned-string comparison, including surrounding LF/CRLF and whitespace |
| `insertBefore()` | Exact returned-string comparison, including empty and Unicode insertion strings |
| `regex` | Same source, no flags, same two capture groups, match text/index, and non-global `lastIndex` behavior |
| Line comments | `//#` and legacy `//@` forms are preserved |
| Block comments | `/*# ... */`, `/*@ ... */`, multiline, and mixed block/line forms are preserved |
| Multiple comments | The first matching comment wins; only the first is removed |
| Whitespace | The historical exact-space and no-space-around-`=` rules are preserved |
| Newlines | LF and CRLF are not normalized |
| Unicode | Returned unchanged |
| Data URLs | Returned unchanged; no decoding or validation |
| CommonJS | `require("source-map-url-modern")` returns the API object |
| AMD | The existing UMD `define(factory)` branch is preserved |
| Browser global | The existing global name `sourceMappingURL` is preserved |

## Intentional quirks

This is regex-based string processing, not JavaScript or CSS parsing. A matching
sequence inside a string or template literal is treated as a comment. A URL is
captured only until whitespace or a quote. Trailing whitespace following a
matched comment is part of the match. These behaviors are covered by the Golden
Master and will not change in a compatible release.

The undocumented `_innerRegex` property also remains because the production
file is unchanged, but the compatibility policy guarantees the five documented
APIs listed above.

See [ANALYSIS.md](ANALYSIS.md) for the full baseline.
