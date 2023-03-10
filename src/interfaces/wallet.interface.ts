import { CredentialInterface } from "../interfaces/credential.interface";

export interface WalletInterface {
  defixId: string;
  credentials: Array<CredentialInterface>;
}
