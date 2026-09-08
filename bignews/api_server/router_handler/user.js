// 注册新用户的处理函数

const regUser = (req, res) => {
  res.send('reguser OK')
}

// 登录的处理函数
const login = (req, res) => {
  res.send('login OK')
}

export { regUser, login }