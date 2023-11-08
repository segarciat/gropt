import tap from "tap"
import { multiWordParser } from "../../src/commands/parsers.js"

tap.test("multiWordParser", async function(t) {
  tap.test("current has a value but previous does not", async function(t) {
    t.equal(multiWordParser("hello", undefined), "hello")
  })

  tap.test("both current and previous have a value", async function(t) {
    t.equal(multiWordParser("world", "hello"), "hello world")
  })
})