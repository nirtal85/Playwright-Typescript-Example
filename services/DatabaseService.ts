import * as mysql from 'mysql2/promise';

export class DatabaseService {
  private pool: mysql.Pool;

  constructor() {
    const dbHost = process.env.DB_HOST;
    const dbPort = 3306;
    const dbUser = process.env.DB_USER;
    const dbPassword = process.env.DB_PASSWORD;
    const connectionOptions: mysql.PoolOptions = {
      host: dbHost,
      port: dbPort,
      user: dbUser,
      password: dbPassword,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: false
      }
    };

    this.pool = mysql.createPool(connectionOptions);
  }

  async executeQuery<T>(sql: string, params: any[] = []): Promise<T> {
    let connection: mysql.PoolConnection | null = null;
    try {
      connection = await this.pool.getConnection();
      const [results] = await connection.query(sql, params);
      return results as T;
    } catch (error) {
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  }

  async closePool(): Promise<void> {
    await this.pool.end();
  }
}
