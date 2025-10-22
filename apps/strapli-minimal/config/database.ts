export default ({ env }: { env: (key: string, def?: any) => any }) => ({
  connection: {
    client: 'postgres',
    connection: {
      connectionString: env('DATABASE_URL'),
      // Set to true only if your DB requires SSL
      ssl: env('DATABASE_SSL', false),
    },
    pool: { min: 0, max: 10 },
  },
});

