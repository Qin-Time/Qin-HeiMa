/**
 * 全局统一响应格式中间件
 */
const responseMiddleware = (req, res, next) => {
  /**
   * 统一响应方法
   * @param {object} options - 配置项
   * @param {any} options.data - 响应给前端的数据（默认 null）
   * @param {number} options.status - 业务状态码（默认 0 表示成功，1 表示失败）
   * @param {string} options.message - 提示信息（默认根据 status 自动生成）
   * @param {number} options.httpCode - HTTP 状态码（默认 200）
   */
  res.cc = function (options = {}) {
    const {
      data = null,
      status = 0,
      message = status === 0 ? '操作成功' : '操作失败',
      httpCode = 200
    } = options;

    // 如果传入的 data 是 Error 对象，自动提取 message 并将 status 置为失败
    let finalMessage = message;
    let finalStatus = status;
    if (data instanceof Error) {
      finalMessage = data.message
      finalStatus = 1
      data = null
    }

    return res.status(httpCode).send({
      status: finalStatus,
      message: finalMessage,
      data
    });
  };

  next();
};

export default responseMiddleware;