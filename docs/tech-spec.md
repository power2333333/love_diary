# 技术选型与架构说明

## 整体架构

```
浏览器 (React SPA)
    ↕ HTTP/WebSocket
Supabase (BaaS)
    ├── Auth (用户认证)
    └── PostgreSQL (数据存储)
```

## 前端技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 19 | UI 框架 |
| TypeScript | 5.8 | 类型安全 |
| Vite | 6 | 构建工具 |
| Tailwind CSS | 4 | 原子化 CSS |
| React Router | 6 | 客户端路由 |
| @supabase/supabase-js | 2 | Supabase 客户端 SDK |

## 后端服务（Supabase）

| 服务 | 用途 |
|------|------|
| Supabase Auth | 邮箱密码注册/登录，自动管理 session |
| Supabase PostgreSQL | 存储用户资料和日记数据 |
| Row Level Security | 数据访问权限控制 |

## 部署

| 平台 | 用途 |
|------|------|
| Vercel | 前端静态托管，自动 HTTPS，免费 |

## 项目结构

```
love_diary/
├── CLAUDE.md
├── docs/                  ← 项目文档（人工维护）
│   ├── requirements.md
│   ├── tech-spec.md
│   ├── design-spec.md
│   ├── execution-plan.md
│   └── database-schema.md
├── dev-logs/              ← 开发日志（AI 自动维护）
├── public/
├── src/
│   ├── components/        ← 可复用组件
│   ├── pages/            ← 页面组件
│   ├── lib/              ← Supabase 客户端等工具
│   ├── App.tsx           ← 路由配置
│   ├── main.tsx          ← 入口
│   └── index.css         ← 全局样式 + Tailwind
├── index.html
├── package.json
└── vite.config.ts
```
