# 协作编辑

TinyEditor 支持多人实时协作编辑功能，基于 Yjs 实现，支持 WebSocket 和 WebRTC 等连接方式。

## 在线协同演示

下面是一个完整的协同编辑演示，包含两个编辑器实例，模拟不同用户的协同编辑场景：

:::demo src=demos/collaborative-editing.vue
:::

## 前端依赖安装

**基础协作编辑（必需）：**

```bash
npm i quill-cursors y-protocols y-quill yjs
```

**连接支持：** provider 选择一种即可(要与对应后端协议匹配)

```bash
npm i y-websocket
npm i y-webrtc
```

**离线功能支持：**

```bash
npm i y-indexeddb
```

## 后端配置

选择其中一种作为后端服务支持

### WebSocket 服务器

可以使用 [y-websocket-server](https://github.com/yjs/y-websocket-server/) 快速搭建 WebSocket 服务器。

```shell
HOST=localhost PORT=1234 YPERSISTENCE=./dbDir npx y-websocket
```

### WebRTC 服务器

可以使用 [y-webrtc-server](https://github.com/yjs/y-webrtc-server/) 快速搭建 WebRTC 服务器。

```shell
HOST=localhost PORT=4444 npx y-webrtc
```

## 基本用法

通过配置 `collaboration` 模块可以开启协作编辑功能：

```javascript
import FluentEditor from '@opentiny/fluent-editor'
CollaborationModule.register()
FluentEditor.register('modules/collaboration', CollaborationModule, true)

const editor = new FluentEditor('#editor', {
  theme: 'snow',
  modules: {
    cursors: true,
    collaboration: {
      cursors: true,
      provider: {
        // WebSocket 配置
        type: 'websocket',
        options: {
          serverUrl: 'ws://localhost:1234',
          roomName: 'my-document',
        },
        // 或者 WebRTC 配置
        // type: 'webrtc',
        // options: {
        //   roomName: 'my-document',
        //   signaling: ['ws://localhost:4444'],
        // },
      },
      awareness: {
        state: {
          name: `user${Math.random().toString(36).substring(2, 15)}`,
          color: 'red',
        },
      },
      offline: true, // { name: 'my-document' },
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
