module.exports = {
    devServer: {
    	// 项目启动端口之后会变成3000
        port: 3001,
        proxy:{
            '/server':{//匹配所有以'/api1'开头的请求路径
                target:'http://localhost:3000',//代理目标的基础路径
                changeOrigin:true,
                pathRewrite:{'^/server':''}
            }
        }
        
    }
}