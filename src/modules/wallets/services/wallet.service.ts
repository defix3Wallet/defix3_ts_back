import { Wallet } from "../entities/wallet.entity";

export class WalletService {
  public createWallet = async (req: Request, res: Response) => {
    try {
      const { defixId, seedPhrase, email } = req.body;
      const mnemonic = new Crypto.decrypt(seedPhrase);

      if (
        !defixId ||
        !defixId.includes(".defix3") ||
        defixId.includes(" ") ||
        !mnemonic
      )
        return res.status(400).send();

      const DefixId = defixId.toLowerCase();

      const exists: boolean = await validateDefixId(defixId.toLowerCase());

      if (!exists) {
        const credentials: Array<Credential> = [];

        credentials.push(await createWalletBTC(mnemonic));
        credentials.push(await createWalletETH(mnemonic));
        credentials.push(await createWalletNEAR(mnemonic));
        credentials.push(await createWalletTRON(mnemonic));
        credentials.push(await createWalletBNB(mnemonic));

        const wallet: Wallet = {
          defixId: DefixId,
          credentials: credentials,
        };

        const nearId = await getIdNear(mnemonic);

        const save = await saveUser(nearId, wallet);

        if (save) {
          if (await validateEmail(email)) {
            EnviarPhraseCorreo(mnemonic, DefixId, email);
            console.log("envia correo");
          }
          return res.send(wallet);
        }
        return res.status(400).send();
      } else {
        return res.status(405).send();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send({ err });
    }
  };
  public async createNewUser(user: User): Promise<User> {
    this.userRepository.addNewUserToDb(user);
    return user;
  }

  public async getUserById(userid: string): Promise<User> {
    return this.userRepository.getUserById(userid);
  }

  public async getUserProposals(userid: string): Promise<User[]> {
    return this.userRepository.getUserProposals(userid);
  }
}
