# React Boilerplate

超大型 react 项目构建脚手架，让超大型 react 项目构建有飞一般的感觉。

## 特性

- 采用 webpack2+gulp 构建，构建流程可高度自定义。
- 独特的 scope 构建模式，可以细分执行构建的子项目。
- 使用 browser-sync 作为DEV服务器，支持多端同步。

## 支持环境

* node >= 5.4
* npm >= 3

## 如何安装

将项目检出到本地，执行安装命令，之后打开浏览器访问 http://127.0.0.1:3000。

```bash
$ git clone git@github.com:Rockcookies/hqy-react-boilerplate.git
$ npm install
$ npm run serve
```



强烈建议使用 yarn 替换 npm 作为包管理器，具体可移步 [快速、可靠、安全的依赖管理 - YARN](https://yarnpkg.com)。

## 构建命令

项目大部分配置在 **config.js** 里面，其中比较关键是配置项 **scope**，初始化的子项目必须在 **all_scopes** 中定义。

```js
//...

const BASE_CONFIG = {
  //...
  all_scopes: [
    'common' // 公共模块
    // 新建的模块在这里加入
  ],
  //...
}
//...
```

### pack 命令

```bash
npm run pack
```

在当前项目的 .temp 路径生成 debug 和 static 文件夹，其中 debug 文件夹为 DEV 模式构建版本，static 文件夹为 PROD 模式构建版本。

### watch 命令

```bash
npm run watch
```

启动 DEV 模式，监听项目文件改动，不启动内置的 browser-sync 服务器。

### serve 命令

```bash
npm run serve
```

启动 DEV 模式，监听项目文件改动并启动内置的 browser-sync 服务器，可实现代理API服务器，多端同步等功能。

### lint 命令

```bash
npm run lint
```

启动 eslint 检查。


## 构建参数

在构建项目时可以加入构建参数可实现进一步的自定义流程构建功能，示例：

```bash
npm run deploy -- --dest=public --debug=true --compile=css_minify,js_minify --scope=common,portal
```

### scope 参数

重要的运行参数，可以指定一个或多个 scope (子项目) 执行构建，多个 scope 请使用逗号分割，示例：

```bash
npm run serve -- --scope=common,portal
```

### dest 参数

项目构建目的文件夹路径，示例：

```bash
npm run deploy -- --dest=public
```

### compile 参数

项目构建时编译属性，可以指定一个或多个编译属性，多个编译属性请使用逗号分割，示例：

```bash
npm run serve -- --compile=css_minify,js_minify
```

编译属性定义如下：

```js
// 项目提供的编译属性
{
  html_minify: false, // 是否开启压缩 html
  css_minify: false, // 是否开启压缩 CSS
  css_map: false, // 是否生成 CSS source map
  js_minify: false, // 是否开启压缩 JS
  js_map: false // 是否生成 JS source map
}

// DEV 默认编译属性
{
  css_map: true,
  js_map: true
}

// PROD 默认编译属性
{
  html_minify: true,
  css_minify: true,
  js_minify: true
}

```
传入该参数会覆盖 DEV 或 PROD 模式下的默认编译属性，如 DEV 默认编译属性为 `css_map,js_map`，如过传入 `html_minify,js_map` 则会把 DEV 模式的编译属性覆盖，即最终编译属性为 `html_minify,js_map`。

### debug 参数

该参数通常在调试时使用，会在控制台打印更多的构建日志，示例：

```bash
npm run deploy -- --debug=true
```

## License

This project is licensed under the MIT license, Copyright (c) 2017 RockCookies. For more information see LICENSE.md.
