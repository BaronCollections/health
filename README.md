# MintBit 薄荷比特

AI 驱动的个性化营养评估、方案建议与社区陪伴平台。

## Phase 1 Snapshot

- 当前交付重点：`手机端 H5` + `完整双语` + `生命绿 #6DB578` 品牌视觉
- 当前工程进度：`11 / 12 = 92%`
- 当前已完成主链路：首页、问卷、报告、OCR 上传与确认、历史画报时间轴、打卡、社区、社区审核 H5
- 当前账户中心能力：统一 `/profile` 入口、通知中心分类流、消息详情页、批量已读、帮助中心 FAQ、反馈表单、反馈记录、隐私中心、导出申请、删除申请、安全快照、审核与操作留痕页
- 当前社区能力：推荐 feed、发帖、帖子详情、评论、我的帖子、审核状态、运营审核列表页
- 当前账户中心进展：`平台级账户中心节点已完成`，下一步进入发布加固、企业微信接入预留、Web 扩展预留
- 后续节点：通知/帮助/隐私双语化、发布加固、企业微信接入预留、Web 扩展预留

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
- `/pricing`：兼容旧入口，已重定向到 `/profile`

当前社区模块已经重构为移动优先结构：

- `/community`：推荐 feed 与圈子流
- `/community/create`：发帖页
- `/community/post/[id]`：帖子详情与评论
- `/community/me`：我的帖子与审核状态
- `/ops/community-review`：手机 H5 运营审核页

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
├── backend/           # Spring Boot 3.2
├── poster-service/    # Puppeteer renderer
├── docs/              # PRD / technical / execution / node plans
├── nginx/             # Reverse proxy config
├── sql/               # Database init scripts
└── scripts/           # Deploy & maintenance
```
