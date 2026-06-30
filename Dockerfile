FROM oven/bun:latest AS base
WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --ignore-scripts

COPY . .
COPY .env .env

RUN bunx fumadocs-mdx

RUN bun run build

EXPOSE 3000
CMD ["bun", "run", "start"]
