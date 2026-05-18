# 情侣日记本 — AI 工作指引

私人的情侣日记本网页应用。React + TypeScript + Tailwind CSS + Supabase，部署在 Vercel。

## 关键文档路径

涉及到项目标准、规范、计划时，优先查阅以下文件：

| 文档 | 路径 | 内容 |
|------|------|------|
| 用户需求 | [docs/requirements.md](docs/requirements.md) | 功能需求、用户故事 |
| 技术规范 | [docs/tech-spec.md](docs/tech-spec.md) | 技术栈、架构、项目结构 |
| 设计规范 | [docs/design-spec.md](docs/design-spec.md) | 色彩、字体、布局、响应式 |
| 执行计划 | [docs/execution-plan.md](docs/execution-plan.md) | 分阶段任务清单 |
| 数据库设计 | [docs/database-schema.md](docs/database-schema.md) | 表结构、SQL、RLS 策略 |

## 开发日志约定

- 日志目录：`dev-logs/`
- 每次工作开始时，在 `dev-logs/` 下创建或更新当天日志文件（格式：`YYYY-MM-DD.md`）
- 日志包含：已完成事项（勾选）、待办事项（未勾选）、备注
- 每次工作结束时，更新日志中的完成状态

## 工作原则

1. **小步推进**：每次只完成当前阶段的任务，不要跳到后续阶段
2. **可验证**：每个阶段结束有明确的验证标准，确认通过后再进入下一阶段
3. **安全第一**：`.env` 文件不得提交（已在 `.gitignore`），密钥不写入代码
4. **简洁代码**：不引入无关功能，不写多余注释
5. **优先使用已有工具**：Tailwind 类名、React Router API 等

## 常用命令

```bash
npm run dev      # 启动开发服务器（http://localhost:5173）
npm run build    # 生产构建
npm run preview  # 预览生产构建
```
