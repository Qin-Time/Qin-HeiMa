import jwt from 'jsonwebtoken'
import config from '../config.js'

/**
 * JWT 令牌工具模块
 * @param {object} user - 包含用户信息的对象（如 { id, username }）
 * @returns {string} - 完整的 Token 字符串（带 Bearer 前缀）
 * 支持直接传入数据库的 user 对象
 */
export const generateToken = (user) => {
  const payload = {
    id: user.id || user.insertId, // 兼容注册时的 result 对象和查询时的 user 对象
    username: user.username
  }
  const tokenStr = jwt.sign(payload, config.jwtSecretKey, { expiresIn: config.expiresIn })
  return 'Bearer ' + tokenStr
}