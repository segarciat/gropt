/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TYPE measurement_unit AS ENUM ('oz', 'lb', 'g', 'cups');
  `)
}

exports.down = pgm => {
  pgm.sql(`
    DROP TYPE measurement_unit;
  `)
}
