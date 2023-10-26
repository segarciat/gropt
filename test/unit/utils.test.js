import tap from 'tap'
import { parsePositiveNumber, toCamelCase } from '../../src/utils.js'

tap.test('Parses numerical string to number', function (t) {
  t.equal(parsePositiveNumber('1.5'), 1.5)
  t.equal(parsePositiveNumber('2'), 2)
  t.end()
})

tap.test('Throws exception when parsing non-positive number string', function (t) {
  t.throws(() => parsePositiveNumber('two'))
  t.throws(() => parsePositiveNumber('0'))
  t.end()
})

tap.test('Converts object keys to camel case', function (t) {
  t.same(toCamelCase({ first_name: 'john', last_name: 'doe' }), {
    firstName: 'john',
    lastName: 'doe'
  })

  t.same(toCamelCase({ myAge: 1, myColor: 'blue' }), {
    myAge: 1,
    myColor: 'blue'
  })

  t.same(toCamelCase(null), null)
  t.same(toCamelCase(undefined), undefined)
  t.end()
})
