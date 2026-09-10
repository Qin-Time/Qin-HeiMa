/**
 * 全局 Token 验证中间件（可配置白名单版）
 * 作用：拦截需要登录才能访问的请求，校验 Token 是否合法
 * 升级说明：增加了路径白名单功能，模拟 express-jwt 的 .unless() 机制，
 *          让该中间件可以安全地挂载到全局，无需手动一个个绑定。
 */

import jwt from 'jsonwebtoken'
import config from '../config.js'

/**
 * 工厂函数：接收配置参数，返回真正的 Express 中间件
 * @param {Object} options - 中间件配置项
 * @param {string[]} [options.excludePaths=[]] - 不需要 Token 验证的路径白名单
 * @returns {import('express').RequestHandler} Express 中间件函数
 */

export default function authMiddleware(options = {}) {
  // 以前是直接在函数内部写死逻辑，现在通过参数传入白名单，
  // 这样这个中间件就具备了高度的复用性，不仅仅局限死一套白名单。

  // 解构配置项，如果没有传 excludePaths，默认为空数组 []
  const { excludePaths = [] } = options;

  // 返回一个真正的 Express 中间件函数
  return (req, res, next) => {
    // 1. 【新增功能】检查当前请求路径是否在白名单内
    if (excludePaths.includes(req.url)) {
      return next(); // 在白名单内，直接放行，跳过后续逻辑
    }

    // --------------------------------------------
    // 以下全部都是【原版逻辑】
    // --------------------------------------------

    // 2. 从请求头中获取 Token（前端通常会放在 Authorization 字段中）
    const authHeader = req.headers.authorization;

    // 3. 判断 Token 是否存在
    if (!authHeader) {
      // 没传 Token，直接拦截并返回
      return res.cc({ status: 1, message: '未提供身份凭证，请先登录' });
    }

    // 4. 取纯 Token 字符串（因为前端传过来的是 'Bearer xxx'，需要去掉 'Bearer ' 前缀）
    // 使用 split(' ')[1] 可以安全地截取空格后面的 Token 字符串
    const token = authHeader.split(' ')[1];

    // 5. 使用 JWT 验证 Token
    jwt.verify(token, config.jwtSecretKey, (err, decoded) => {
      if (err) {
        // 验证失败（Token 过期、被篡改或无效）  jwt.verify 是异步回调，err 不为空代表验证失败
        return res.cc({ status: 1, message: 'Token 无效或已过期，请重新登录' });
      }

      // 6. 验证成功！decoded 里面包含了当初生成 Token 时加密进去的数据（如 { id, username }）
      // 我们将解析出的用户信息挂载到 req 对象上，方便后续的路由处理函数直接使用
      req.user = decoded;

      // 7. 调用 next()，将控制权传递给下一个路由处理函数
      next();
    });
  };
}