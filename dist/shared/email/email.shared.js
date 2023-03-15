"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailShared = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const path_1 = __importDefault(require("path"));
const nodemailer_express_handlebars_1 = __importDefault(require("nodemailer-express-handlebars"));
const user_service_1 = require("../../modules/users/services/user.service");
class MailShared {
    constructor() {
        this.configNodemailer = () => {
            this.transporter = nodemailer_1.default.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.USER_MAIL,
                    pass: process.env.PASS_MAIL,
                },
            });
        };
        this.sendMailPhrase = (phrase, userdefix, to) => {
            let from = process.env.USER_MAIL;
            // point to the template folder
            const handlebarOptions = {
                viewEngine: {
                    partialsDir: path_1.default.resolve("./viewsEmail/"),
                    defaultLayout: false,
                },
                viewPath: path_1.default.resolve("./viewsEmail/"),
            };
            // use a template file with nodemailer
            this.transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
            const mailOptions = {
                from: from,
                to: to,
                subject: "Phrase secreta para recuperacion de cuenta deFix3",
                template: "phraseEmail",
                context: {
                    userdefix: userdefix,
                    phrase: phrase,
                },
            };
            this.transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log("--------------------------------------------");
                    console.log(error);
                    console.log("--------------------------------------------");
                }
                else {
                    console.log("Email sent: " + info.response);
                }
            });
        };
        this.sendMail = (fromDefix, toDefix, type, data) => __awaiter(this, void 0, void 0, function* () {
            const from = yield this.getEmailFlag(fromDefix, "SEND");
            const to = yield this.getEmailFlag(toDefix, "RECEIVE");
            let from_admin = process.env.USER_MAIL;
            const handlebarOptions = {
                viewEngine: {
                    partialsDir: path_1.default.resolve("./viewsEmail/"),
                    defaultLayout: false,
                },
                viewPath: path_1.default.resolve("./viewsEmail/"),
            };
            // use a template file with nodemailer
            this.transporter.use("compile", (0, nodemailer_express_handlebars_1.default)(handlebarOptions));
            switch (type) {
                case "envio":
                    {
                        if (from) {
                            // Envio al emisor
                            let tipoEnvio = "";
                            switch (data.tipoEnvio) {
                                case "user":
                                    tipoEnvio = "al usuario";
                                    break;
                                case "wallet":
                                    tipoEnvio = "a la siguiente dirección";
                                    break;
                            }
                            if (tipoEnvio != "") {
                                const mailOptionsFrom = {
                                    from: from_admin,
                                    to: from,
                                    subject: "Envio de fondos",
                                    template: "EnvioFondos",
                                    context: {
                                        monto: data.monto,
                                        moneda: data.moneda,
                                        receptor: data.receptor,
                                        emisor: data.emisor,
                                        tipoEnvio: tipoEnvio,
                                    },
                                };
                                this.transporter.sendMail(mailOptionsFrom, function (error, info) {
                                    return true;
                                });
                            }
                        }
                        if (to) {
                            // Envio al receptor
                            const mailOptionsTo = {
                                from: from_admin,
                                to: to,
                                subject: "Ha recibido fondos",
                                template: "RecepcionFondos",
                                context: {
                                    monto: data.monto,
                                    moneda: data.moneda,
                                    receptor: data.receptor,
                                    emisor: data.emisor,
                                },
                            };
                            this.transporter.sendMail(mailOptionsTo, function (error, info) {
                                return true;
                            });
                        }
                    }
                    break;
                case "swap":
                    {
                        var mailOptions = {
                            from: from_admin,
                            to: from,
                            subject: "Notificacion de swap",
                            template: "swap",
                            context: {
                                user: data.user,
                                montoA: data.montoA,
                                monedaA: data.monedaA,
                                montoB: data.montoB,
                                monedaB: data.monedaB,
                            },
                        };
                        this.transporter.sendMail(mailOptions, function (error, info) {
                            return true;
                        });
                    }
                    break;
            }
        });
        this.getEmailFlag = (defixId, flag) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.userService.getUserByDefixId(defixId);
                if (!user)
                    return;
                if (flag === "SEND" && user.flagSend) {
                    return user.email;
                }
                else if (flag === "RECEIVE" && user.flagReceive) {
                    return user.email;
                }
            }
            catch (error) {
                return;
            }
        });
        this.configNodemailer();
        this.userService = new user_service_1.UserService();
    }
}
exports.MailShared = MailShared;
