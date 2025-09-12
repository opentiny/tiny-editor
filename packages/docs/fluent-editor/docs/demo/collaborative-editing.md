# 协作编辑

<p align="center">
<img src="/Tiny-editor-demo.png" alt="Tiny-editor-demo" width="600">
</p>

<p align="center"><b>TinyEditor 支持多人实时协作编辑，支持多种连接协议（如 WebSocket、WebRTC），可自定义后端持久化，适用于多场景的在线协同编辑需求。
</b></p>

## 在线协同演示

下面是一个完整的协同编辑演示：

:::demo src=demos/collaborative-editing.vue
:::

## 快速开始

### 前端配置

安装依赖

```bash
npm i quill-cursors y-protocols y-quill yjs y-indexeddb y-websocket
```

引入协同编辑模块

```javascript
import FluentEditor, { CollaborationModule } from '@opentiny/fluent-editor'
FluentEditor.register('modules/collaborative-editing', CollaborationModule, true)
```

编辑器基础配置：

```javascript
const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    'collaborative-editing': {
      provider: {
        type: 'websocket',
        options: {
          serverUrl: 'ws://localhost:1234',
          roomName: 'Tiny-Editor-Demo',
        },
      },
    },
  },
})
```

> 在 Vue 项目中集成协作编辑：[YuQue.vue](https://github.com/opentiny/tiny-editor/blob/main/packages/projects/src/views/yuque/YuQue.vue)

### 后端服务

安装依赖：

```bash
git clone https://github.com/yjs/y-websocket-server.git
cd y-websocket-server
pnpm i
```

启动服务：

| OS                 | 启动命令                                                                                |
| ------------------ | --------------------------------------------------------------------------------------- |
| Ubuntu/MacOS       | `HOST=localhost PORT=1234 YPERSISTENCE=./dbDir npx y-websocket`                         |
| Windows PowerShell | `$env:HOST="localhost"; $env:PORT="1234"; $env:YPERSISTENCE="./dbDir"; npx y-websocket` |

后端服务启动成功后，编辑器即可实现多人实时协同编辑

---

## 编辑器配置说明

### Provider 配置

Provider 用于管理和同步多个用户之间的数据。它负责将本地的编辑操作与远程的其他用户进行实时同步。

#### WebSocket Provider

| 参数             | 类型                     | 必填 | 默认值 | 说明                 |
| ---------------- | ------------------------ | ---- | ------ | -------------------- |
| `serverUrl`      | `string`                 | 是   | -      | WebSocket 服务器地址 |
| `roomName`       | `string`                 | 是   | -      | 房间名称             |
| `connect`        | `boolean`                | 否   | `true` | 是否自动连接         |
| `params`         | `Record<string, string>` | 否   | -      | 连接参数             |
| `protocols`      | `string[]`               | 否   | -      | WebSocket 协议       |
| `resyncInterval` | `number`                 | 否   | -      | 重新同步间隔（毫秒） |
| `maxBackoffTime` | `number`                 | 否   | -      | 最大退避时间         |

#### 示例

```javascript
provider: {
  type: 'websocket',
  options: {
    serverUrl: 'ws://localhost:1234',
    roomName: 'demo-room',
    connect: true,
    resyncInterval: 3000,
    maxBackoffTime: 2500,
    params: { token: 'your-token' },
    protocols: ['json'],
  }
}
```

---

#### WebRTC Provider

> **注意：** 需要额外安装 WebRTC 依赖 `npm i y-webrtc`，并且搭配 WebRTC 后端使用

| 参数            | 类型                      | 必填 | 默认值 | 说明                |
| --------------- | ------------------------- | ---- | ------ | ------------------- |
| `type`          | `'webrtc'`                | 是   | -      | 提供者类型          |
| `roomName`      | `string`                  | 是   | -      | 房间名称            |
| `signaling`     | `string[]`                | 否   | -      | 信令服务器列表      |
| `filterBcConns` | `boolean`                 | 否   | -      | 是否过滤广播连接    |
| `maxConns`      | `number`                  | 否   | -      | 最大连接数          |
| `password`      | `string`                  | 否   | -      | 房间密码            |
| `peerOpts`      | `Record<string, unknown>` | 否   | -      | WebRTC 对等连接选项 |

---

#### 自定义 Provider

TinyEditor 支持注册自定义的 Provider 类型，您可以实现自己的连接提供者。

> **提示：** Yjs 生态系统提供了多种现成的 Provider 可供选择和参考，详见：[Yjs Connection Provider](https://docs.yjs.dev/ecosystem/connection-provider)。您可以基于这些 Provider 进行二次开发，或者作为实现自定义 Provider 的参考。

##### UnifiedProvider 接口

所有自定义 Provider 都必须实现 `UnifiedProvider` 接口：

```typescript
interface UnifiedProvider {
  type: string // Provider 类型标识
  awareness: Awareness // 感知实例
  document: Y.Doc // Yjs 文档
  connect: () => void // 连接方法
  destroy: () => void // 销毁方法
  disconnect: () => void // 断开连接方法
  isConnected: boolean // 连接状态
  isSynced: boolean // 同步状态

  // 事件处理器
  onConnect?: () => void // 连接成功回调
  onDisconnect?: () => void // 断开连接回调
  onError?: (error: Error) => void // 错误回调
  onSyncChange?: (isSynced: boolean) => void // 同步状态变化回调
}
```

##### 创建自定义 Provider

1. **实现 Provider 类**

```typescript
import type { ProviderConstructorProps, UnifiedProvider } from '@opentiny/fluent-editor'
import type { Awareness } from 'y-protocols/awareness'
import * as Y from 'yjs'

export class MyCustomProvider implements UnifiedProvider {
  type = 'my-custom'
  isConnected = false
  isSynced = false

  constructor({ options, awareness, doc, onConnect, onDisconnect, onError, onSyncChange }: ProviderConstructorProps<{ endpoint: string }>) {
    this.document = doc
    this.awareness = awareness
    this.onConnect = onConnect
    this.onDisconnect = onDisconnect
    this.onError = onError
    this.onSyncChange = onSyncChange
    // 以上参数都会传入，可直接接收或重新定义

    // 自定义逻辑
    this.connect()
  }

  connect = () => {
    // 连接逻辑
    // 例如
    // const provider = new WebsocketProvider(
    //     options.serverUrl,
    //     options.roomName,
    //     this.document,
    //     {
    //       awareness: this.awareness,
    //       ...options,
    //     },
    // )
    // provider.connect();
  }

  disconnect = () => {}
  destroy = () => {}
}
```

2. **注册 Provider**

```typescript
import { registerProviderType } from '@opentiny/fluent-editor'
import { MyCustomProvider } from './MyCustomProvider'

registerProviderType('my-custom', MyCustomProvider)
```

3. **使用自定义 Provider**

```typescript
const editor = new FluentEditor('#editor', {
  modules: {
    'collaborative-editing': {
      provider: {
        type: 'my-custom',
        options: {
          endpoint: 'https://my-service.com/api',
        },
      },
    },
  },
})
```

---

### Awareness 配置

Awareness 实现用户在线状态、光标位置等信息的实时同步。每个用户的在线状态、名称、颜色、光标位置等会自动广播给其他协作者，实现多人编辑时的身份和操作可视化。

| 参数      | 类型             | 必填 | 说明                 |
| --------- | ---------------- | ---- | -------------------- |
| `state`   | `AwarenessState` | 否   | 用户状态信息         |
| `timeout` | `number`         | 否   | 用户状态超时时间(ms) |

#### AwarenessState 结构

| 参数    | 类型     | 必填 | 默认值       | 说明                               |
| ------- | -------- | ---- | ------------ | ---------------------------------- |
| `name`  | `string` | 否   | `User ${id}` | 用户名称                           |
| `color` | `string` | 否   | `#ff6b6b`    | 用户颜色，用于光标和选区的颜色显示 |

#### 示例

```javascript
awareness: {
  state: {
    name: `user${Math.random().toString(36).substring(2, 8)}`,
    color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
  },
  timeout: 30000,
}
```

---

### 事件回调

| 回调函数       | 参数                | 说明                                      |
| -------------- | ------------------- | ----------------------------------------- |
| `onConnect`    | 无                  | 成功连接到协作服务器时触发                |
| `onDisconnect` | 无                  | 与协作服务器连接断开时触发                |
| `onSyncChange` | `isSynced: boolean` | 文档同步状态变化时触发，`true` 表示已同步 |

---

### Cursors 配置

`cursors` 默认开启，并且支持以下配置（详细配置可见 [quill-cursors](https://github.com/reedsy/quill-cursors)）：

| 参数                    | 类型      | 默认值 | 说明                   |
| ----------------------- | --------- | ------ | ---------------------- |
| `template`              | `string`  | -      | 光标模板               |
| `hideDelayMs`           | `number`  | `5000` | 光标隐藏延迟时间       |
| `hideSpeedMs`           | `number`  | `0`    | 光标隐藏动画速度       |
| `selectionChangeSource` | `string`  | -      | 选择变化源             |
| `transformOnTextChange` | `boolean` | `true` | 文本变化时是否转换光标 |

#### 示例

> 注意光标模板内的类名不可变

```javascript
const CURSOR_CLASSES = {
  SELECTION_CLASS: 'ql-cursor-selections',
  CARET_CONTAINER_CLASS: 'ql-cursor-caret-container',
  CARET_CLASS: 'ql-cursor-caret',
  FLAG_CLASS: 'ql-cursor-flag',
  NAME_CLASS: 'ql-cursor-name',
}

cursors: {
  template: `
    <span class="${CURSOR_CLASSES.SELECTION_CLASS}"></span>
    <span class="${CURSOR_CLASSES.CARET_CONTAINER_CLASS}">
      <span class="${CURSOR_CLASSES.CARET_CLASS}"></span>
    </span>
    <div class="${CURSOR_CLASSES.FLAG_CLASS}">
      <small class="${CURSOR_CLASSES.NAME_CLASS}"></small>
    </div>
  `,
  hideDelayMs: 300,
  hideSpeedMs: 300,
  transformOnTextChange: true,
}
```

---

## 更多后端服务支持

### WebSocket 服务器

可以使用 [y-websocket-server](https://github.com/yjs/y-websocket-server/) 快速搭建 WebSocket 服务器。

安装依赖：

```bash
git clone https://github.com/yjs/y-websocket-server.git
cd y-websocket-server
pnpm i
```

启动服务：

| 操作系统           | 启动命令                                                                                |
| ------------------ | --------------------------------------------------------------------------------------- |
| Ubuntu/MacOS       | `HOST=localhost PORT=1234 YPERSISTENCE=./dbDir npx y-websocket`                         |
| Windows PowerShell | `$env:HOST="localhost"; $env:PORT="1234"; $env:YPERSISTENCE="./dbDir"; npx y-websocket` |

`HOST`指定可访问地址，`PORT`指定暴露端口，`YPERSISTENCE`指定持久化目录。

### WebRTC 服务器

可以使用 [y-webrtc-server](https://github.com/yjs/y-webrtc/) 快速搭建 WebRTC 服务器。

安装依赖：

克隆 WebRTC 服务端仓库并安装依赖：

```bash
git clone https://github.com/yjs/y-webrtc.git
cd y-webrtc
pnpm i
```

启动服务：

| 操作系统           | 启动命令                                                |
| ------------------ | ------------------------------------------------------- |
| Ubuntu/MacOS       | `HOST=localhost PORT=4444 npx y-webrtc`                 |
| Windows PowerShell | `$env:HOST="localhost"; $env:PORT="4444"; npx y-webrtc` |

---

## 自定义持久化

TinyEditor 基于 WebSocket 提供了自定义的协同编辑后端服务，支持 MongoDB 持久化和 Docker 容器化部署。

详细的自定义持久化服务配置和部署请参考：[collaborative-editing-backend](https://github.com/opentiny/tiny-editor/tree/ospp-2025/collaborative-editing/packages/collaborative-editing-backend)
