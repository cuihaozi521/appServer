"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var ws_1 = require("ws");
var app = express();
var Product = /** @class */ (function () {
    function Product(id, title, price, desc, rating, category) {
        this.id = id;
        this.title = title;
        this.price = price;
        this.desc = desc;
        this.rating = rating;
        this.category = category;
    }
    return Product;
}());
exports.Product = Product;
var Comment = /** @class */ (function () {
    function Comment(id, productId, timestamp, user, rating, content) {
        this.id = id;
        this.productId = productId;
        this.timestamp = timestamp;
        this.user = user;
        this.rating = rating;
        this.content = content;
    }
    return Comment;
}());
exports.Comment = Comment;
var products = [
    new Product(1, '第一个商品', 1.99, '这是描述信息!', 1, ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 2.99, '这是描述信息!', 3, ['图书']),
    new Product(3, '第三个商品', 2.99, '这是描述信息!', 2, ['硬件设备']),
    new Product(4, '第四个商品', 1.99, '这是描述信息!', 1, ['电子产品', '硬件设备']),
    new Product(5, '第一个商品', 2.99, '这是描述信息!', 4, ['硬件设备']),
    new Product(6, '第一个商品', 1.99, '这是描述信息!', 5, ['电子产品'])
];
var comments = [
    new Comment(1, 1, "2017-02-02", "张三", 3, "东西不错"),
    new Comment(2, 1, "2011-02-02", "张三1", 4, "东西不错"),
    new Comment(3, 1, "2014-02-02", "张三2", 3, "东西不错"),
    new Comment(4, 2, "2018-02-02", "张三3", 3, "东西不错")
];
app.get('/', function (req, res) {
    res.send('hello express!!');
});
app.get('/api/products', function (req, res) {
    var result = products;
    var params = req.query;
    if (params.title) {
        params.title = decodeURI(params.title);
        result = result.filter(function (p) {
            return p.title.indexOf(params.title) !== -1;
        });
    }
    console.dir(params.category);
    if (params.category) {
        if (params.category !== '-1') {
            params.category = decodeURI(params.category);
            result = result.filter(function (p) {
                return p.category.indexOf(params.category) !== -1;
            });
        }
    }
    if (params.price) {
        result = result.filter(function (p) { return p.price <= parseInt(params.price); });
    }
    console.dir(result);
    res.json(result);
});
app.get('/api/products/:id', function (req, res) {
    res.json(products.find(function (products) { return products.id == req.params.id; }));
});
app.get('/api/products/:id/comments', function (req, res) {
    res.json(comments.filter(function (comments) { return comments.productId == req.params.id; }));
});
var server = app.listen(8000, function () {
    console.log('服务已启动');
});
var wsServer = new ws_1.Server({ port: 8085 });
wsServer.on('connection', function (websocket) {
    websocket.send("这个消息是服务器主动推送的");
    websocket.on("message", function (message) {
        console.log("get Messages" + message);
    });
});
setInterval(function () {
    if (wsServer.clients) {
        wsServer.clients.forEach(function (client) {
            client.send("这是定时推送！");
        });
    }
}, 2000);
