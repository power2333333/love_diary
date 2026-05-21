# 情侣日记本 — AI 工作指引

私人情侣日记本网页应用。React + TypeScript + Tailwind CSS + Supabase，部署在 GitHub Pages。

## 关键文档路径

| 文档 | 路径 | 内容 |
|------|------|------|
| 用户需求 | [docs/requirements.md](docs/requirements.md) | 功能需求、已实现/待实现 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、架构、项目结构 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 色彩、字体、布局、响应式 |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) | 分阶段任务清单 |
| 数据库设计 | [docs/database-schema.md](docs/database-schema.md) | 表结构、SQL、RLS 策略 |
| 数据库初始化 SQL | [docs/supabase-setup-sql.md](docs/supabase-setup-sql.md) | 建表完整 SQL |
| 开发日志 | [dev-logs/](dev-logs/) | 每天的开发记录 |

## 开发日志约定

- 日志目录：`dev-logs/`
- 每天工作结束后更新或新建当日日志（`YYYY-MM-DD.md`）
- 包含：完成事项（勾选）、待办事项（未勾选）、项目结构、备注

## 工作原则

1. **先问后改**：修改前和用户确认，不擅自改动已有功能和布局
2. **小步推进**：每次只做当前任务，完成后等用户确认
3. **可验证**：每步有明确产出，用户确认后继续
4. **安全第一**：`.env` 和 `.claude/` 不提交，密钥不写入代码
5. **不画蛇添足**：不引入无关功能、不写多余注释

## 项目结构

```
src/
├── components/    ← Calendar, FoodCard, NavBar, OnThisDay, StarRating, StatsCard
├── contexts/      ← AuthContext
├── lib/           ← supabase 客户端
├── pages/         ← Home, Login, Write, DayDetail, SingleDiary, Settings, Search, FoodWrite
├── App.tsx        ← 路由配置（Login 直接加载，其余 React.lazy）
├── ProtectedApp.tsx ← 受保护路由 + AuthProvider
├── main.tsx       ← 入口
└── index.css      ← 全局样式、动画、纹理
```

## 常用命令

```bash
npm run dev      # 启动开发服务器
npm run build    # 生产构建
npm run deploy   # 构建并部署到 GitHub Pages
```

## 部署信息

- 平台：GitHub Pages
- 线上地址：https://power2333333.github.io/love_diary/
- 数据库：Supabase（Tokyo 区域）
- 注册：已关闭（前端路由 + Supabase signup 均已禁用）
