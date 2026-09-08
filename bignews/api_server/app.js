// 导入express
import express from 'express'
// 导入cors跨域中间件
import cors from 'cors'
// 导入路由模块
import { router as userRouter } from './router/router.js';
// 创建服务器实例对象
const app = express();
// 将cors注册为全局中间件
app.use(cors());
// 配置解析中间件,解析application/x-www.form-urlencoded格式的表单数据
app.use(express.urlencoded({ extended: false }))
// 全局注册路由
app.use('/api', userRouter)
// 启动服务器
app.listen(3007, () => {
  console.log('api server running at http://127.0.0.1:3007');
})