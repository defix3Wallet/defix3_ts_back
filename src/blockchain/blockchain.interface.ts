import { CredentialInterface } from "../interfaces/credential.interface";
export interface BlockchainService {
  createWallet(mnemonic: string): Promise<CredentialInterface>;
  getBalance(address: string): Promise<number>;
}
