import jwt from 'jsonwebtoken'
import config from '../config.js'

/**
 * JWT 令牌工具模块
 * @param {object} user - 包含用户信息的对象（如 { id, username }）
 * @returns {string} - 完整的 Token 字符串（带 Bearer 前缀）
 * 支持直接传入数据库的 user 对象
 */
export const generateToken = ({ id, username }) => {
  return jwt.sign(
    { id, username },
    config.jwtSecretKey,
    { expiresIn: config.expiresIn, algorithm: 'HS256' }
  )
}