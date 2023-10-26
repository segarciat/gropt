import tap from 'tap'
import { getClient } from '#src/db/index.js'

export default class DbContext {
  static async mockDbAt (modulePath, client) {
    const { default: mockedModule } = await tap.mockImport(modulePath, {
      '#src/db/index.js': {
        query: async (text, values) => {
          return await client.query({ text, values })
        }
      }
    })
    return mockedModule
  }

  static async getClientFromPool () {
    return await getClient()
  }
}
