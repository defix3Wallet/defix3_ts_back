"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
class UserController {
    constructor() {
        this.validateDefixId = async (req, res) => {
            try {
                const { defixId } = req.body;
                const user = await this.userService.getUserByDefixId(defixId);
                if (!user)
                    return res.send(false);
                return res.send(true);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.getUsers = async (req, res) => {
            try {
                const users = await this.userService.getUsers();
                res.send(users);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.getUserData = async (req, res) => {
            try {
                const { defixId } = req.body;
                const user = await this.userService.getUserDataByDefixId(defixId);
                if (!user)
                    return res.status(400).send({ message: "User not exists." });
                res.send(user);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.updateUser = async (req, res) => {
            try {
                const { defixId } = req.body;
                console.log(defixId);
                if (req.file) {
                    req.body.avatar = req.file.filename;
                }
                await this.validateFlags(req);
                const updatedUser = await this.userService.updateUser(defixId, req.body);
                res.send(updatedUser);
            }
            catch (error) {
                return res.status(500).send({ message: error.message });
            }
        };
        this.validateFlags = async (req) => {
            if (typeof req.body.flagSign === "string") {
                if (req.body.flagSign.toLowerCase() === "true")
                    req.body.flagSign = true;
                else if (req.body.flagSign.toLowerCase() === "false") {
                    req.body.flagSign = false;
                }
            }
            if (typeof req.body.flagNews === "string") {
                if (req.body.flagNews.toLowerCase() === "true")
                    req.body.flagNews = true;
                else if (req.body.flagNews.toLowerCase() === "false") {
                    req.body.flagNews = false;
                }
            }
            if (typeof req.body.flagDeposit === "string") {
                if (req.body.flagDeposit.toLowerCase() === "true")
                    req.body.flagDeposit = true;
                else if (req.body.flagDeposit.toLowerCase() === "false") {
                    req.body.flagDeposit = false;
                }
            }
            if (typeof req.body.flagWithdraw === "string") {
                if (req.body.flagWithdraw.toLowerCase() === "true")
                    req.body.flagWithdraw = true;
                else if (req.body.flagWithdraw.toLowerCase() === "false") {
                    req.body.flagWithdraw = false;
                }
            }
            if (typeof req.body.flagEvolution === "string") {
                if (req.body.flagEvolution.toLowerCase() === "true")
                    req.body.flagEvolution = true;
                else if (req.body.flagEvolution.toLowerCase() === "false") {
                    req.body.flagEvolution = false;
                }
            }
        };
        this.userService = new user_service_1.UserService();
    }
}
exports.UserController = UserController;
