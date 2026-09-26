# Investigation and compatibility baseline

## Scope and baseline

This repository is a fork of `lydell/source-map-url` 0.4.1. The upstream
repository is archived and describes the package as deprecated. Investigation
covered every repository file, all commits affecting `source-map-url.js`, the
upstream issues and pull requests, and the upstream fork list.

The untouched 0.4.1 test suite has 77 tests. On Node.js 22.18.0 its JSHint step
passes and all 77 tests pass when Mocha's internal runner is invoked directly.
The Mocha 1.17 launcher fails with `spawn EPERM`, and installing the old toolchain
reports deprecated transitive packages and 9 audit findings (4 critical). This
supports replacing the test toolchain, not the production implementation.

## Production implementation

`source-map-url.js` is one dependency-free UMD file. Its branch order is:

1. AMD: when `define` is a function and `define.amd` is truthy, `define(factory)`
   is called.
2. CommonJS: when `exports` is an object, `module.exports = factory()` is used.
3. Browser global: otherwise the result is assigned to `sourceMappingURL` on
   the UMD root.

The five compatibility APIs are:

- `getFrom(code)`: returns the first captured URL, an empty string for an empty
  URL, or `null` when there is no match.
- `existsIn(code)`: reports whether the regex matches.
- `removeFrom(code)`: removes only the first match, including whitespace that
  the regex consumes after it.
- `insertBefore(code, value)`: inserts immediately before the first match, or
  appends when there is no match.
- `regex`: the actual `RegExp` instance used by all four methods.

`_innerRegex` is also exposed by 0.4.1, although it is undocumented and outside
the requested five-API contract. It remains present because production code is
unchanged.

## Regex contract

The inner expression is:

```text
[#@] sourceMappingURL=([^\s'"]*)
```

The public expression has no flags and is non-global. Its source is constructed
from block and line alternatives. Capture group 1 is the block-comment URL;
capture group 2 is the line-comment URL. `match[0]` includes whitespace after
the comment. Because the expression is not global or sticky, `exec`, `test`, and
the public methods do not update `lastIndex`; even a caller-assigned `lastIndex`
is preserved.

The regex requires exactly one ASCII space between `#`/`@` and
`sourceMappingURL`, and no whitespace around `=`. It accepts both `#` and legacy
`@`, line comments, single-line block comments, multiline block comments, and
the historical mixed `/*\n//# ...\n*/` form. It treats URL content as arbitrary
non-whitespace text except single and double quotes. It does not validate URLs.

## Observable edge cases

- Multiple comments: the first match wins for every API. `removeFrom` removes
  only that first match.
- Whitespace: trailing whitespace following the first match is part of the
  match. This can include the newline and indentation before later content.
- Newlines: LF and CRLF are preserved as ordinary string content; the multiline
  block form specifically allows LF or CRLF, not bare CR at that position.
- Unicode, query strings, fragments, percent escapes, absolute URLs, relative
  URLs, protocol-relative URLs, and data URLs are returned without decoding.
- A literal space terminates the captured URL.
- Regex-based false positives are intentional compatibility behavior. Patterns
  inside string literals or template literals are matched.
- No parser distinguishes JavaScript from CSS; the same regex handles both.

## Test coverage before modernization

The original tests covered all four methods, detachable methods, documented
comment forms, LF/CRLF, empty URLs, no-match cases, embedded/non-trailing
comments, liberal block whitespace, `@`, and the exposed regex. They did not
fully freeze direct-regex captures/index/state, multiple-comment selection,
the broader URL corpus, string/template false positives, Unicode, performance,
or the UMD branches in isolation.

The Golden Master adds those missing cases and compares every return string
byte-for-byte with an MIT-licensed 0.4.1 fixture.

## History and upstream context

- 0.3.0 removed `set`, renamed `get`/`remove`, and intentionally stopped
  managing surrounding newlines.
- 0.4.0 accepted non-trailing comments to support real libraries and browsers
  (issue #2 and merged PR #3).
- 0.4.1 changed package exclusions only; it did not change runtime behavior.
- Open issue #5 reports matches inside strings. Fixing it would require parser
  semantics and break compatibility, so this project documents and tests it.
- Open issue #4 asks for URL replacement. That is a new feature and is out of
  scope.
- Closed PR #7 proposed ESM conversion and was not merged. This project keeps
  CommonJS and UMD; native ESM can import the CommonJS default without a second
  production build.
- The README deprecates both this package and `source-map-resolve`, suggests
  `convert-source-map` for new work, and characterizes this package as wrappers
  around regexes. This fork exists specifically for compatibility maintenance,
  not to absorb `source-map-resolve` functionality.

## ReDoS check

On Node.js 22.18.0, representative 1 MB and 5 MB no-match inputs, long
whitespace, an unterminated block comment, and long runs of `/` or `*` complete
in single-digit milliseconds. A generous 5-second automated regression test
guards these shapes. No ReDoS behavior was observed.

## Implementation decision and Golden Master plan

The production file is already the smallest implementation that preserves the
contract. Rewriting it would add risk without improving security or support.
Therefore `source-map-url.js` remains byte-for-byte unchanged.

The compatibility suite freezes:

1. all five public APIs;
2. regex source, flags, capture arrays, match index, and `lastIndex`;
3. line/block, `#`/`@`, whitespace, LF/CRLF, Unicode, data and ordinary URLs;
4. exact `removeFrom` and `insertBefore` strings;
5. first-match behavior with multiple comments;
6. known false positives;
7. CommonJS, AMD, and browser-global UMD loading;
8. differential behavior against the original fixture; and
9. large adversarial-looking inputs.
