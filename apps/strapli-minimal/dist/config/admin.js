"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    auth: {
        secret: process.env.ADMIN_JWT_SECRET || 'change-me',
    },
    apiToken: {
        salt: process.env.API_TOKEN_SALT || 'change-me',
    },
    transfer: {
        token: {
            salt: process.env.TRANSFER_TOKEN_SALT || 'change-me',
        },
    },
};
