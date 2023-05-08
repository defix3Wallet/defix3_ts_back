import nodemailer from "nodemailer";
import path from "path";
import hbs, { NodemailerExpressHandlebarsOptions } from "nodemailer-express-handlebars";
import { UserService } from "../../modules/users/services/user.service";
import { UtilsShared } from "../utils/utils.shared";

export class MailShared {
  private transporter!: nodemailer.Transporter;
  private userService: UserService;

  constructor() {
    this.configNodemailer();
    this.userService = new UserService();
  }

  private configNodemailer = () => {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_MAIL,
        pass: process.env.PASS_MAIL,
      },
    });
  };

  public sendMailPhrase = (phrase: string, userdefix: string, to: string) => {
    let from = process.env.USER_MAIL;

    // point to the template folder
    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        // partialsDir: path.join(__dirname, "/viewsEmail"),
        partialsDir: path.resolve("./viewsEmail/"),
        defaultLayout: false,
      },
      // viewPath: path.join(__dirname, "/viewsEmail"),
      viewPath: path.resolve("./viewsEmail/"),
    };

    // use a template file with nodemailer
    this.transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: from,
      to: to,
      subject: "Secret phrase for fix3 account recovery.",
      template: "phraseEmail", // the name of the template file i.e email.handlebars
      context: {
        userdefix: userdefix,
        phrase: phrase,
      },
    };

    this.transporter.sendMail(mailOptions);
  };

  public emailSuccessWithdrawal = async (defixId: string, toDefix: string, amount: string, token: string, blockchain: string, invoice: string) => {
    let from = process.env.USER_MAIL;

    const fromUser = await this.userService.getUserByDefixId(defixId);

    if (!fromUser) return;

    if (!fromUser.flagWithdraw) return;

    // point to the template folder
    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        partialsDir: path.resolve("./viewsEmail/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./viewsEmail/"),
    };

    // use a template file with nodemailer
    this.transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: from,
      to: fromUser.email,
      subject: "SUCCESSFUL WITHDRAWAL",
      template: "successWithdrawal", // the name of the template file i.e email.handlebars
      context: {
        user: defixId,
        amount,
        token,
        blockchain,
        wallet: toDefix,
        network: process.env.NETWORK,
        invoice,
        linkTx: UtilsShared.getLinkTransaction(blockchain, invoice),
      },
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      return;
    });
  };

  public emailReceivedPayment = async (defixId: string, toDefix: string, amount: string, token: string, blockchain: string, invoice: string) => {
    let from = process.env.USER_MAIL;

    const toUser = await this.userService.getUserByDefixId(toDefix);

    if (!toUser) return;

    if (!toUser.flagDeposit) return;

    // point to the template folder
    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        partialsDir: path.resolve("./viewsEmail/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./viewsEmail/"),
    };

    // use a template file with nodemailer
    this.transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: from,
      to: toUser.email,
      subject: "RECEIVED PAYMENT",
      template: "receivedPayment", // the name of the template file i.e email.handlebars
      context: {
        user: toUser.defixId,
        amount,
        token,
        wallet: defixId,
        blockchain,
        network: process.env.NETWORK,
        invoice,
        linkTx: UtilsShared.getLinkTransaction(blockchain, invoice),
      },
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      return;
    });
  };

  public emailSuccessSwap = async (
    defixId: string,
    fromToken: string,
    srcAmount: string,
    toToken: string,
    destAmount: string,
    blockchain: string,
    hash: string,
    dateTime: string
  ) => {
    let from = process.env.USER_MAIL;

    const fromUser = await this.userService.getUserByDefixId(defixId);

    if (!fromUser) return;

    if (!fromUser.flagSign) return;

    // point to the template folder
    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        partialsDir: path.resolve("./viewsEmail/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./viewsEmail/"),
    };

    const isoDate = dateTime;
    const date = new Date(isoDate);

    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const hour = ("0" + date.getHours()).slice(-2);
    const minute = ("0" + date.getMinutes()).slice(-2);
    const second = ("0" + date.getSeconds()).slice(-2);

    const formattedDate = `${day}/${month}/${year} ${hour}:${minute}:${second}`;

    // use a template file with nodemailer
    this.transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: from,
      to: fromUser.email,
      subject: "FUNDS TRADED",
      template: "successSwap", // the name of the template file i.e email.handlebars
      context: {
        user: defixId,
        token1: fromToken,
        spend: srcAmount,
        token2: toToken,
        received: destAmount,
        PRICE: Number(destAmount) / Number(srcAmount),
        date_time: formattedDate,
        blockchain: blockchain,
        linkTx: UtilsShared.getLinkTransaction(blockchain, hash),
      },
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      return;
    });
  };
}
