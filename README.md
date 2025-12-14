# Project Library Summary

This project is built with React, TypeScript, and Vite. Below is a
concise summary of the main libraries and their purposes.

## DevDependencies
| Nhóm                   | Thư viện                | Chức năng                              |
| ---------------------- | ----------------------- | -------------------------------------- |
| **Routing**            | @tanstack/react-router  | Router type-safe, mạnh mẽ              |
|                        | @tanstack/router-plugin | Plugin tích hợp cho router             |
| **Data Fetching**      | @tanstack/react-query   | Quản lý server state, caching          |
| **Client State**       | zustand                 | Quản lý state nhẹ, đơn giản            |
| **Forms & Validation** | react-hook-form         | Quản lý form hiệu suất cao             |
|                        | zod                     | Validate schema & typing               |
| **Styling & UI**       | tailwindcss             | CSS utility-first                      |
|                        | @tailwindcss/vite       | Plugin để Tailwind chạy với Vite       |
|                        | sonner                  | Toast notifications                    |
| **Error Handling**     | react-error-boundary    | Bắt lỗi UI, fallback component         |
| **Utilities**          | axios                   | Gọi API                                |
|                        | dayjs                   | Làm việc với ngày/giờ                  |
|                        | crypto-js               | Hash/mã hoá                            |
|                        | lodash                  | Utilities hỗ trợ xử lý dữ liệu         |
|                        | dotenv                  | Load biến môi trường runtime (scripts) |
| **Env**                | @t3-oss/env-core        | Validate & type-safe cho ENV           |

## DevDependencies
| Nhóm                   | Thư viện                         | Chức năng                             |
| ---------------------- | -------------------------------- | ------------------------------------- |
| **Linting**            | eslint                           | Kiểm tra code, tìm lỗi                |
|                        | @eslint/js                       | Rule ESLint mặc định                  |
|                        | eslint-plugin-react              | Rule dành cho React                   |
|                        | eslint-plugin-react-hooks        | Rule cho Hooks                        |
|                        | eslint-plugin-import             | Kiểm tra import/export                |
|                        | eslint-plugin-import-x           | Tối ưu import theo module             |
|                        | eslint-plugin-jsx-a11y           | Kiểm tra accessibility                |
|                        | eslint-plugin-react-refresh      | Hỗ trợ Fast Refresh                   |
|                        | eslint-config-prettier           | Tắt rule xung đột với Prettier        |
| **TypeScript Linting** | @typescript-eslint/parser        | Parser cho TypeScript                 |
|                        | @typescript-eslint/eslint-plugin | Rule ESLint cho TypeScript            |
|                        | typescript-eslint                | Bộ công cụ hỗ trợ ESLint + TS         |
| **Formatting**         | prettier                         | Format code                           |
|                        | eslint-plugin-prettier           | Chạy Prettier trong ESLint            |
| **Commit Standards**   | @commitlint/cli                  | Kiểm tra chuẩn commit                 |
|                        | @commitlint/config-conventional  | Rule commit theo Conventional Commits |
|                        | husky                            | Hook git (pre-commit, commit-msg…)    |
|                        | lint-staged                      | Chạy lint cho file staged             |
| **Routing Devtools**   | @tanstack/react-router-devtools  | Devtools cho router                   |
| **Query Devtools**     | @tanstack/react-query-devtools   | Devtools cho React Query              |
| **Build Tools**        | @vitejs/plugin-react             | Plugin React cho Vite                 |
|                        | babel-plugin-react-compiler      | Compiler mới của React                |
| **Types**              | @types/node                      | Typing cho NodeJS                     |
|                        | @types/react                     | Typing cho React                      |
|                        | @types/react-dom                 | Typing cho ReactDOM                   |
|                        | @types/crypto-js                 | Typing cho crypto-js                  |
| **Support**            | globals                          | Bộ biến global cho ESLint             |
| **Language**           | typescript                       | Compiler TS (dev)                     |
|                        | tsc (qua scripts)                | Type-check cho dự án                  |

## Note run docker
-   docker-compose -f docker-compose.dev.yml up -d --build
-   docker-compose -f docker-compose.dev.yml stop
-   docker-compose -f docker-compose.dev.yml start
-   docker-compose -f docker-compose.dev.yml down
-   docker-compose -f docker-compose.dev.yml down -v

## Note clear commit
-   git checkout --orphan clean-main
-   git add .
-   git commit -m "fix: initial clean commit"
-   git branch -M main
-   git push origin main --force

## Note commit git
| **Commit Type** | **Chức năng / Khi dùng**                                                       |
| --------------- | ------------------------------------------------------------------------------ |
| **build**       | Thay đổi hệ thống build: vite, webpack, babel, tsconfig…                       |
| **chore**       | Công việc linh tinh, không ảnh hưởng code chạy (update deps, rename file…).    |
| **ci**          | Thay đổi CI/CD: actions, pipelines…                                            |
| **docs**        | Thay đổi tài liệu: README, docs, comment…                                      |
| **feat**        | Thêm tính năng mới cho ứng dụng.                                               |
| **fix**         | Sửa lỗi (bug fix).                                                             |
| **perf**        | Tối ưu hiệu năng.                                                              |
| **refactor**    | Tái cấu trúc code, không thêm feature và không sửa lỗi.                        |
| **revert**      | Hoàn tác (rollback) một commit trước đó.                                       |
| **style**       | Thay đổi format/code style không ảnh hưởng logic (prettier, spacing, indent…). |
| **test**        | Thêm hoặc sửa test.                                                            |
