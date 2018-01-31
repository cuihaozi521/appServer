import * as express from 'express';
import {Server} from 'ws';

const app = express();

export class Product {
    constructor(
        public  id: number,
        public  title: string,
        public  price: number,
        public  desc: string,
        public  rating: number,
        public  category: Array<string>
    ) {}
}

export class Comment {
    constructor(
        public id: number,
        public productId: number,
        public timestamp: string,
        public user: string,
        public rating: number,
        public content: string
    ) {}
}

const products: Product[] = [
    new Product(1, '第一个商品', 1.99, '这是描述信息!', 1, ['电子产品', '硬件设备']),
    new Product(2, '第二个商品', 2.99, '这是描述信息!', 3, ['图书']),
    new Product(3, '第三个商品', 2.99, '这是描述信息!', 2, ['硬件设备']),
    new Product(4, '第四个商品', 1.99, '这是描述信息!', 1, ['电子产品', '硬件设备']),
    new Product(5, '第一个商品', 2.99, '这是描述信息!', 4, ['硬件设备']),
    new Product(6, '第一个商品', 1.99, '这是描述信息!', 5, ['电子产品'])
];
const comments: Comment[] = [
    new Comment(1, 1, "2017-02-02", "张三", 3, "东西不错"),
    new Comment(2, 1, "2011-02-02", "张三1", 4, "东西不错"),
    new Comment(3, 1, "2014-02-02", "张三2", 3, "东西不错"),
    new Comment(4, 2, "2018-02-02", "张三3", 3, "东西不错")
];
app.get('/',(req, res) => {
    res.send('hello express!!');
});

app.get('/api/products',(req, res) => {
    let result = products;
    let params = req.query;
    if(params.title){
        params.title = decodeURI(params.title);
        result = result.filter((p) =>
            p.title.indexOf(params.title) !== -1)
    }
    console.dir(params.category)
    if(params.category){
        if(params.category !== '-1'){
            params.category = decodeURI(params.category);
            result = result.filter((p) =>
                p.category.indexOf(params.category) !== -1)
        }
    }
    if(params.price){
        result = result.filter((p) => p.price <= parseInt(params.price))
    }
    console.dir(result)
    res.json(result);
});

app.get('/api/products/:id',(req, res) => {
    res.json(products.find((products) => products.id == req.params.id));
});

app.get('/api/products/:id/comments',(req, res) => {
    res.json(comments.filter((comments:Comment) => comments.productId == req.params.id));
});

const server = app.listen(8000,() => {
    console.log('服务已启动')
});

const wsServer = new Server({port: 8085});
wsServer.on('connection', websocket => {
    websocket.send("这个消息是服务器主动推送的");
    websocket.on("message", message => {
        console.log("get Messages"+message)
    })
});

setInterval(() => {
    if(wsServer.clients) {
        wsServer.clients.forEach(client => {
            client.send("这是定时推送！")
        })
    }
},2000);