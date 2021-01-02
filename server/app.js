//1.初始化  npm init --yes
//2.下载依赖 cnpm i cors body-parse express jsonwebtoken -s

//获取实例，创建对象
const express = require('express');
const app = express();

//相当于导入一个模块
//服务器内置模块
//node.js commonJs规范
const fs = require('fs');

/**
 * @param {*当前页中显示的数量} pageSize
 * @param {*当前页} currentPage
 * @param {*当前数组} arr
 * @returns
 */
function pagination(pageSize, currentPage, arr) {
    let skipNum = (currentPage - 1) * pageSize;
    let newArr = (skipNum + pageSize >= arr.length) ? arr.slice(skipNum, arr.length) : arr.slice(skipNum, skipNum + pageSize);
    return newArr;
}

/**
 * @param {*排序的属性} attr
 * @param {*true表示升序排序  false表示降序排序} rev
 * @returns
 */
function sortBy(attr, rev) {
    if (rev === undefined) {
        rev = 1;
    } else {
        rev = rev ? 1 : -1;
    }
    return function (a, b) {
        a = a[attr];
        b = b[attr];
        if (a < b) {
            return rev * -1;
        }
        if (a > b) {
            return rev * 1;
        }
        return 0;
    }
}

/**
 * @param {*} arr
 * @param {*} gt
 * @param {*} lte
 */
function range(arr, gt, lte) {
    return arr.filter(item => item.salePrice >= gt && item.salePrice <= lte)
}

//引入jwt  安装 cnpm i jsonwebtoken -s
//jwt插件生成token等进行加密，用来表示用户的唯一标识
const jwt = require('jsonwebtoken')
//跨域中间件  安装 cnpm i cors -s
const cors = require('cors');
//处理post请求的中间件
const bodyParser = require('body-parser');
//导入 cartList.json
//引入对象
const cartListJSON = require('./db/cartList.json')

//跨域
app.use(cors());
//处理post请求
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
//首页
app.get('/api/goods/home', (req, res) => {
    //请求头、请求体、查询的参数和携带的数据等在req中
    //res 后端处理完数据之后返回的结果
    //读取文件 以utf-8格式读取
    fs.readFile('./db/home.json', 'utf8', (err, data) => {
        //如果没有错误，返回结果
        if (!err) {
            //fs获取出来的是一个字节流，需要进行转换
            res.json(JSON.parse(data));
        }
    })
})

//全部\品牌周边
app.get('/api/goods/allGoods', (req, res) => {
    //获取的是前端地址栏上的查询参数
    //query 查询参数  page 当前的页数  size 一页中显示的数量  sort 是否排序  priceGt 最小值  priceLte 最大值
    const page = parseInt(req.query.page);
    const size = parseInt(req.query.size);
    const sort = parseInt(req.query.sort);
    const gt = parseInt(req.query.priceGt);
    const lte = parseInt(req.query.priceLte);
    const cid = req.query.cid;
    let newData = []
    fs.readFile('./db/allGoods.json', 'utf8', (err, data) => {
        let {
            result
        } = JSON.parse(data);
        let allData = result.data;
        //先进行过滤
        if (gt && lte) {
            // 过滤 10~1000
            allData = range(allData, gt, lte);
        }
        // 分页显示
        newData = pagination(size, page, allData);
        if (cid === '1184') { //品牌周边
            newData = allData.filter((item) => item.productName.match(RegExp(/Smartisan/)))
            if (sort === 1) { //价格由低到高
                newData = newData.sort(sortBy('salePrice', true))
            } else if (sort === -1) { //价格由高到低
                newData = newData.sort(sortBy('salePrice', false))
            }
        } else {
            if (sort === 1) { //价格由低到高
                newData = newData.sort(sortBy('salePrice', true))
            } else if (sort === -1) { //价格由高到低
                newData = newData.sort(sortBy('salePrice', false))
            }
        }
        if (newData.length < size && gt && lte) {
            res.json({
                data: newData,
                total: newData.length
            })
        } else {
            res.json({
                data: newData,
                total: allData.length
            })
        }
    })
})

//商品详情
app.get('/api/goods/productDet', (req, res) => {
    //获取查询参数 productId
    const productId = req.query.productId;
    fs.readFile('./db/goodsDetail.json', 'utf8', (err, data) => {
        if (!err) {
            let {
                result
            } = JSON.parse(data);
            //查找id是否相等
            //  注意 这边别用 ===
            //console.log(typeof productId);    string
            //console.log(typeof result[0].productId);    number
            let newData = result.find(item => item.productId == productId)
            res.json(newData)
        }
    })
})

