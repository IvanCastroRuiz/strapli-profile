"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env, }) => ({
    host: env('HOST', '0.0.0.0'),
    port: env.int ? env.int('PORT', 1337) : Number(env('PORT', 1337)),
    app: {
        keys: env.array ? env.array('APP_KEYS', ['key1', 'key2']) : String(env('APP_KEYS', 'key1,key2')).split(','),
    },
});
