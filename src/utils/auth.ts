import { getLocal, LOCAL_KEYS, removeLocal } from './storage';

export interface User {
    id: string;
    name: string;
}

export const auth = {
    getUser(): User | null {
        return getLocal<User>(LOCAL_KEYS.USER);
    },

    logout(): void {
        // 1. Xoá thông tin đăng nhập
        removeLocal(LOCAL_KEYS.USER);
        removeLocal(LOCAL_KEYS.ACCESS_TOKEN);
        removeLocal(LOCAL_KEYS.REFRESH_TOKEN);

        // hoặc nếu muốn xoá tất cả
        // clearLocal()
    },
};
