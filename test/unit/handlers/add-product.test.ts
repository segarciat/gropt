import tap from 'tap'
import { DBConnection } from '../../../src/types.js'
import { Product } from '../../../src/repositories/products.js'
import { AddProductHandlerOptions } from '../../../src/commands/add-product.js'

await tap.test('add product handler should add product to db', async function (t) {
  // Arrange
  const product: AddProductHandlerOptions = {
    productName: 'Bell Peppers',
    brand: 'Best Farms'
  }
  const mockConnection = {
    query: async (...args: any[]) => {}
  } as any as DBConnection
  const createProductSpy = await t.captureFn(
    async (db: DBConnection, product: Omit<Product, 'id'>) => {}
  )

  const { addProductHandler } = await t.mockImport('../../../src/handlers/add-product.js', {
    '../../../src/repositories/products.js': {
      createProduct: createProductSpy
    }
  }) as typeof import('../../../src/handlers/add-product.js')

  // Act
  await addProductHandler(mockConnection, product)

  // Assert
  t.equal(createProductSpy.calls.length, 1)
  t.equal(createProductSpy.calls[0].args[0], mockConnection)
  t.match(createProductSpy.calls[0].args[1], product)
})
