/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE products
    ALTER COLUMN brand SET NOT NULL;
  `)
}

exports.down = pgm => {
  pgm.sql(`
    ALTER TABLE products
    ALTER COLUMN brand DROP NOT NULL;
  `)
}
