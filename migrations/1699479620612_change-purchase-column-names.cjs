/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    ALTER TABLE purchases
    RENAME COLUMN price TO cost;

    ALTER TABLE purchases
    RENAME COLUMN unit TO units;

    ALTER TABLE purchases
    RENAME COLUMN purchased_on TO date_purchased;
  `)
}

exports.down = pgm => {
  pgm.sql(`
  ALTER TABLE purchases
  RENAME COLUMN cost TO price;

  ALTER TABLE purchases
  RENAME COLUMN units TO unit;

  ALTER TABLE purchases
  RENAME COLUMN date_purchased TO purchased_on;
  `)
}
