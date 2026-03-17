# MintBit 薄荷比特

AI 驱动的个性化营养评估、方案建议与社区陪伴平台。

## Phase 1 Snapshot

- 当前交付重点：`手机端 H5` + `完整双语` + `生命绿 #6DB578` 品牌视觉
- 当前工程进度：`12 / 12 = 100%`
- 当前已完成主链路：首页、问卷、报告、OCR 上传与确认、历史画报时间轴、打卡、社区、社区审核 H5、管理员发布检查、WeCom 骨架、Web 双壳层基础
- 当前账户中心能力：统一 `/profile` 入口、通知中心分类流、消息详情页、批量已读、帮助中心 FAQ、反馈表单、反馈记录、隐私中心、导出申请、删除申请、安全快照、审核与操作留痕页
- 当前社区能力：推荐 feed、发帖、帖子详情、评论、我的帖子、审核状态、运营审核列表页
- 当前发布基线：`/profile/admin/release-checklist` 管理员发布检查页、关键页面 fallback 可见化、WeCom 回调占位 `/auth/wecom/callback`、桌面双壳层 foundation
- 当前非阻塞工程警告：Next.js workspace root lockfile 警告、`baseline-browser-mapping` 数据过期警告
- 后续工作将转入：真实 WeCom OAuth/JS-SDK、Web 业务页面深度桌面化、发布自动化

## Mini Program Migration Snapshot

- 当前迁移载体：`miniprogram/`，已将 `VcGo` 宿主工程同步进 `health` 仓库
- 当前迁移阶段：`Release Readiness`
- 当前小程序总进度：`约 99%`
- 当前已完成：
  - 原生小程序运行时纯模块：`request / session / i18n / app-store / auth-store`
  - Node 基础测试与契约测试：`50` 个测试全部通过
  - MintBit 原生壳层：`app.js / app.json / app.wxss / custom-tab-bar`
  - 首批可运行页面：`home / profile / report / checkin / community / auth/login / auth/bind-phone`
  - 小程序认证契约：`/api/miniprogram/auth/login`、`/sms/send`、`/bind`、`/refresh`、`/me`
  - 登录绑定链路：`wx.login -> 后端登录 -> bind_required / authenticated`
  - 双语基础：`zh-CN / en` 语言切换、tabBar 文案、首页与账户页基础文案
  - 评估会话契约：`/api/assessment/create`、`/api/assessment/{id}/answer`、`/api/assessment/resume`
  - 原生问卷流：首页进入问卷、会话恢复、逐题提交、结果加载过渡页
  - 全量双语问卷题库：`30` 题、`showIf` 条件、`multi_choice` 多选题都已接入小程序
  - 原生 OCR 流：`结果加载 -> OCR 上传 -> OCR 确认 -> 报告 tab 回桥`
  - OCR 契约复用：`/api/assessment/{id}/report/upload`、`/api/assessment/{id}/report/result`
  - 原生报告页：报告 tab 已升级为真实详情页，接入评分、目标、OCR 状态、营养方案与建议
  - 原生时间轴：`/pages/report/timeline/index` 已接入历史快照、趋势摘要与社区桥接入口
  - 原生打卡页：`/pages/checkin/index/index` 已接入连续打卡、积分累计、报告方案回桥与空态处理
  - 原生社区页：`/pages/community/index/index` 已升级为真实 feed，接入推荐/圈子切换、时间轴桥接与帖子卡片
  - 原生发帖页：`/pages/community/create/index` 已接入圈子选择、标签建议、正文提交与本地回退状态
  - 原生帖子详情：`/pages/community/detail/index` 已接入点赞、收藏、评论输入与状态展示
  - 原生我的帖子：`/pages/community/my-posts/index` 已接入审核状态分栏与帖子进度追踪
  - 原生社区审核页：`/pages/community/review/index` 已接入审核队列分栏、审核动作与本地兜底状态同步
  - 社区运行时：`community content / api / session / view-model` 已独立成可测试模块
  - 原生账户首页：`/pages/profile/index/index` 已接入账户摘要、卡片入口、语言切换和管理员白名单显示
  - 原生通知流：`/pages/profile/notifications/*` 已接入分类筛选、批量已读和消息详情
  - 原生帮助与反馈：`/pages/profile/help/*` 已接入 FAQ、反馈表单与反馈记录状态流
  - 原生隐私与数据控制：`/pages/profile/privacy/*` 已接入导出申请、删除申请、文档说明与状态展示
  - 原生安全与审计：`/pages/profile/security/index`、`/pages/profile/audit-log/index` 和管理员检查页已可访问
  - 账户运行时：`account content / api / state / runtime / view-model` 已独立成可测试模块
  - 小程序发布收口：`project.config.json` 已切到 MintBit 业务编译场景，`miniprogram/README.md` 与本地校验脚本已补齐
  - 工程清理：旧 TDesign 示例页、示例 helper 组件、`miniprogram_npm` 包和 miniapp 残留配置已从 `miniprogram/` 移除，当前工程只保留 MintBit 微信小程序业务页
