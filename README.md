# Katalog

Монорепозиторий:
- apps/web — Next.js frontend
- apps/api — NestJS backend
- packages/shared — общие типы

## Быстрый старт

1. Запустить Postgres:
   - cd infra
   - docker-compose up -d
2. Установить зависимости:
   - pnpm install
3. Запустить dev:
   - pnpm dev

Backend слушает порт 4000 (health: /health).