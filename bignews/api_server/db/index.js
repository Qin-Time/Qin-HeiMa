/**
 * 数据库连接初始化模块
 * 作用：建立与数据库的连接，并导出数据库实例供各模块使用
 * 
 * @module db/index
 */

// 1. 导入 dotenv 加载环境变量（如果你使用了 .env 文件）
// import dotenv from 'dotenv';
// dotenv.config();

// 2. 导入 mysql2 的 promise 版本
import mysql from 'mysql2/promise';
import config from '../config.js'; // 引入配置

// 3. 创建数据库连接池
const pool = mysql.createPool({
  host: config.db.host,
  user: config.db.user,
  password: config.db.password,
  database: config.db.database,
  port: config.db.port,
  waitForConnections: true,   // 当连接池满时，等待可用连接
  connectionLimit: 10,        // 连接池最大连接数
  queueLimit: 100,            // 等待队列长度，0表示不限制
  enableKeepAlive: true,      // 开启心跳，防止数据库因长时间空闲断开连接
  keepAliveInitialDelay: 10000
});

// 启动时可做一次连接检测
pool.getConnection()
  .then(conn => {
    console.log('数据库连接成功')
    conn.release()
  })
  .catch(err => {
    console.error('数据库连接失败', err)
    process.exit(1)
  })

// 4. 向外导出 db 连接池对象
export default pool;