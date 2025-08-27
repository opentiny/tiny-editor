# TinyEditor 协同编辑后端服务

基于 Yjs 和 WebSocket 的实时协同编辑后端服务，支持多用户实时协作编辑，使用 MongoDB 进行文档持久化。

## 快速开始

### 环境变量配置

```bash
cp .env.example .env
```

参照下方表格进行配置 `.env` 文件
| 变量名 | 必需 | 默认值 | 说明 |
| -------------------- | ---- | ------ | -------------------------------------------------------------- |
| `HOST` | ✅ | - | 服务器监听地址 |
| `PORT` | ✅ | - | WebSocket 服务端口 |
| `MONGODB_URL` | ✅ | - | MongoDB 连接字符串 |
| `MONGODB_DB` | ✅ | - | MongoDB 数据库名称 |
| `MONGODB_COLLECTION` | ✅ | - | MongoDB 集合名称 |
| `GC` | ❌ | `true` | 是否启用 Yjs 垃圾回收 |

### Docker 容器化部署(推荐)

使用 Docker Compose 一键启动（包含 MongoDB）：

```bash
docker compose up --build
```

### 本地部署

启动 mongodb

```bash
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD="admin!123" \
  -v mongodb_data:/data/db \
  mongo:latest
```

修改 `.env MongoDB URL`

```bash
MONGODB_URL=mongodb://admin:admin!123@localhost:27017/?authSource=admin
```

启动本地服务器

```bash
npm install -g pm2
npm install
npm start
```

## 前端配置

(非完整前端配置主要参考 provider 部分)

```javascript
import TinyEditor from '@opentiny/fluent-editor'

const editor = new TinyEditor('#editor', {
  theme: 'snow',
  modules: {
    collaboration: {
      provider: {
        type: 'websocket',
        options: {
          serverUrl: 'ws://localhost:1234',
          roomName: 'my-document',
        },
      },
    },
  },
})
```

## 开发指南

### MongoDB 持久化拓展

当前项目在 [`src/persistence/mongo.ts`](./src/persistence/mongo.ts) 类实现 MongoDB 持久化，基于 [`y-mongodb-provider`](https://github.com/MaxNoetzold/y-mongodb-provider) 库。

需要拓展当前持久化能力时，可参考 API 文档：[y-mongodb-provider API](https://github.com/MaxNoetzold/y-mongodb-provider?tab=readme-ov-file#api)

### 自定义持久化接口

要支持其他数据库（如 PostgreSQL、Redis 等），需要实现 `Persistence` 接口

| 方法名       | 参数                              | 返回值          | 说明                                         |
| ------------ | --------------------------------- | --------------- | -------------------------------------------- |
| `bindState`  | `docName: string`<br>`doc: Y.Doc` | `Promise<void>` | 文档初始化时调用，加载历史状态并设置实时同步 |
| `writeState` | `docName: string`<br>`doc: Y.Doc` | `Promise<void>` | 手动保存文档状态（可选使用）                 |
| `close`      | -                                 | `Promise<void>` | 服务器关闭时调用，清理资源                   |

### 更多社区持久化支持

[`adapter for Yjs`](https://github.com/search?q=adapter%20for%20Yjs&type=repositories)：

- [y-mongodb-provider](https://github.com/yjs/y-mongodb-provider)
- [y-redis](https://github.com/yjs/y-redis)
- [y-postgres](https://github.com/MaxNoetzold/y-postgresql)
