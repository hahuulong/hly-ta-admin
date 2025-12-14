import type { AxiosRequestConfig } from 'axios';
import axios from 'axios';
import { ENV } from '../config/env';
import { clearLocal, getLocal, LOCAL_KEYS, setLocal } from '../utils/storage';

const API_URL = ENV.VITE_API_URL;

// ---------------------------
// Tạo axios instance cho public API (không cần token)
// ---------------------------
const publicApi = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ---------------------------
// Tạo axios instance cho private API (cần token)
// ---------------------------
const privateApi = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ---------------------------
// Custom config để gắn AbortController vào mỗi request
// ---------------------------
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
    controller?: AbortController;
}

// Danh sách các AbortController đang được gắn vào API request
export const abortControllers: AbortController[] = [];

// Trạng thái refresh token
let isRefreshing = false;

// Hàng đợi các request fail khi token hết hạn
type FailedRequest = {
    resolve: (token: string) => void;
    reject: (error: unknown) => void;
};
export let failedQueue: FailedRequest[] = [];

// ---------------------------
// Xử lý queue khi refresh token xong
// ---------------------------
const processQueue = (error: unknown, token: string | null = null) => {
    for (const prom of failedQueue) {
        if (token) {
            // Nếu refresh thành công → gửi token mới vào request bị pending
            prom.resolve(token);
        } else {
            // Nếu refresh fail → reject tất cả request
            prom.reject(error);
        }
    }
    failedQueue = [];
};

// ---------------------------------------------------------
// Request Interceptor (PRIVATE API)
// Attach token + gắn AbortController
// ---------------------------------------------------------
privateApi.interceptors.request.use(
    async (config) => {
        // Tạo controller để abort request khi cần
        const controller = new AbortController();
        config.signal = controller.signal;

        const customConfig = config as CustomAxiosRequestConfig;
        customConfig.controller = controller;

        // Lưu controller vào danh sách
        abortControllers.push(controller);

        // Lấy access token từ SecureStorage
        const token = getLocal(LOCAL_KEYS.ACCESS_TOKEN);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
            // Nếu không có token → xoá semua request pending + chuyển sang login
            clearAbortControllers();
            await navigateToLogin();
        }

        return config;
    },
    (error) => Promise.reject(error),
);

// ---------------------------------------------------------
// Response Interceptor
// Xử lý token expired, refresh token
// ---------------------------------------------------------
privateApi.interceptors.response.use(
    (response) => {
        // Thành công thì bỏ controller ra khỏi danh sách
        removeAbortController(response.config);
        return response;
    },
    async (error) => {
        // Nếu lỗi không phải 401 → chỉ cần bỏ controller
        if (error.response && error.response.status !== 401) {
            removeAbortController(error.config || {});
        }

        // ---------------------------
        // Xử lý lỗi 401 (token hết hạn)
        // ---------------------------
        if (error.response && error.response.status === 401) {
            const originalRequest = error.config;

            // Nếu đang refresh → push request vào queue, chờ token mới
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(async (newToken) => {
                        // Gắn token mới và retry request
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                        const res = await axios(originalRequest);
                        removeAbortController(originalRequest);
                        return res;
                    })
                    .catch((err) => {
                        Promise.reject(err);
                    });
            }

            // Bắt đầu refresh
            isRefreshing = true;

            try {
                // Lấy refresh token
                const refreshToken = getLocal(LOCAL_KEYS.REFRESH_TOKEN);
                if (!refreshToken) {
                    clearAbortControllers();
                    await navigateToLogin();
                    throw new Error('No refresh token available');
                }

                try {
                    // Gọi API refresh token
                    const refreshResponse = await publicApi.post(
                        '/oauth/token',
                        {
                            grant_type: 'refresh_token',
                            refresh_token: refreshToken,
                        },
                        {
                            headers: {
                                'Content-Type': `application/x-www-form-urlencoded`,
                                Authorization: `Basic `,
                            },
                        },
                    );

                    // Lưu token mới
                    const newAccessToken = refreshResponse.data.access_token;
                    const newRefreshToken = refreshResponse.data.refresh_token;
                    setLocal(LOCAL_KEYS.ACCESS_TOKEN, newAccessToken);
                    setLocal(LOCAL_KEYS.REFRESH_TOKEN, newRefreshToken);

                    // Giải phóng queue (retry các request pending)
                    processQueue(null, newAccessToken);

                    // Retry request ban đầu
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axios(originalRequest).then((res) => {
                        removeAbortController(originalRequest);
                        return res;
                    });
                } catch {
                    // Refresh thất bại → logout
                    await navigateToLogin();
                    throw new Error('No refresh token available');
                }
            } catch (refreshError) {
                // Reject toàn bộ queue
                processQueue(refreshError, null);
                await navigateToLogin();
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    },
);

export { privateApi, publicApi };

// ---------------------------------------------------------
// Chuyển hướng sang màn hình Login
// ---------------------------------------------------------
const navigateToLogin = async () => {
    // Tránh việc gọi replace nhiều lần
    if (window.location.href !== '/login') {
        clearLocal();
        window.location.replace('/');
    }
};

// ---------------------------------------------------------
// Huỷ toàn bộ request còn pending
// ---------------------------------------------------------
const clearAbortControllers = () => {
    for (const ctrl of abortControllers) {
        ctrl.abort();
    }
    abortControllers.length = 0;
};

// ---------------------------------------------------------
// Gỡ abortController ra khỏi danh sách khi request hoàn thành
// ---------------------------------------------------------
const removeAbortController = (config?: AxiosRequestConfig) => {
    const { controller } = config as CustomAxiosRequestConfig;
    if (controller && abortControllers.includes(controller)) {
        abortControllers.splice(abortControllers.indexOf(controller), 1);
    }
};
