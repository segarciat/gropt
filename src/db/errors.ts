// import pg from 'pg'

// /**
//  * Reference to PostgreSQL error codes: https://www.postgresql.org/docs/15/errcodes-appendix.html
//  */

// export const errorCodes = {
//   UNIQUE_CONSTRAINT: '23505'
// }

// export class DatabaseError extends Error {
//   constructor (message, code, label, cause) {
//     super(message, { cause })
//     this.code = code
//     this.label = label
//   }

//   get name () {
//     return `${this.label} [ ${this.code} ]`
//   }
// }

// export class UniqueConstraintError extends DatabaseError {
//   constructor (cause) {
//     super('Unique constraint violated', errorCodes.UNIQUE_CONSTRAINT, 'UniqueConstraintError', cause)
//   }
// }

// export function wrapAndRethrowDbError (err: pg.DatabaseError): DatabaseError {
//   switch (err.code) {
//     case errorCodes.UNIQUE_CONSTRAINT:
//       return new UniqueConstraintError(err.cause)
//     default:
//       return new DatabaseError('Unexpected database error', err.code, 'DatabaseError', err.cause)
//   }
// }
