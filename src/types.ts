export interface DBQueryResult {
  rows?: any[]
}

export interface DBConnection {
  /**
   * Runs an SQL query given a query string and parameters to substitute.
   * @param sqlText The (possibly-parametrized) SQL query string.
   * @param parameters Values to substitute in a parametrized query.
   * @returns Resulting rows of running the query.
   */
  query: (sqlText: string, parameters?: any[]) => Promise<DBQueryResult>
}
