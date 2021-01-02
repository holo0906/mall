# Mall
> 这是一个简易的商城项目。
页面及数据参考[Exrick/xmall](https://github.com/Exrick/xmall)
## 所用技术
- Vue2 + Vuex + Vue Router + Element UI + ES6 + axios + Node.js
## Build Setup
```bash
# 克隆项目
git clone https://github.com/holo0906/mall.git

# 进入项目目录
cd mall

# 安装依赖
npm install

# 进入server目录
cd server

# 安装依赖
npm i cors body-parse express jsonwebtoken -s

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务器
nodemon app.js（没有安装nodemon的自行安装） 或 node app.js

# 启动项目
npm run serve
```
浏览器访问 http://localhost:8080
## License

[MIT](https://github.com/holo0906/mall/blob/main/LICENSE) License

Copyright (c) 2021 holo0906
