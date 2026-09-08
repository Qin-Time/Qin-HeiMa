// 导入express
import express from 'express'
// 导入用户路由处理函数模块
import * as user_handler from '../router_handler/user.js'
// 实例化路由对象
const router = express.Router()
// 创建接口
// 注册新用户
router.post('/reguser', user_handler.regUser)
// 登录
router.post('/login', user_handler.login)
// 导出路由模块
export { router }
// 在app导入使用路由模块