- 当前仍待完成：
  - 微信开发者工具内的最终手工验收与提审

## Current Product Shape

MintBit Phase 1 目前围绕一条完整的“评估 -> 报告 -> 打卡 -> 社区”闭环展开。移动端 H5 已具备双语基础、健康问卷、OCR 报告补录、个性化营养建议、历史画报时间轴、每日打卡，以及带审核状态的社区互动流。

当前账户入口已经收口到统一平台账户中心：

- `/profile`：账户中心首页，承接消息、帮助、隐私、数据与偏好
- `/profile/notifications`：系统通知 / 社区互动 / 打卡提醒分类流，支持批量已读
- `/profile/notifications/[id]`：消息详情页与相关动作跳转
- `/profile/help`：帮助中心、FAQ 与支持入口
- `/profile/help/feedback`：反馈表单
- `/profile/help/records`：反馈记录与状态流
- `/profile/privacy`：隐私、权限与数据控制入口
- `/profile/privacy/export`：数据导出申请状态流
- `/profile/privacy/delete-request`：删除申请状态流
- `/profile/security`：账户安全与偏好快照
- `/profile/audit-log`：审核与操作留痕说明
- `/profile/admin/release-checklist`：管理员发布检查页，展示运行时、关键路径、合规入口和平台预留状态
- `/pricing`：兼容旧入口，已重定向到 `/profile`

当前社区模块已经重构为移动优先结构：

- `/community`：推荐 feed 与圈子流
- `/community/create`：发帖页
- `/community/post/[id]`：帖子详情与评论
- `/community/me`：我的帖子与审核状态
- `/ops/community-review`：手机 H5 运营审核页

当前平台预留已经形成代码骨架：

- `/auth/wecom/callback`：企业微信回调占位页
- `frontend/src/lib/platform/wecom.ts`：企业微信降级安全 adapter skeleton
- `frontend/src/components/shells/*`：移动端 / 桌面端双壳层基础
- `docs/release-checklist.md`：与产品内管理员检查页对齐的发布术语文档

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16 + TypeScript + Tailwind CSS |
| Backend | Java 17 + Spring Boot 3.2 + MyBatis-Plus |
| Database | PostgreSQL 16 + Redis 7 |
| Storage | MinIO (S3-compatible) |
| Queue | RabbitMQ |
| AI | Claude API + PaddleOCR |
| Poster | Puppeteer (Node.js) |
| Gateway | Nginx |
| Deploy | Docker Compose |

## Quick Start

```bash
# 1. Clone
git clone https://github.com/BaronCollections/health.git
cd health

# 2. Configure
cp .env.example .env
# Edit .env with your credentials

# 3. Deploy
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| Nginx | 80/443 | Gateway & Reverse Proxy |
| Frontend | 3000 | Next.js Web App |
| Backend | 8080 | Spring Boot API |
| Poster Service | 3001 | Puppeteer Renderer |
| PostgreSQL | 5432 | Primary Database |
| Redis | 6379 | Cache & Session |
| MinIO | 9000/9001 | Object Storage |
| RabbitMQ | 5672/15672 | Message Queue |
| PaddleOCR | 8866 | OCR Service |

## Project Structure

```
health/
├── docker-compose.yml
├── .env.example
├── frontend/          # H5 app / bilingual routes / community ops H5
├── miniprogram/       # Native WeChat Mini Program migration workspace
├── backend/           # Spring Boot 3.2
├── poster-service/    # Puppeteer renderer
├── docs/              # PRD / technical / execution / node plans
├── nginx/             # Reverse proxy config
├── sql/               # Database init scripts
└── scripts/           # Deploy & maintenance
```
