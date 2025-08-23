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

### 本地开发部署

```bash
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
    cursors: true,
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

### 自定义持久化

项目使用 [`MongoPersistence`](src/persistence/mongo.ts) 类实现 MongoDB 持久化。你可以实现 `Persistence` 接口来支持其他数据库：

```typescript
interface Persistence {
  bindState: (docName: string, doc: Y.Doc) => Promise<void>
  writeState: (docName: string, doc: Y.Doc) => Promise<void>
  close?: () => Promise<void>
}
```

#### 核心方法说明

- `bindState`: 文档初始化时调用，从数据库加载历史状态到 Y.Doc
- `writeState`: 文档变更时调用，将 Y.Doc 状态保存到数据库
- `close`: 服务器关闭时调用，清理资源

#### Yjs 核心 API

```typescript
import * as Y from 'yjs'

// 将更新应用到文档
Y.applyUpdate(ydoc, update)

// 将文档编码为更新
const update = Y.encodeStateAsUpdate(ydoc)

// 获取文档文本内容
const text = ydoc.getText('content').toString()
```

### 替代方案

如果需要更强大的功能或其他持久化支持，可以考虑以下开源方案：

- **[@y/websocket-server](https://github.com/yjs/y-websocket-server/)**: 官方 WebSocket 服务器
- **[y-redis](https://github.com/yjs/y-redis)**
- **[y-postgresql](https://github.com/MaxNoetzold/y-postgresql)**
