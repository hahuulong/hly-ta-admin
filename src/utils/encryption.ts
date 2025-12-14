import CryptoJS from 'crypto-js';
import { ENV } from '../config/env';

export const encrypt = <T>(data: T): string | null => {
    if (data === null || data === undefined) return null;

    try {
        const stringData = JSON.stringify(data);
        return CryptoJS.AES.encrypt(stringData, ENV.VITE_CRYPTO_SECRET_KEY).toString();
    } catch {
        return null;
    }
};

export const decrypt = <T>(cipherText: string): T | null => {
    if (!cipherText) return null;

    try {
        const bytes = CryptoJS.AES.decrypt(cipherText, ENV.VITE_CRYPTO_SECRET_KEY);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return decrypted ? (JSON.parse(decrypted) as T) : null;
    } catch {
        return null;
    }
};
