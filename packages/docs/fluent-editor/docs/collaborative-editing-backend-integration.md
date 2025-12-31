# 协同编辑后端集成

协同编辑后端为 OpenTiny Fluent Editor 提供实时同步基础设施，基于 Yjs 构建，采用 WebSocket 通信和 MongoDB 持久化。该服务支持多用户同时协作编辑文档，通过无冲突的操作转换实现协同。

## 架构概览

![](../public/images/协同编辑后端架构.png)

后端架构遵循清晰的关注点分离原则，包含三个主要组件：

- WebSocket 服务器：处理与客户端的实时双向通信
- Yjs 引擎：使用 CRDT 算法管理文档状态同步
- 持久化层：提供文档持久化和恢复能力

## 核心组件

### WebSocket 服务器实现

服务器入口点 (server.ts) 建立 HTTP 服务器和 WebSocket 处理：

```typescript
const server = http.createServer((_request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})
 
const wss = new WebSocketServer({ server })
wss.on('connection', setupWSConnection)
```

服务器创建最小的 HTTP 端点用于健康检查，并通过 utils.ts 中的 setupWSConnection 函数配置 WebSocket 处理。

### 文档管理 (WSSharedDoc)

WSSharedDoc 类扩展 Yjs 的 Y.Doc 以提供协同文档管理：

- 连接跟踪：维护每个文档的 WebSocket 连接映射
- 感知协议：处理用户在线状态和光标信息
- 更新广播：将文档变更分发给所有连接的客户端
- 生命周期管理：处理文档创建、同步和清理

关键实现位于 utils.ts：

```typescript
export class WSSharedDoc extends Y.Doc {
  name: string
  conns: Map<WebSocket, Set<number>>
  awareness: awarenessProtocol.Awareness
  whenInitialized: Promise<void>
}
```

## 持久化层架构

### MongoDB 集成

持久化系统使用 y-mongodb-provider 进行文档存储，实现于 mongo.ts：

```typescript
export class MongoPersistence implements Persistence {
  private mongodbPersistence: MongodbPersistence
  private client: MongoClient
  private connected = false
}
```

MongoDB 持久化提供：

- 自动更新：实时存储文档变更
- 文档恢复：连接时加载持久化状态
- 连接管理：健壮的 MongoDB 连接处理
- 配置灵活性：基于环境的配置

### 持久化接口

系统在 index.ts 中定义了清晰的持久化接口：

| 方法 | 参数 | 返回值 | 描述 |
| -- | -- | -- | -- |
| `connect` | - | `Promise<void>` | 建立数据库连接 |
| `bindState` | `docName: string, doc: Y.Doc` | `Promise<void>` | 加载历史记录并启用实时同步 |
| `writeState` | `docName: string, doc: Y.Doc` | `Promise<void>` | 手动保存文档状态 |
| `close` | - | `Promise<void>` | 关闭时清理资源 |

## 部署选项

### Docker Compose（推荐）

最直接的部署方式是使用 Docker Compose 配合预构建镜像：

```yaml
services:
  mongodb:
    image: mongo:latest
    container_name: yjs-mongodb
    restart: always
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: admin
    volumes:
      - mongodb_data:/data/db
 
  websocket-server:
    image: yinlin124/collaborative-editor-backend:latest
    container_name: yjs-websocket-server
    restart: always
    ports:
      - '${PORT:-1234}:${PORT:-1234}'
    environment:
      HOST: ${HOST:-0.0.0.0}
      PORT: ${PORT:-1234}
      MONGODB_URL: ${MONGODB_URL:-mongodb://admin:admin@mongodb:27017/?authSource=admin}
      MONGODB_DB: ${MONGODB_DB:-tinyeditor}
      MONGODB_COLLECTION: ${MONGODB_COLLECTION:-documents}
    depends_on:
      - mongodb
```

此配置提供：

- MongoDB 数据库：持久化文档存储
- WebSocket 服务器：预构建的协同后端
- 环境配置：通过环境变量灵活自定义
- 依赖管理：自动服务启动顺序

### NPM 包集成

对于自定义部署，直接安装包：

```bash
npm install @opentiny/tiny-editor-collaborative-editing-backend
```

然后通过导入服务器实现和持久化层与现有基础设施集成。

## 配置管理

### 环境变量

后端使用环境变量进行配置 (env.ts)：

| 变量 | 默认值 | 描述 |
| -- | -- | -- |
| HOST | 0.0.0.0 | 服务器监听接口 |
| PORT | 1234 | WebSocket 服务器端口 |
| MONGODB_URL | - | MongoDB 连接字符串 |
| MONGODB_DB | tinyeditor | 数据库名称 |
| MONGODB_COLLECTION | documents | 集合名称 |
| GC_ENABLED | true | 文档垃圾回收 |

### 生产部署

对于生产环境，Dockerfile 使用多阶段构建：

1. 构建阶段：编译 TypeScript 并安装依赖
2. 生产阶段：使用 PM2 进程管理的最小运行时

ecosystem.config.cjs 提供 PM2 配置用于：

- 进程管理：自动重启和监控
- 日志管理：带时间戳的结构化日志
- 环境处理：支持 .env 文件
- 资源限制：可配置的重启阈值

## 自定义持久化实现

要支持其他数据库，实现 Persistence 接口：

```typescript
export class CustomPersistence implements Persistence {
  async connect(): Promise<void> {
    // 建立数据库连接
  }
  
  async bindState(docName: string, ydoc: Y.Doc): Promise<void> {
    // 加载文档历史并设置实时同步
  }
  
  async writeState(docName: string, ydoc: Y.Doc): Promise<void> {
    // 手动持久化文档
  }
  
  async close(): Promise<void> {
    // 清理资源
  }
}
```

持久化层设计为可扩展的。实现自定义持久化时，确保正确的错误处理和连接管理，以在网络中断或数据库故障期间保持服务可靠性。

## 与 TinyEditor 集成

协同后端通过 WebSocket 协议与 Fluent Editor 无缝集成。客户端连接使用 Yjs 协议建立文档同步：

1. 建立连接：到后端服务器的 WebSocket 连接
2. 文档同步：使用 Yjs 同步协议进行初始状态同步
3. 实时更新：双向更新传播
4. 感知共享：用户在线状态和光标信息

后端同时处理多个文档，每个文档通过其 URL 路径标识。这允许多个协同会话在同一服务器实例上并发运行。

## 性能考虑

### 内存管理

- 文档清理：无连接时自动移除非活动文档
- 垃圾回收：可配置的 GC 管理内存使用
- 连接跟踪：高效的 WebSocket 连接生命周期管理

### 数据库优化

- 批量更新：MongoDB 持久化使用可配置的刷新大小
- 索引策略：基于文档的集合组织
- 连接池：重用 MongoDB 连接以提高效率

> 对于高流量部署，考虑在应用程序级别实现连接池，并监控 MongoDB 性能指标以优化持久化层配置。

## 后续步骤

设置协同后端后，探索以下相关主题：

- [模块注册和配置](./module-registration-and-configuration.md) 用于集成协同功能
- [事件系统和钩子](../api/event-system-and-hooks.md) 用于处理协同事件
- [创建自定义模块](./creating-custom-modules.md) 用于扩展协同功能

协同编辑后端为使用 TinyEditor 构建实时协同应用提供了坚实基础，既提供快速部署的简便性，又具备自定义实现的灵活性。
