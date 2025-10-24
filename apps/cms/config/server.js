module.exports = ({ env }) => {
  const keys = env.array
    ? env.array('APP_KEYS')
    : (env('APP_KEYS', '') || '')
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean);

  return {
    host: env('HOST', '0.0.0.0'),
    port: env.int ? env.int('PORT', 1337) : 1337,
    app: {
      keys,
    },
  };
};
