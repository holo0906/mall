# Mall
English | [简体中文](https://github.com/holo0906/mall/blob/main/README-zh.md)
> This is a simple mall project.
Page and data reference[Exrick/xmall](https://github.com/Exrick/xmall)
## Technology used
- Vue2 + Vuex + Vue Router + Element UI + ES6 + axios + Node.js
## Build Setup
```bash
# clone the project
git clone https://github.com/holo0906/mall.git

# enter the project directory
cd mall

# install dependency
npm install

# enter the server directory
cd server

# install dependency
npm i cors body-parse express jsonwebtoken -s

# It is not recommended to use cnpm directly. Since the installation, there will be all kinds of strange bugs. The problem of slow download speed of NPM can be solved by the following operations
npm install --registry=https://registry.npm.taobao.org

# start the server
nodemon app.js(Self install without nodemon) or node app.js

# start project
npm run serve
```
browser access http://localhost:8080
## Run Error
> If this error occurs while running the project：
> This dependency was not found:
> axios in ./src/main.js
> To install it, you can run: npm install --save axios
> Error from chokidar (D:\): Error: EBUSY: resource busy or locked, lstat 'D:\pagefile.sys'

just re install axios,`npm install --save axios`
## License

[MIT](https://github.com/holo0906/mall/blob/main/LICENSE) License

Copyright (c) 2021 holo0906
