var express = require('express')

var Router = require('./router')
var bodyParser = require('body-parser')
// 设置跨域
var cors = require('cors')
var session = require('express-session');
var app = express();

app.use('html',require('express-art-template'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());
app.use(session({
  secret: 'sessiontest',//与cookieParser中的一致,这个是加密的秘钥
  resave: false,
  saveUninitialized:true
}));
//设置跨域请求
app.all('*', function (req, res, next) {
  // console.log("收到一个请求，url："+req.url)
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(Router)

app.listen(3000, () => {
  console.log("Server is running……");
})