
# -------- 构建阶段：只安装依赖并编译项目，避免开发依赖进入最终镜像 --------
FROM node:22-alpine AS builder

WORKDIR /app
COPY package.json ./
# 只拷贝依赖相关文件，利用缓存加速构建
RUN npm install -g pnpm@9 && pnpm install --no-frozen-lockfile

COPY . .
# 编译项目，生成 dist 目录
RUN pnpm run build

# -------- 生产阶段：只保留编译产物和生产依赖，极大减少镜像体积 --------
FROM node:22-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/ecosystem.config.cjs ./
COPY package.json ./
# 生产环境只需要 package.json 用于安装生产依赖
RUN npm install -g pm2 pnpm@9 && pnpm install --prod --no-frozen-lockfile

# 使用 pm2-runtime 启动服务，保证进程管理和自动重启
CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]
