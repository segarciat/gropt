import tap from 'tap'
import { parseNumberString as parsePositiveNumber } from '../../src/utils/validation.js'

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
