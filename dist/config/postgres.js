"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
// Coloca aquí tus credenciales
async function dbConnect() {
    const connectionData = {
        user: process.env.USER_DB,
        host: process.env.HOST_DB,
        database: process.env.DATABASE,
        password: process.env.PASSWORD_DB,
        port: Number(process.env.PORT_DB),
    };
    return new pg_1.Pool(connectionData);
}
exports.default = dbConnect;
