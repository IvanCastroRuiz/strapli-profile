export default ({
  env,
}: {
  env: ((key: string, def?: any) => any) & {
    int?: (key: string, def?: number) => number;
    array?: (key: string, def?: string[]) => string[];
  };
}) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int ? env.int('PORT', 1337) : Number(env('PORT', 1337)),
  app: {
    keys: env.array ? env.array('APP_KEYS', ['key1', 'key2']) : String(env('APP_KEYS', 'key1,key2')).split(','),
  },
});