// 模拟一个登陆的接口
app.post('/api/login', (req, res) => {
    //console.log(req.body.user);
    // 登录成功获取用户名
    let username = req.body.user
    //一系列的操作
    res.json({
        // 进行加密的方法
        // sing 参数一：加密的对象 参数二：加密的规则 参数三：对象
        token: jwt.sign({
            username: username
        }, 'abcd', {
            // 过期时间
            expiresIn: "3000s"
        }),
        username,
        state: 1,
        file: '/static/images/1570600179870.png',
        code: 200,
        address: null,
        balance: null,
        description: null,
        email: null,
        message: null,
        phone: null,
        points: null,
        sex: null,
        id: 62
    })
})

// 登录持久化验证接口 访问这个接口的时候 一定要访问token（前端页面每切换一次，就访问一下这个接口，问一下我有没有登录/登陆过期）
// 先访问登录接口，得到token，在访问这个，看是否成功
app.post('/api/validate', function (req, res) {
    //前端设置请求拦截器，对每一次的请求，在请求头都添加 authorization 字段，将 token 传递到后端，进行验证
    //后端再重新计算，返回一个新的 token
    let token = req.headers.authorization;
    //console.log(token);

    // 验证token合法性 对token进行解码
    jwt.verify(token, 'abcd', function (err, decode) {
        //console.log(decode);
        if (err) {
            res.json({
                msg: '当前用户未登录'
            })
        } else {
            // 证明用户已经登录
            res.json({
                //重新计算签名，每一次登录都是一个新的token
                //防止 token 被爬虫者更改
                token: jwt.sign({
                    username: decode.username
                }, 'abcd', {
                    // 过期时间
                    expiresIn: "3000s"
                }),
                username: decode.username,
                msg: '已登录',
                address: null,
                balance: null,
                description: null,
                email: null,
                file: "/static/images/1570600179870.png",
                id: 62,
                message: null,
                phone: null,
                points: null,
                sex: null,
                state: 1,
            })
        }
    })
})

//添加到购物车
app.post('/api/addCart', (req, res) => {
    let {
        userId,
        productId,
        productNum
    } = req.body; //前端发送post请求，接收的请求体数据
    fs.readFile('./db/allGoods.json', (err, data) => {
        //获取所有的商品的数据
        let {
            result
        } = JSON.parse(data);
        if (productId && userId) {
            //id是否与当前用户id匹配，如果匹配则返回当前用户购物车数据
            //在cartList.json中进行查找，cartListJSON.result获取数组
            let {
                cartList
            } = cartListJSON.result.find(item => item.id == userId)
            // 找到对应的商品
            let newData = result.data.find(item => item.productId == productId);
            newData.limitNum = 100;

            //是否是第一次购买当前商品
            let flag = true;
            //当前用户可能未登录，可能返回空值
            if (cartList && cartList.length) {
                cartList.forEach(item => {
                    if (item.productId == productId) {
                        if (item.productNum >= 1) {
                            //修改标记，对于每一件商品
                            flag = false;
                            //如果不是第一次购买当前商品，则数量+1
                            item.productNum += parseInt(productNum);
                        }
                    }
                })
            }
            //首先执行
            if (!cartList.length || flag) { //购物车为空
                //将前端传过来的数据赋值，productNum是动态的
                newData.productNum = parseInt(productNum)
                //将商品添加
                cartList.push(newData);
            }

            // 序列化
            fs.writeFile('./db/cartList.json', JSON.stringify(cartListJSON), (err) => {
                if (!err) {
                    res.json({
                        code: 200,
                        message: "success",
                        result: 1,
                        success: true,
                        timestamp: 1571296313981,
                    })
                }
            })
        }
    })
})

//获取用户已经购买的商品数据
app.post('/api/cartList', (req, res) => {
    //从请求体获取用户id
    let {
        userId
    } = req.body;
    fs.readFile('./db/cartList.json', (err, data) => {
        let {
            result
        } = JSON.parse(data);
        let newData = result.find(item => item.id == userId);
        //注意这边返回的数据格式
        res.json({
            code: 200,
            cartList: newData,
            success: true,
            message: 'success'
        })
    })
})

//监听 3000 端口
app.listen(3000);