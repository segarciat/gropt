/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE stores(
      id SERIAL NOT NULL PRIMARY KEY,
      store_name VARCHAR NOT NULL,
      location POINT
    );
  `)
}

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE stores;
  `)
}
