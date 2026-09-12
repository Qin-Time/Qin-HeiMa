/*
* 全局配置文件
*/

import dotenv from 'dotenv';
dotenv.config(); // 加载 .env 文件中的变量

const config = {
  // 服务器配置
  port: process.env.PORT || 3007,   // 服务器运行的端口
  // apiPrefix: process.env.API_PREFIX || '/api',   // 统一的路由前缀配置，方案已弃置，注释留作学习留痕

  // 路由前缀配置
  routes: {
    public: '/api',    //  公共模块，无需token认证即可访问，持有reguser页面和login页面
    user: '/my',    //  用户信息模块，需要提供token认证才允许访问
    payment: '/v1'  //  支付模块
  },

  // 数据库配置
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  },

  // JWT 配置
  jwtSecretKey: process.env.JWT_SECRET_KEY,
  expiresIn: process.env.JWT_EXPIRES_IN,

  // 其他配置
  corsOrigin: process.env.CORS_ORIGIN,
};

export default config;