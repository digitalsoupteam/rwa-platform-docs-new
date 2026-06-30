FROM oven/bun:latest AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY . .
COPY .env.local .env.local

RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
