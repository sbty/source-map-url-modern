const path = require("node:path")
const { test, expect } = require("@playwright/test")

test("UMD browser global exposes the compatible API", async ({ page }) => {
  await page.addScriptTag({ path: path.join(__dirname, "..", "..", "source-map-url.js") })
  const result = await page.evaluate(() => ({
    keys: ["getFrom", "existsIn", "removeFrom", "insertBefore", "regex"]
      .map(key => [key, typeof sourceMappingURL[key]]),
    url: sourceMappingURL.getFrom("/*# sourceMappingURL=日本語.map */"),
    exists: sourceMappingURL.existsIn("//# sourceMappingURL=x.map"),
    removed: sourceMappingURL.removeFrom("code\r\n//# sourceMappingURL=x.map\r\n"),
    inserted: sourceMappingURL.insertBefore("//# sourceMappingURL=x.map", "code\n"),
    flags: sourceMappingURL.regex.flags
  }))

  expect(result.keys).toEqual([
    ["getFrom", "function"],
    ["existsIn", "function"],
    ["removeFrom", "function"],
    ["insertBefore", "function"],
    ["regex", "object"]
  ])
  expect(result.url).toBe("日本語.map")
  expect(result.exists).toBe(true)
  expect(result.removed).toBe("code\r\n")
  expect(result.inserted).toBe("code\n//# sourceMappingURL=x.map")
  expect(result.flags).toBe("")
})
