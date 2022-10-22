# 07-vue-node

### 1、node部分：server文件

**初始化项目：**

```js
cd server  //在server运行后端服务
npm install
```

**注意：**需要自行修改对应的数据库信息,注意账号密码

```js
//db.js
module.exports = {
  // 连接数据库
  mysql: {
    host: 'localhost',     // 本机
    user: 'root',          // 账号
    password: '123456',    // 密码
    database: 'xiangqi'      // 数据库名称
  }
}
```

需要在mysql手动表数据属性

```js
//mysql.js    注意命名
//  创建sql语句对象
var sqlMap = {
  usersql: {
    add: 'insert into user (username, email, password) values (?,?,?)',
    select: 'select * from user'
  }
}
module.exports = sqlMap;
```



**技术：使用express+mysql搭建服务器和数据库**

| 文件      | 作用                                          |
| --------- | --------------------------------------------- |
| app.js    | 主文件，用express搭建本地服务器，端口号为3000 |
| router.js | 搭建数据请求的路由                            |
| db.js     | 连接mysql数据库的信息                         |
| mysql.js  | 创建相应的sql语句对象                         |
| session.js| 用于登录信息验证                              |

**运行：**

```
node .\app.js
```

### 2、vue项目信息

**项目初始化**

```
npm install
```

**运行前端vue项目**

```
npm run serve
```



### 3、棋子名称：
红：
红兵、红砲、红車、红马、红相、红仕、红帅
黑卒、黑砲、黑車、黑马、黑相、黑仕、黑将