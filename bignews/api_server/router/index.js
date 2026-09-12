// router/index.js
// 导入路由模块
import { Router } from 'express'
// 导入子路由
import userRouter from './user.js'
// import publicRouter from './public.js'
// import paymentRouter from './payment.js'

// 创建一个主路由挂载器
const mainRouter = Router()

// 在这个主路由上挂载各个子模块
// 注意：这里的子路由（如 user.js 内部定义的 /userinfo）会自动拼接前缀
mainRouter.use('/api', userRouter)
// mainRouter.use('/public', publicRouter)
// mainRouter.use('/v1', paymentRouter)

// 导出这个主路由
export default mainRouter