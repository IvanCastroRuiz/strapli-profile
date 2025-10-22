"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ({ env }) => ({
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
