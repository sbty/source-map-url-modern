const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const test = require("node:test")
const vm = require("node:vm")

const modern = require("..")
const original = require("./fixtures/original-source-map-url")

const inputs = [
  "",
  "code",
  "//# sourceMappingURL=foo.js.map",
  "//@ sourceMappingURL=foo.js.map",
  "/*# sourceMappingURL=foo.css.map */",
  "/*@ sourceMappingURL=foo.css.map */",
  "/*\n# sourceMappingURL=foo.css.map\n*/",
  "/*\r\n//# sourceMappingURL=foo.css.map\r\n*/",
  "/*! Library Name v1.0.0\n//# sourceMappingURL=foo.js.map\n*/\n(function(){})",
  "//# sourceMappingURL=",
  "//# sourceMappingURL=../foo.js.map",
  "//# sourceMappingURL=/foo.js.map",
  "//# sourceMappingURL=https://example.com/foo.js.map",
  "//# sourceMappingURL=//cdn.example.com/foo.js.map",
  "//# sourceMappingURL=data:application/json;base64,AAAA",
  "//# sourceMappingURL=foo.js.map?x=1",
  "//# sourceMappingURL=foo.js.map#fragment",
  "//# sourceMappingURL=foo%20bar.js.map",
  "//# sourceMappingURL=日本語.map",
  "//# sourceMappingURL=é-😀.map",
  "//# sourceMappingURL=foo bar.js.map",
  "//#sourceMappingURL=foo",
  "//# sourceMappingURL =foo",
  "//# sourceMappingURL= foo",
  "//# sourceMappingURL\t=foo",
  "//#  sourceMappingURL=foo",
  "//# sourceMappingURL==foo",
  "// # sourceMappingURL=foo",
  "/* # sourceMappingURL=foo */",
  "var text = \"//# sourceMappingURL=fake.map\"",
  "const text = `//# sourceMappingURL=fake.map`",
  "//# sourceMappingURL=first.js.map\n//# sourceMappingURL=second.js.map",
  "code\r//# sourceMappingURL=foo",
  "code\r\n//# sourceMappingURL=foo\r\n",
  "code\n//# sourceMappingURL=foo\n"
]

function snapshotMatch(regex, input) {
  regex.lastIndex = 7
  const match = regex.exec(input)
  return {
    match: match && Array.from(match),
    index: match && match.index,
    lastIndex: regex.lastIndex
  }
}

test("the documented API surface is present", () => {
  for (const name of ["getFrom", "existsIn", "removeFrom", "insertBefore"]) {
    assert.equal(typeof modern[name], "function")
  }
  assert.ok(modern.regex instanceof RegExp)
})

test("regex pattern, flags, captures, index, and lastIndex match 0.4.1", () => {
  assert.equal(modern.regex.source, original.regex.source)
  assert.equal(modern.regex.flags, original.regex.flags)
  for (const input of inputs) {
    assert.deepEqual(snapshotMatch(modern.regex, input), snapshotMatch(original.regex, input), input)
  }
})

test("all string APIs match 0.4.1 exactly", () => {
  for (const input of inputs) {
    assert.equal(modern.getFrom(input), original.getFrom(input), `getFrom: ${JSON.stringify(input)}`)
    assert.equal(modern.existsIn(input), original.existsIn(input), `existsIn: ${JSON.stringify(input)}`)
    assert.equal(modern.removeFrom(input), original.removeFrom(input), `removeFrom: ${JSON.stringify(input)}`)
    for (const value of ["", "\n", "追加😀"]) {
      assert.equal(
        modern.insertBefore(input, value),
        original.insertBefore(input, value),
        `insertBefore: ${JSON.stringify(input)}, ${JSON.stringify(value)}`
      )
    }
  }
})

test("multiple comments preserve the first-match behavior", () => {
  const input = "//# sourceMappingURL=first.js.map\n//# sourceMappingURL=second.js.map"
  assert.equal(modern.getFrom(input), "first.js.map")
  assert.equal(modern.removeFrom(input), "//# sourceMappingURL=second.js.map")
  assert.equal(modern.insertBefore(input, "inserted\n"),
    "inserted\n//# sourceMappingURL=first.js.map\n//# sourceMappingURL=second.js.map")
})

test("public regex state is unchanged by API calls", () => {
  modern.regex.lastIndex = 11
  modern.getFrom("//# sourceMappingURL=x")
  modern.existsIn("//# sourceMappingURL=x")
  modern.removeFrom("//# sourceMappingURL=x")
  modern.insertBefore("//# sourceMappingURL=x", "y")
  assert.equal(modern.regex.lastIndex, 11)
})

test("CommonJS, AMD, and browser global UMD branches work", () => {
  const source = fs.readFileSync(path.join(__dirname, "..", "source-map-url.js"), "utf8")
  let amdFactory
  const define = factory => { amdFactory = factory }
  define.amd = {}
  vm.runInNewContext(source, { define })
  assert.equal(amdFactory().getFrom("//# sourceMappingURL=amd.map"), "amd.map")

  const browser = {}
  vm.runInNewContext(source, browser)
  assert.equal(browser.sourceMappingURL.getFrom("//# sourceMappingURL=browser.map"), "browser.map")
})

test("large hostile-looking inputs complete without pathological slowdown", { timeout: 5000 }, () => {
  for (const input of [
    "x".repeat(5 * 1024 * 1024),
    "/*" + " ".repeat(1024 * 1024),
    "/".repeat(1024 * 1024),
    "*".repeat(1024 * 1024)
  ]) {
    assert.equal(modern.existsIn(input), false)
  }
})
