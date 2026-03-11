# MintBit 薄荷比特

AI 驱动的个性化维生素推荐平台

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS + Framer Motion + Three.js |
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
├── frontend/          # Next.js 14
├── backend/           # Spring Boot 3.2
├── poster-service/    # Puppeteer renderer
├── nginx/             # Reverse proxy config
├── sql/               # Database init scripts
└── scripts/           # Deploy & maintenance
```
