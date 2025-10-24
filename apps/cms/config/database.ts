import path from 'node:path';

type EnvFn = {
  (key: string, defaultValue?: unknown): any;
  int?: (key: string, defaultValue?: number) => number;
  bool?: (key: string, defaultValue?: boolean) => boolean;
  json?: <T>(key: string, defaultValue?: T) => T;
};

type DatabaseClient = 'mysql' | 'postgres' | 'sqlite';

type DatabaseConnection = {
  connection: Record<string, unknown>;
  pool?: { min?: number; max?: number };
  useNullAsDefault?: boolean;
};

const databaseDir = __dirname;

export default ({ env }: { env: EnvFn }) => {
  const client = env('DATABASE_CLIENT', 'postgres') as DatabaseClient;

  const ssl = env.bool?.('DATABASE_SSL', false)
    ? {
        key: env('DATABASE_SSL_KEY'),
        cert: env('DATABASE_SSL_CERT'),
        ca: env('DATABASE_SSL_CA'),
        capath: env('DATABASE_SSL_CAPATH'),
        cipher: env('DATABASE_SSL_CIPHER'),
        rejectUnauthorized: env.bool?.('DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      }
    : false;

  const postgresConnection: DatabaseConnection['connection'] = {
    host: env('DATABASE_HOST', '127.0.0.1'),
    port: env.int?.('DATABASE_PORT', 5432) ?? 5432,
    database: env('DATABASE_NAME', 'postgres'),
    user: env('DATABASE_USERNAME', 'postgres'),
    password: env('DATABASE_PASSWORD', 'postgres'),
    schema: env('DATABASE_SCHEMA', 'public'),
    ssl,
  };

  const connectionString = env('DATABASE_URL');
  if (typeof connectionString === 'string' && connectionString.length > 0) {
    postgresConnection.connectionString = connectionString;
  }

  const sqliteFilename = env('DATABASE_FILENAME');

  const connections: Record<DatabaseClient, DatabaseConnection> = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: env.int?.('DATABASE_PORT', 3306) ?? 3306,
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl,
      },
      pool: { min: env.int?.('DATABASE_POOL_MIN', 2) ?? 2, max: env.int?.('DATABASE_POOL_MAX', 10) ?? 10 },
    },
    postgres: {
      connection: postgresConnection,
      pool: { min: env.int?.('DATABASE_POOL_MIN', 2) ?? 2, max: env.int?.('DATABASE_POOL_MAX', 10) ?? 10 },
    },
    sqlite: {
      connection: {
        filename: path.join(databaseDir, '..', '..', sqliteFilename || '.tmp/data.db'),
      },
      useNullAsDefault: true,
    },
  };

  const selectedConnection = connections[client];

  if (!selectedConnection) {
    throw new Error(`Unsupported database client "${client}"`);
  }

  return {
    connection: {
      client,
      connection: selectedConnection.connection,
      pool: selectedConnection.pool,
      useNullAsDefault: selectedConnection.useNullAsDefault,
      acquireConnectionTimeout: env.int?.('DATABASE_CONNECTION_TIMEOUT', 60000) ?? 60000,
    },
  };
};
