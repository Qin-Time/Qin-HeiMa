// 1. 导入 http 模块
import http from 'node:http'

// 2. 创建 web 服务器实例
const server = http.createServer();

// 3. 为服务器实例绑定 request 事件，监听客户端的请求，回调函数接收req，res两个对象参数
server.on('request', (req, res) => {
  console.log('服务器正在被访问');
  // req.url 是客户端请求的URL地址
  const url = req.url
  // req.method 是客户端请求的方法
  const method = req.method
  console.log(`客户端的请求url是${url},客户端的请求方式是${method} `);

  // 根据不同URL返回不同页面内容
  let content = '<h1>404 Not found!</h1>'   // 默认响应内容
  if (url === '/' || url === '/index.html') {
    content = '<h1>首页<h1>'
  } else if (url === '/about.html') {
    content = '<h1>关于页面<h1>'
  }

  // res.setHeader(name, value)设置单个响应头(解决编码问题)
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  // res.end(data) 必须调用，结束请求，并向客户端返回数据
  res.end(content)
});

// 4. 启动服务器
server.listen(8080, () => console.log('服务器正在 http://127.0.0.1:8080 运行'));