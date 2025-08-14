# 协作编辑

TinyEditor 支持多人实时协作编辑功能，基于 Yjs 实现，支持 WebSocket 和 WebRTC 等连接方式。

## 前端依赖安装

**基础协作编辑（必需）：**

```bash
npm i quill-cursors y-protocols y-quill yjs y-indexeddb
```

**连接支持**：选择一种即可(要与对应后端协议匹配)

```bash
npm i y-websocket
```

```bash
npm i y-webrtc
```

## 在线协同演示

下面是一个完整的协同编辑演示：

:::demo src=demos/collaborative-editing.vue
:::

## 基本用法

通过配置 `collaborative-editing` 模块可以开启协作编辑功能：

模块注册：

```javascript
import FluentEditor from '@opentiny/fluent-editor'
FluentEditor.register('modules/collaborative-editing', CollaborationModule, true)
```

编辑器配置：

```javascript
const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    'collaborative-editing': {
      provider: {
        type: 'websocket',
        options: {
          serverUrl: 'ws://localhost:1234',
          roomName: 'my-document',
        },
      },
      awareness: {
        state: {
          name: `user${Math.random().toString(36).substring(2, 15)}`,
          color: 'red',
        },
      },
      onConnect: () => {
        console.log('connected')
      },
      onDisconnect: () => {
        console.log('disconnected')
      },
      onSyncChange: (isSynced) => {
        console.log('synced', isSynced)
      },
    },
  },
})
```

## 后端集成

选择其中一种作为后端服务支持

### WebSocket 服务器

可以使用 [y-websocket-server](https://github.com/yjs/y-websocket-server/) 快速搭建 WebSocket 服务器。

```shell
git clone https://github.com/yjs/y-websocket-server.git
cd y-websocket-server
pnpm i
HOST=localhost PORT=1234 YPERSISTENCE=./dbDir npx y-websocket
```

`HOST`指定可访问地址，`PORT`指定暴露端口，`YPERSISTENCE`指定持久化目录。

### WebRTC 服务器

可以使用 [y-webrtc-server](https://github.com/yjs/y-webrtc/) 快速搭建 WebRTC 服务器。

```shell
git clone https://github.com/yjs/y-webrtc.git
cd y-webrtc
pnpm i
HOST=localhost PORT=4444 npx y-webrtc
```

## 自定义持久化

如果你有需要自定义持久化(存储到第三方数据库服务器)，可以参考 [y-websocket-custom-persistence](https://github.com/Yinlin124/y-websocket-custom-persistence), 对 y-websocket-server 进行修改

```shell
git clone https://github.com/Yinlin124/y-websocket-custom-persistence.git
cd y-websocket-custom-persistence
pnpm i
cp .env.example .env
pnpm start
```

## 配置说明

### 配置参数表格

| 参数           | 类型                                                                      | 必填 | 说明                |
| -------------- | ------------------------------------------------------------------------- | ---- | ------------------- |
| `provider`     | `WebRTCProviderConfig \| WebsocketProviderConfig \| CustomProviderConfig` | 是   | 连接提供者配置      |
| `awareness`    | `AwarenessOptions`                                                        | 否   | 用户感知配置        |
| `cursors`      | `boolean \| object`                                                       | 否   | 光标显示配置        |
| `ydoc`         | `Y.Doc`                                                                   | 否   | 自定义 Yjs 文档实例 |
| `onConnect`    | `() => void`                                                              | 否   | 连接成功回调        |
| `onDisconnect` | `() => void`                                                              | 否   | 连接断开回调        |
| `onError`      | `(error: Error) => void`                                                  | 否   | 错误处理回调        |
| `onSyncChange` | `(isSynced: boolean) => void`                                             | 否   | 同步状态变化回调    |

### provider（连接提供者）

**WebSocket 提供者配置：**

```javascript
provider: {
  type: 'websocket',
  options: {
    serverUrl: 'ws://localhost:1234',  // WebSocket 服务器地址
    roomName: 'my-document',          // 房间名称
    connect: true,                    // 是否自动连接，默认 true
    params: {},                       // 连接参数
    protocols: [],                    // WebSocket 协议
    resyncInterval: -1,               // 重新同步间隔（毫秒）
    maxBackoffTime: 2500,             // 最大退避时间
    disableBc: false                  // 是否禁用广播通道
  }
}
```

**WebRTC 提供者配置：**

```javascript
provider: {
  type: 'webrtc',
  options: {
    signaling: ['wss://signaling-server.com','wss://localhost:4444'], // 信令服务器列表
    roomName: 'my-document',          // 房间名称
    password: null,                   // 房间密码
    awareness: true,                  // 是否启用感知
    maxConns: 20,                     // 最大连接数
    filterBcConns: true,              // 是否过滤广播连接
    peerOpts: {}                      // WebRTC 对等连接选项
  }
}
```

**自定义提供者配置：(待写)**

### awareness（用户感知）

用于配置用户状态信息，让其他用户能够看到当前用户的信息：

```javascript
awareness: {
  state: {
    name: 'John Doe',                 // 用户名称，显示在光标旁
    color: '#ff6b6b'                  // 用户颜色，用于光标和选区
  },
  timeout: 30000,                     // 用户状态超时时间（毫秒）
}
```

#### 事件回调

| 回调函数       | 参数                | 说明                                      |
| -------------- | ------------------- | ----------------------------------------- |
| `onConnect`    | 无                  | 成功连接到协作服务器时触发                |
| `onDisconnect` | 无                  | 与协作服务器连接断开时触发                |
| `onError`      | `error: Error`      | 发生错误时触发，包含错误信息              |
| `onSyncChange` | `isSynced: boolean` | 文档同步状态变化时触发，`true` 表示已同步 |

#### 光标配置

具体含义可参照 [quill-cursors](https://github.com/reedsy/quill-cursors)

```javascript
cursors: {
  template: '<div class="custom-cursor">...</div>',
  hideDelayMs: 5000,
  hideSpeedMs: 0,
  selectionChangeSource: null,
  transformOnTextChange: true,
},
```
