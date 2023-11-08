import tap from "tap"
import { multiWordParser } from "../../../src/commands/parsers.js"

tap.test("multi word parser", async function(t) {
  tap.test("when previous is undefined, returns only current", async function(t) {
    t.equal(multiWordParser("hello", undefined), "hello")
  })

  tap.test("when previous is defined, returns 'previous current'.", async function(t) {
    t.equal(multiWordParser("world", "hello"), "hello world")
  })
})