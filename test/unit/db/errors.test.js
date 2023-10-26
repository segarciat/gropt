import { UniqueConstraintError, DatabaseError as UnexpectedDatabaseError, errorCodes, wrapAndRethrowDbError } from '#src/db/errors.js'
import tap from 'tap'

tap.test('An database error is correctly wrapped according to its error code', function (t) {
  const uniqueConstraintError = new Error('Failed due to unique constraint violation')
  uniqueConstraintError.code = errorCodes.UNIQUE_CONSTRAINT

  const unexpectedError = new Error('unexpected error')
  unexpectedError.code = 'UNEXPECTED_ERROR'

  t.throws(() => wrapAndRethrowDbError(unexpectedError),
    UnexpectedDatabaseError
  )
  t.throws(() => wrapAndRethrowDbError(uniqueConstraintError),
    UniqueConstraintError)
  t.end()
})
