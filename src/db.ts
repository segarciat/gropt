import pg from 'pg'
import { DBConnection, DBQueryResult } from './types.js'

class DbPool implements DBConnection {
  private readonly _pool: pg.Pool = new pg.Pool({
    allowExitOnIdle: true
  })

  async query (sqlText: string, parameters?: any[]): Promise<DBQueryResult> {
    return await this._pool.query({
      text: sqlText,
      values: parameters
    })
  }
}

export const pool = new DbPool()
