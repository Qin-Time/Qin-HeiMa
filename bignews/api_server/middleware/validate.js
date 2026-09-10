/**
 * 数据规范验证中间件
 * 作用：基于 Zod Schema 校验请求数据，拦截非法请求并应用数据转换
 * @param {import('zod').ZodSchema} schema - Zod 校验规则对象
 * @param {string} [property='body'] - 需要校验的请求属性（如 'body', 'query', 'params'）
 * @returns {import('express').RequestHandler} Express 中间件函数
 * 
 * @example
 * // 在路由中使用：
 * router.post('/reguser', validate(userSchema, 'body'), user_handler.regUser)
 */

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    // 使用 safeParse 安全验证，不会抛出异常
    const result = schema.safeParse(req[property]);

    if (!result.success) {
      // 提取所有错误信息并格式化
      const errors = (result.error.issues || []).map(err => ({
        field: err.path.join('.'),
        message: err.message
      }));

      // 动态生成 msg，例如："参数校验失败: username 为必填项, age 必须为正数"
      const errorSummary = errors?.map(e => `${e.field}: ${e.message}`).join('; ');

      return res.cc({
        status: 1,
        message: `参数校验失败: ${errorSummary}`,
        httpCode: 400,
        data: { errors } // 把详细的错误字段放进 data 里
      });
    }

    // 验证通过后，用解析后的数据替换原始数据
    // 这一步非常重要！它会应用 Zod 中的 .default() 和 .transform()
    req[property] = result.data;
    next();
  };
};

export default validate;