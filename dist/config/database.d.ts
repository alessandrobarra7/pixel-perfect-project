import pg from 'pg';
export declare const pool: pg.Pool;
export declare function query(text: string, params?: any[]): Promise<pg.QueryResult<any>>;
export declare function getClient(): Promise<pg.PoolClient>;
