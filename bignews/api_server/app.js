/**
 * 应用程序主入口
 * 作用：初始化 Express 实例，注册全局中间件，挂载路由，并启动服务监听端口
 * 
 * @module app
 */

// 导入express
import express from 'express'
// 引入配置
import config from './config.js';
// 导入cors跨域中间件
import cors from 'cors'
// 导入全局响应中间件
import responseMiddleware from './middleware/response.js';
// 导入全局token验证中间件
import authMiddleware from './middleware/authMiddleware.js';
// 导入路由模块
import userRouter from './router/user.js';
// 导入全局错误处理中间件
import errorHandler from './middleware/errorHandler.js'

// 创建服务器实例对象
const app = express();

// --- 全局中间件注册 ---

// 1. 将cors注册为全局中间件，解决跨域问题
app.use(cors());

// 2. 配置解析中间件，解析 application/x-www-form-urlencoded 格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 💡 补充：解析 application/json 格式的数据（前后端分离项目必备）
app.use(express.json())

// 3. 注册自定义的统一响应中间件
app.use(responseMiddleware)

// 注册token验证中间件。  把不需要验证的接口（白名单）传进工程函数，返回一个中间件
app.use(authMiddleware({ excludePaths: ['/api/reguser', '/api/login'] }))

// --- 路由注册 ---
// 将用户路由模块挂载到 /api 路径下
app.use(config.apiPrefix, userRouter)

// --- 全局错误处理中间件 ---
// 注意：这个中间件必须注册在所有路由之后
app.use(errorHandler)

// --- 启动服务器 ---
// 使用配置中的端口和前缀
app.listen(config.port, () => {
  console.log(`🚀 服务器运行在 http://localhost:${config.port}`);
});