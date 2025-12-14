import { decrypt, encrypt } from './encryption';

export const LOCAL_KEYS = {
    USER: 'user',
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
} as const;

export type LocalKey = (typeof LOCAL_KEYS)[keyof typeof LOCAL_KEYS];

export const setLocal = <T>(key: LocalKey, data: T): void => {
    if (!key || data === undefined) return;

    const encrypted = encrypt<T>(data);
    if (encrypted) {
        localStorage.setItem(key, encrypted);
    }
};

export const getLocal = <T>(key: LocalKey): T | null => {
    if (!key) return null;

    const cipherText = localStorage.getItem(key);
    if (!cipherText) return null;

    return decrypt<T>(cipherText);
};

export const removeLocal = (key: LocalKey): void => {
    localStorage.removeItem(key);
};

export const clearLocal = (): void => {
    localStorage.clear();
};
