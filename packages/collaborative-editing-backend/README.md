# TinyEditor 协同编辑后端服务

基于 Yjs 和 WebSocket 的实时协同编辑后端服务，支持多用户实时协作编辑，使用 MongoDB 进行文档持久化。

## 快速开始

### 本地开发部署

```bash
cp .env.example .env
npm install
npm start
```

### Docker 容器化部署

使用 Docker Compose 一键启动（包含 MongoDB）：

```bash
cp .env.example .env
docker compose up --build
```

## 环境变量配置

创建 `.env` 文件并配置以下环境变量：

### 环境变量说明

| 变量名               | 必需 | 默认值 | 说明                                                      |
| -------------------- | ---- | ------ | --------------------------------------------------------- |
| `HOST`               | ✅   | -      | 服务器监听地址                                            |
| `PORT`               | ✅   | -      | WebSocket 服务端口                                        |
| `MONGODB_URL`        | ✅   | -      | MongoDB 连接字符串                                        |
| `MONGODB_DB`         | ✅   | -      | MongoDB 数据库名称                                        |
| `MONGODB_COLLECTION` | ✅   | -      | MongoDB 集合名称                                          |
| `YDOC_TEXT_KEY`      | ❌   | -      | Yjs 文档中文本内容的键名(默认为 tiny-editor 已与前端对应) |
| `GC`                 | ❌   | `true` | 是否启用 Yjs 垃圾回收                                     |

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

如果需要更强大的功能，可以考虑以下开源方案：

- **[@y/websocket-server](https://github.com/yjs/y-websocket-server/)**: 官方 WebSocket 服务器
- **[Hocuspocus](https://tiptap.dev/hocuspocus)**: 功能丰富的协同编辑服务器
- **[y-sweet](https://github.com/drifting-in-space/y-sweet)**: Rust 实现的高性能服务器
- **[yrs-warp](https://github.com/y-crdt/yrs-warp)**: 基于 Warp 的 Rust 服务器
