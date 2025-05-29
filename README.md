# 🧠 Vision Dashboard

Welcome to the **Vision Dashboard** — a modern interface for managing browser profiles and cookies, built with **Next.js**, **Tailwind CSS**, and seamless integration with [empr.cloud](https://v1.empr.cloud) API.

---

## 🚀 Features

- 📁 Browse folders and profiles
- 🍪 Export and import cookies per profile
- 📥 Drag-and-drop `.json` upload
- 📦 Download full cookie bundle as `.json`
- ⚡ Single Page Application (SPA) for a smooth UX

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 + Tailwind CSS
- **API**: Custom Next.js API Routes
- **Icons**: Lucide
- **Tooling**: ESLint, Prettier

---

## 📦 Installation

```bash
git clone https://github.com/yourusername/vision-dashboard.git
cd vision-dashboard
yarn install
yarn dev
```
---

## ✅ Tests & Coverage

### Run tests

```bash
 yarn vitest --coverage

```

### Summary

- ✅ **Test Files**: 32 passed  
- ✅ **Tests**: 94 passed  
- 🕒 **Start at**: 23:53:32  
- ⏱️ **Duration**: 9.83s (transform 2.24s, setup 7.63s, collect 11.46s, tests 4.63s, environment 34.10s, prepare 5.76s)

---

### 📊 Coverage (Istanbul)

| File                          | % Stmts | % Branch | % Funcs | % Lines |
|-------------------------------|---------|----------|---------|---------|
| **All files**                 | **96.10** | **80.61** | **97.84** | **98.36** |
| `app/layout.tsx`             | 100.00  | 100.00   | 100.00  | 100.00  |
| `app/page.tsx`               | 85.93   | 55.00    | 93.75   | 94.44   |
| `app/api/auth/*`             | 100.00  | 100.00   | 100.00  | 100.00  |
| `app/api/export/route.ts`    | 92.59   | 68.75    | 100.00  | 96.15   |
| `app/login/page.tsx`         | 100.00  | 100.00   | 100.00  | 100.00  |
| `components/*`               | 97.33   | 88.46    | 96.96   | 98.57   |
| `lib/*`                      | 100.00  | 87.87    | 100.00  | 100.00  |

📁 _Open `coverage/lcov-report/index.html` after running `yarn coverage` for full report._

