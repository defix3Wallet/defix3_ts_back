import { CredentialInterface } from "../interfaces/credential.interface";
export interface BlockchainService {
  fromMnemonic(mnemonic: string): Promise<CredentialInterface>;
  fromPrivateKey(privateKey: string): Promise<CredentialInterface | null>;
  isAddress(address: string): Promise<boolean>;
  getBalance(address: string): Promise<number>;
}
