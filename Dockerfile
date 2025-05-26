# Сборка
FROM node:18-alpine AS builder

WORKDIR /app
COPY . .

RUN yarn install --frozen-lockfile
RUN yarn build

# Прод-образ
FROM node:18-alpine AS runner

WORKDIR /app

# Только нужные файлы
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .
COPY --from=builder /app/next.config.js .
COPY --from=builder /app/yarn.lock .
COPY --from=builder /app/node_modules node_modules

EXPOSE 3000
CMD ["yarn", "start"]
