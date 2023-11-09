/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE stores
    DROP COLUMN location;
  `)
}

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE stores
    ADD COLUMN location point;
  `)
}
