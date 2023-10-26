import tap from 'tap'
import 'dotenv/config'
import Context from '../context.js'

let client
let Purchases
let Products
let Stores

tap.before(async function () {
  client = await Context.getClientFromPool()
  Purchases = await Context.mockDbAt('#src/db/repositories/purchases.js', client)
  Products = await Context.mockDbAt('#src/db/repositories/products.js', client)
  Stores = await Context.mockDbAt('#src/db/repositories/stores.js', client)
})

tap.after(async function () {
  await client.release()
})

tap.beforeEach(async function () {
  await client.query('BEGIN;')
})

tap.afterEach(async function () {
  await client.query('ROLLBACK;')
})

tap.test('Creating purchases in databases succeeds if related store and product exist.', async function (t) {
  // Arrange
  const product = await Products.create({ productName: 'Apples' })
  const store = await Stores.create({ storeName: 'Supermarket' })
  const purchaseDetails = {
    productId: product.id,
    storeId: store.id,
    price: 15.0,
    amount: 7,
    unit: 'lb',
    purchasedOn: new Date()
  }

  // Act
  const purchase = await Purchases.create(purchaseDetails)

  // Assert
  t.match(product, { id: Number })
  t.match(store, { id: Number })
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })
})

tap.test('Creating a duplicate purchase throws an exception', async function (t) {
  // Arrange
  const product = await Products.create({ productName: 'Apples' })
  const store = await Stores.create({ storeName: 'Supermarket' })
  const purchaseDetails = {
    productId: product.id,
    storeId: store.id,
    price: 15.0,
    amount: 7,
    unit: 'lb',
    purchasedOn: new Date()
  }

  // Act
  const purchase = await Purchases.create(purchaseDetails)

  // Assert
  t.rejects(Purchases.create(purchaseDetails))
  t.match(purchase, {
    id: Number,
    ...purchaseDetails
  })
})
