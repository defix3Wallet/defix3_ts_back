"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const swaggerDefinition = {
    openapi: "3.0.3",
    info: {
        title: "Defix3 - Api V2",
        description: "End Points for Defix3 API V2",
        contact: {
            email: "juanochando00@gmail.com",
        },
        version: "2.0.0",
    },
    servers: [
        {
            url: `https://defix3.com:${process.env.PORT}/api/v2/`,
        },
        {
            url: `http://localhost:${process.env.PORT}/api/v2/`,
        },
    ],
    tags: [
        {
            name: "Wallet",
            description: "EndPoints asociados a la creacion y funciones basicas de las wallets.",
        },
        {
            name: "User",
            description: "EndPoints asociados a la configuracion del perfil de los usuarios.",
        },
        {
            name: "2FA",
            description: "EndPoints asociados al 2FA.",
        },
        {
            name: "Balance",
            description: "EndPoints asociados al balance y Cryptomonedas",
        },
        {
            name: "General",
            description: "EndPoints variados",
        },
        {
            name: "Transfer",
            description: "EndPoints asociados a las transferencias.",
        },
        {
            name: "Withdraw",
            description: "EndPoints asociados a los retiros.",
        },
        {
            name: "Swap",
            description: "EndPoints asociados a al Swap. Solo ETH, BSC y NEAR",
        },
        {
            name: "LimitOrder",
            description: "EndPoints asociados a al Limit Order. Solo ETH",
        },
        {
            name: "TransactionHistory",
            description: "EndPoint ver el historial de Transactiones",
        },
        {
            name: "Frequent",
            description: "EndPoints para los usuarios frecuentes al hacer transferencias",
        },
        {
            name: "Subscription",
            description: "EndPoint para guardar correo de usuario que quiera recibir notificaciones de Defix3",
        },
        {
            name: "Bridge",
            description: "EndPoint asociados a al Bridge.",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
    },
};
const swaggerOptions = {
    swaggerDefinition,
    apis: [path_1.default.join(__dirname, "../modules/**/{routes,routes.*}{.ts,.js}")],
};
exports.default = (0, swagger_jsdoc_1.default)(swaggerOptions);
