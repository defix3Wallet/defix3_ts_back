import nodemailer from "nodemailer";
import path from "path";
import hbs, {
  NodemailerExpressHandlebarsOptions,
} from "nodemailer-express-handlebars";
import { UserService } from "../../modules/users/services/user.service";

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
        partialsDir: path.resolve("./viewsEmail/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./viewsEmail/"),
    };

    // use a template file with nodemailer
    this.transporter.use("compile", hbs(handlebarOptions));
    const mailOptions = {
      from: from,
      to: to,
      subject: "Phrase secreta para recuperacion de cuenta deFix3",
      template: "phraseEmail", // the name of the template file i.e email.handlebars
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
      } else {
        console.log("Email sent: " + info.response);
      }
    });
  };

  public sendMail = async (
    fromDefix: string,
    toDefix: string,
    type: string,
    data: any
  ) => {
    const from = await this.getEmailFlag(fromDefix, "SEND");
    const to = await this.getEmailFlag(toDefix, "RECEIVE");

    let from_admin = process.env.USER_MAIL;

    const handlebarOptions: NodemailerExpressHandlebarsOptions = {
      viewEngine: {
        partialsDir: path.resolve("./viewsEmail/"),
        defaultLayout: false,
      },
      viewPath: path.resolve("./viewsEmail/"),
    };
    // use a template file with nodemailer
    this.transporter.use("compile", hbs(handlebarOptions));

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
              this.transporter.sendMail(
                mailOptionsFrom,
                function (error, info) {
                  return true;
                }
              );
            }
          }

          if (to) {
            // Envio al receptor
            const mailOptionsTo = {
              from: from_admin,
              to: to,
              subject: "Ha recibido fondos",
              template: "RecepcionFondos", // the name of the template file i.e email.handlebars
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
            template: "swap", // the name of the template file i.e email.handlebars
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
  };

  public getEmailFlag = async (defixId: string, flag: string) => {
    try {
      const user = await this.userService.getUserByDefixId(defixId);

      if (!user) return;

      if (flag === "SEND" && user.flagSign) {
        return user.email;
      } else if (flag === "RECEIVE" && user.flagEvolution) {
        return user.email;
      }
    } catch (error) {
      return;
    }
  };
}
