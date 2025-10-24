const path = require('node:path');

const getInt = (env, key, defaultValue) =>
  typeof env.int === 'function' ? env.int(key, defaultValue) : defaultValue;

const getBool = (env, key, defaultValue) =>
  typeof env.bool === 'function' ? env.bool(key, defaultValue) : defaultValue;

const databaseDir = __dirname;

module.exports = ({ env }) => {
  const client = env('DATABASE_CLIENT', 'postgres');

  const ssl = getBool(env, 'DATABASE_SSL', false)
    ? {
        key: env('DATABASE_SSL_KEY'),
        cert: env('DATABASE_SSL_CERT'),
        ca: env('DATABASE_SSL_CA'),
        capath: env('DATABASE_SSL_CAPATH'),
        cipher: env('DATABASE_SSL_CIPHER'),
        rejectUnauthorized: getBool(env, 'DATABASE_SSL_REJECT_UNAUTHORIZED', true),
      }
    : false;

  const postgresConnection = {
    host: env('DATABASE_HOST', '127.0.0.1'),
    port: getInt(env, 'DATABASE_PORT', 5432),
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

  const pool = {
    min: getInt(env, 'DATABASE_POOL_MIN', 2),
    max: getInt(env, 'DATABASE_POOL_MAX', 10),
  };

  const connections = {
    mysql: {
      connection: {
        host: env('DATABASE_HOST', 'localhost'),
        port: getInt(env, 'DATABASE_PORT', 3306),
        database: env('DATABASE_NAME', 'strapi'),
        user: env('DATABASE_USERNAME', 'strapi'),
        password: env('DATABASE_PASSWORD', 'strapi'),
        ssl,
      },
      pool,
    },
    postgres: {
      connection: postgresConnection,
      pool,
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
      acquireConnectionTimeout: getInt(env, 'DATABASE_CONNECTION_TIMEOUT', 60000),
    },
  };
};
