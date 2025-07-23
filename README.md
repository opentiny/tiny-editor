# TinyEditor

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-6-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/opentiny/tiny-editor)

TinyEditor is a rich text editor based on Quill 2.0, which extends Quill with rich modules and formats such as table, image, link, clipboard, emoji, file, mention, and quick menu. It is framework-independent, compatible with Quill API, and compatible with Quill module ecosystem.

English | [简体中文](README.zh-CN.md)

## Features

TinyEditor has the following features and advantages:

- Contains more than 30 modules and formats, in addition to the 21 built-in formats in Quill, it also extends and enhances 15 modules and formats such as table, image, link, counter, emoji, file, clipboard, mention, quick menu, screenshot, etc.
- Powerful table function, supports inserting table with specified rows and columns in the toolbar, table row height/column width dragging, inserting rows/columns, deleting rows/columns, merging/splitting cells, and other rich table operations.
- It is not related to frameworks and can be used in multiple frameworks such as Vue, React, Angular, etc.
- Compatible with all Quill APIs, Quill ecosystem modules and formats.

![TinyEditor](fluent-editor.png)

## Quick Start

Install TinyEditor:

```shell
npm i @opentiny/fluent-editor
```

Write html：

```html
<div id="editor">
  <p>Hello TinyEditor!</p>
</div>
```

Import style:

```css
@import '@opentiny/fluent-editor/style.css';
```

Initialize the TinyEditor editor:

```javascript
import TinyEditor from '@opentiny/fluent-editor'

const editor = new TinyEditor('#editor', {
  theme: 'snow',
})
```

## Development

```shell
git clone git@github.com:opentiny/tiny-editor.git
cd tiny-editor
pnpm i
pnpm dev
```

Open your browser and visit: [http://localhost:5173/tiny-editor/](http://localhost:5173/tiny-editor/)

## Contributors ✨

Contributors are community members who have made contributions in OpenTiny.

<a href="https://www.openomy.com/github/opentiny/tiny-editor" target="_blank" style="display: block; width: 100%;" align="center">
  <img src="https://www.openomy.com/svg?repo=opentiny/tiny-editor&chart=bubble&latestMonth=99" target="_blank" alt="Contribution Leaderboard" style="display: block; width: 100%;" />
</a>

## Credits ❤️

Thanks to:

- The [quill](https://github.com/slab/quill) project, which is an API-driven rich text editor with a modular architecture, good scalability, ease of use, and cross-platform support. TinyEditor extends and enhances a large number of modules and formats such as tables, images, and hyperlinks based on Quill.
- The [quill-better-table](https://github.com/soccerloway/quill-better-table) project, which enhances the built-in table module of Quill and adds rich functionality. TinyEditor's table operation functionality is based on quill-better-table.
- The [quill-emoji](https://github.com/contentco/quill-emoji) project, which is a Quill module for emoji. TinyEditor's insert emoji function is based on quill-emoji.
- The [quill-blot-formatter](https://github.com/Fandom-OSS/quill-blot-formatter) project, which is a Quill module for resizing images and videos. TinyEditor's image scaling function is based on quill-blot-formatter.

## License

[MIT](LICENSE)
