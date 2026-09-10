/**
 * 用户相关路由定义
 * 作用：定义用户接口的路由路径，并绑定中间件与业务处理函数
 * 
 * @module router/user
 */

// 导入express
import express from 'express'
// 导入用户路由处理函数模块
import * as user_handler from '../router_handler/user.js'
// 导入schema库
import userSchema from '../schema/user.js'
// 导入验证表单数据的中间件expressJoi
import validate from '../middleware/validate.js'
// 实例化路由对象
const router = express.Router()
// 创建接口
// 注册新用户
router.post('/reguser', validate(userSchema, 'body'), user_handler.regUser)
// 走到这里，说明数据合法，且默认值已生效
// 登录
router.post('/login', validate(userSchema, 'body'), user_handler.login)
// 导出路由模块
export default router;
// 在app导入使用路由模块