import tap from "tap"
import { dateParser, idParser, multiWordParser, positiveNumberParser } from "../../../src/commands/parsers.js"
import { InvalidArgumentError } from "commander"

tap.test("multi word parser", async function(t) {
  tap.test("when previous is undefined, returns only current", async function(t) {
    t.equal(multiWordParser("hello", undefined), "hello")
  })

  tap.test("when previous is defined, returns 'previous current'.", async function(t) {
    t.equal(multiWordParser("world", "hello"), "hello world")
  })
})

tap.test("number parser", async function(t) {
  tap.test("when given non-number string, throws", async function(t) {
    t.throws(() => positiveNumberParser("two"), InvalidArgumentError)
  })

  tap.test("when given numerical string, parses as float", async function(t) {
    t.equal(positiveNumberParser("1.5"), 1.5)
  })
})

tap.test("id parser", async function(t) {
  tap.test("when given non-number positive integer, throws", async function(t) {
    t.throws(() => idParser("two"), InvalidArgumentError)
    t.throws(() => idParser("-2"), InvalidArgumentError)
    t.throws(() => idParser("1.5"), InvalidArgumentError)
  })

  tap.test("when given positive integer, returns its value as a number", async function(t) {
    t.equal(idParser("7"), 7)
  })
})

tap.test("date parser", async function(t) {
  tap.test("when given string in YYYY-MM-DD format, parses correctly", async function(t) {
    t.same(dateParser("2000-11-27"), new Date("2000-11-27"))
  })

  tap.test("when given invalid string, throws", async function(t) {
    t.throws(() => dateParser("hello"), InvalidArgumentError)
  })
})