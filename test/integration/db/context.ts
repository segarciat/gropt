import pg from 'pg'
import tap from 'tap'
import { getClient } from '../../../src/db/index.js'

export async function mockDbAt (modulePath: string, client: pg.PoolClient): Promise<any> {
  const mockedModule = await tap.mockImport(modulePath, {
    '../../../src/db/index.js': {
      query: async (text: string, values: any[]) => {
        return await client.query({ text, values })
      }
    }
  })
  return mockedModule
}

export async function getClientFromPool (): ReturnType<typeof getClient> {
  return await getClient()
}
