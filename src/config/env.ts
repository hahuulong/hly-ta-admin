import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const ENV = createEnv({
    // server: {
    // 	SERVER_URL: z.string().url().optional(),
    // },

    // xem điều kiện validate trong file vite.config.ts
    clientPrefix: 'VITE_',
    client: {
        VITE_API_URL: z.string().min(1),
        VITE_CRYPTO_SECRET_KEY: z.string().min(32),
    },

    runtimeEnv: import.meta.env,
    emptyStringAsUndefined: true,
});
