/* eslint-disable camelcase */

exports.shorthands = undefined

exports.up = pgm => {
  pgm.sql(`
    CREATE TABLE purchases (
      id SERIAL NOT NULL PRIMARY KEY,
      product_id INTEGER NOT NULL REFERENCES products (id) ON DELETE CASCADE,
      store_id INTEGER NOT NULL REFERENCES stores (id) ON DELETE CASCADE,
      purchased_on DATE NOT NULL DEFAULT CURRENT_DATE,
      price REAL NOT NULL,
      amount REAL NOT NULL,
      unit MEASUREMENT_UNIT,
      UNIQUE(product_id, store_id, purchased_on)
    );
  `)
}

exports.down = pgm => {
  pgm.sql(`
    DROP TABLE purchases;
  `)
}
