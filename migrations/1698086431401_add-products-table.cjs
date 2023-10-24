/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE products (
      id SERIAL PRIMARY KEY,
      product_name varchar NOT NULL,
      brand varchar,
      UNIQUE(product_name, brand)
    );
  `)
}

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE products;
  `)
}
