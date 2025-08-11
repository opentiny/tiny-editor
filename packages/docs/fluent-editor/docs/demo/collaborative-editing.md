# 协作编辑

TinyEditor 支持多人实时协作编辑功能，基于 Yjs 实现，支持 WebSocket 和 WebRTC 等连接方式。

## 前端依赖安装

**基础协作编辑（必需）：**

```bash
npm i quill-cursors y-protocols y-quill yjs y-indexeddb
```

**连接支持：**选择一种即可(要与对应后端协议匹配)

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
CollaborationModule.register()
FluentEditor.register('modules/collaborative-editing', CollaborationModule, true)
```

编辑器配置

```javascript
const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    'cursors': true,
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
MONGODB_URL="mongodb://localhost:27017" MONGODB_DB="yjs_documents" MONGODB_COLLECTION="documents" HOST="0.0.0.0" PORT="1234" npm start
```
