/**
 * 全局错误处理中间件
 * 💡 核心知识点：
 * 1. 它必须放在所有路由的【最后面】。
 * 2. 它的函数签名必须有【四个参数】(err, req, res, next)，这是 Express 识别错误处理中间件的唯一标志。
 */
const errorHandler = (err, req, res, next) => {
  // 1. 打印错误日志，方便后端排查问题
  console.error('全局捕获到未处理的异常:', err)

  // 2. 根据错误类型，返回不同的提示信息
  // 💡 学习留痕：防止在生产环境中把底层的报错信息（如 SQL 语句）暴露给前端
  let message = '服务器繁忙，请稍后再试'
  let httpCode = 500

  // 如果是 Token 验证失败抛出的错误（比如后续使用了 express-jwt）
  if (err.name === 'UnauthorizedError') {
    message = 'Token 无效或已过期，请重新登录'
    httpCode = 401
  }
  // 如果是业务逻辑中主动抛出的自定义错误
  else if (err.isOperational) {
    message = err.message
    httpCode = err.httpCode || 400
  }
  // 3. 统一使用 res.cc() 返回错误响应
  return res.cc({
    status: 1,
    message,
    httpCode
  })
}

export default errorHandler