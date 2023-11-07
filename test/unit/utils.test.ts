import tap from 'tap'
import { toCamelCase } from '../../src/utils.js'

await tap.test('Converts object keys to camel case', function (t) {
  t.same(toCamelCase({ first_name: 'john', last_name: 'doe' }), {
    firstName: 'john',
    lastName: 'doe'
  })

  t.same(toCamelCase({ myAge: 1, myColor: 'blue' }), {
    myAge: 1,
    myColor: 'blue'
  })

  // t.same(toCamelCase(null), null)
  t.same(toCamelCase(undefined), undefined)
  t.end()
})
