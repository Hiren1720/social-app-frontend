import CryptoJS from "crypto-js";
const secret_key = process.env.REACT_APP_SECRET_KEY;

export const to_Encrypt = (text) => {
    return CryptoJS.AES.encrypt(JSON.stringify(text),secret_key).toString();
};
export const to_Decrypt = (cipher) => {
    let decrypted = CryptoJS.AES.decrypt(cipher,secret_key);
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8));
};