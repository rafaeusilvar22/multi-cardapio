import CryptoJS from "crypto-js";

// Load environment variable from process
const secretKey = process.env.CRYPTOJS_SECRETE;

export function cryptoJsEncrypt(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
}

export function cryptoJsDecrypt(ciphertext) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}
