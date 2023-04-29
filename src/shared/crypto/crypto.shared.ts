import crypto from "crypto";
import cryptoJs from "crypto-js";

export class CryptoShared {
  static decrypt(text: string) {
    try {
      return text;
      const cipheredBytes = Buffer.from(text, "base64");
      const decoded = crypto
        .privateDecrypt(
          {
            key: process.env.PRIVATE_KEY as string,
            passphrase: process.env.PASSWORD_DB,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          cipheredBytes
        )
        .toString();
      return decoded;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static encryptRSA(text: string) {
    try {
      const encrypted = crypto.publicEncrypt(
        {
          key: process.env.PUBLIC_KEY as string,
          padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        },
        Buffer.from(text)
      );
      return encrypted.toString("base64");
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  static encryptAES(text: string) {
    const ciphertext = cryptoJs.AES.encrypt(text, process.env.PRIVATE_KEY as string).toString();
    return ciphertext;
  }

  static decryptAES(text: string) {
    var bytes = cryptoJs.AES.decrypt(text, process.env.PRIVATE_KEY as string);
    var originalText = bytes.toString(cryptoJs.enc.Utf8);
    return originalText;
  }
}
