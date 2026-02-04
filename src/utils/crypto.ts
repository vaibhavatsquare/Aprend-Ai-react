import CryptoJS from "crypto-js";

const key = CryptoJS.enc.Base64.parse(process.env.AES_KEY_BASE64!);
const iv = CryptoJS.enc.Base64.parse(process.env.AES_IV_BASE64!);

export const encryptAES = (text: string) => {
  return CryptoJS.AES.encrypt(text, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  }).toString();
};
