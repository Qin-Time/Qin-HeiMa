// // 全局响应中间件
// app.use((req, res, next) => {
//   /**
//    * 统一响应格式
//    * @param {Error | string | null} err - 错误对象或提示消息
//    * @param {number} status - 业务状态码（0 表示成功，1 表示失败）
//    * @param {any} data - 响应给前端的数据
//    */
//   res.cc = function (err, status = 1, data = null) {
//     // 如果 err 是 Error 对象，提取 message；如果是字符串，直接使用；如果是 null/undefined，返回成功提示
//     let message = '操作成功'
//     if (err instanceof Error) {
//       message = err.message
//     } else if (typeof err === 'string') {
//       message = err
//     }

//     // 如果明确传入 status === 0，说明是成功响应
//     if (status === 0) {
//       message = '操作成功'
//     }

//     res.send({
//       status,
//       message,
//       data
//     })
//   }
//   next()
// })