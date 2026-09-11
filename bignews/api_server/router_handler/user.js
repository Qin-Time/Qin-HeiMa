/**
 * 用户业务逻辑处理模块
 * 作用：封装用户模块的具体业务操作（如注册、登录、获取信息）
 * 
 * @module router_handler/user
 */

// 注册新用户的处理函数

// 导入数据库连接模块
import db from '../db/index.js'
// 导入密码加密模块
import bcrypt from 'bcryptjs'
/* 旧代码块，已抽离到工具函数token中
// 导入JWT
import jwt from 'jsonwebtoken'
// 导入配置文件
import config from '../config.js' 
*/
// 导入获取token的工具函数
import { generateToken } from '../utils/token.js'

/**
 * 注册新用户的处理函数
 */

const regUser = async (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // console.log(userinfo);
  // // 对表单数据进行合法性校验  //该部分已交由schema与中间件处理
  // if (!userinfo.username || !userinfo.password) {
  //   // return res.status(400).send({ status: 1, message: '用户名或密码不合法' })
  //   return res.cc({message:'用户名或密码不合法'})
  // }

  // 定义sql语句
  const sqlstr = 'SELECT * FROM ev_users WHERE username = ?'
  // // 执行sql语句并根据执行结果判断用户名是否被占用
  // db.query(sqlstr, [userinfo.username], function (err,results) { })

  // 使用mysql2的异步写法
  try {
    const [rows, fields] = await db.execute(sqlstr, [userinfo.username]);
    console.log(rows);
    if (rows.length > 0) {
      // 查询到数据，用户已存在
      // return res.status(409).send({ status: 1, message: '用户名被占用，请更换其他用户名' })
      return res.cc({ status: 1, message: '用户名被占用，请更换其他用户名' })
    }
    // 未查询到数据，TODO用户注册
    // 使用bcrypt对密码进行加密   思考：这部分是否抽离出来单独的函数。
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 操作数据库增加数据
    const insertUserSql = 'INSERT INTO ev_users (username, password) VALUES (?, ?)'
    const [result] = await db.execute(insertUserSql, [userinfo.username, userinfo.password])
    console.log(result);
    // 注册成功
    return res.cc({
      message: '注册成功',
      data: { token: generateToken({ id: result.insertId, username: userinfo.username }) }
    })

    /*    // 旧代码块，该功能已抽离到工具函数中
    // 注册成功后，直接生成 Token 返回，实现“注册即登录”     
    const userInToken = {
      id: result.insertId,
      username: userinfo.username
    }
    const tokenStr = jwt.sign(userInToken, config.jwtSecretKey, { expiresIn: config.expiresIn })
    return res.cc({
      message: '注册成功',
      data: { token: 'Bearer ' + tokenStr }
    })
    */

  } catch (err) {
    // 捕获数据库错误，并给前端正确反馈
    console.error('注册流程出错:', err);
    // return res.status(500).send({ status: 1, message: '服务器繁忙，请稍后再试' })
    return res.cc({ status: 1, message: '服务器繁忙，请稍后再试' })
  }
}


/**
 * 登录的处理函数
 */
const login = async (req, res) => {
  // 获取客户端提交到服务器的用户信息
  const userinfo = req.body
  // 定义sql语句
  const sqlstr = 'SELECT * FROM ev_users WHERE username = ?'
  try {
    const [rows] = await db.execute(sqlstr, [userinfo.username]);
    console.log(rows);
    // 未查询到数据
    if (rows.length != 1) return res.cc({ status: 1, message: '用户名或密码错误' })
    // 查询到数据，用户已存在 TODO验证密码
    const compareResult = bcrypt.compareSync(userinfo.password, rows[0].password)
    // 密码验证失败
    if (!compareResult) return res.cc({ status: 1, message: '用户名或密码错误' })
    // 密码验证成功 TODO:在服务器端生成Token字符串
    return res.cc({
      message: '登录成功！',
      data: { token: generateToken(rows[0]) }
    })

    /*    // 旧代码块，该功能已抽离到工具函数中
     const userInToken = {
      id: rows[0].id,
      username: rows[0].username
    }
    const tokenStr = jwt.sign(userInToken, config.jwtSecretKey, {
      expiresIn: config.expiresIn, // token 有效期为 10 个小时
    })
    // 将生成的 Token 字符串响应给客户端
    // 登录成功，统一使用 res.cc 返回（注意 token 放在 data 中）
    return res.cc({
      message: '登录成功！',
      data: { token: 'Bearer ' + tokenStr }
    }) 
    */

  } catch (err) {
    console.error('数据库操作失败:', err);
    return res.cc({ status: 1, message: '服务器繁忙，请稍后再试' })
  }
}

export { regUser, login }