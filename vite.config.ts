import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
// import compression from 'vite-plugin-compression';
import { z } from 'zod';

export default defineConfig(({ mode }) => {
    const rawEnv = loadEnv(mode, process.cwd(), '');

    const EnvSchema = z.object({
        VITE_API_URL: z.string().min(1),
        VITE_CRYPTO_SECRET_KEY: z.string().min(32),
    });

    const parsed = EnvSchema.safeParse(rawEnv);

    if (!parsed.success) {
        console.error('❌ Invalid environment variables:');
        console.error(parsed.error.issues);
        process.exit(1);
    }

    return {
        plugins: [
            tanstackRouter({
                target: 'react',
                autoCodeSplitting: true,
            }),
            tailwindcss(),
            react({
                babel: {
                    plugins: ['babel-plugin-react-compiler'],
                },
            }),
            // ---------- Visualizer: thống kê tài nguyên sử dụng ----------
            visualizer({
                filename: 'dist/stats.html', // file report
                open: false, // tự động mở sau build
                gzipSize: true, // hiển thị size gzip
                brotliSize: true, // hiển thị size brotli
            }),
            // ---------- Compression: nào cần tối ưu file trả về thì bật lên, cấu hình lại cho nginx ở file ./nginx/default.conf ----------
            // gzip
            // compression({
            //     algorithm: 'gzip',
            //     ext: '.gz',
            //     threshold: 10240, // chỉ nén file > 10kb
            // }),
            // brotli
            // compression({
            //     algorithm: 'brotliCompress',
            //     ext: '.br',
            //     threshold: 10240,
            // }),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
            },
        },
        // xóa log khi lên build
        esbuild:
            mode === 'production'
                ? {
                      drop: ['console', 'debugger'],
                  }
                : undefined,
    };
});
