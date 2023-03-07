import crypto from "crypto";

class Crypto {
  public decrypt(text: string) {
    try {
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
  public encrypt(text: string) {
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
}

export default new Crypto();
