import { z } from "zod";

/**
* .string() 值必须是字符串
* .alphanum() 值只能是包含 a-zA-Z0-9 的字符串
* .min(length) 最小长度
* .max(length) 最大长度
* .required() 值是必填项，不能为 undefined  在 Zod 的设计哲学中，所有的字段默认就是必填的（Required）。你不需要额外调用任何方法来声明必填
* .regex(正则表达式) 值必须符合正则表达式的规则
*/

// // 定义用户名规则：1-10位字母数字
// const username = z.string().alphanum().min(1).max(10).required()

// // 定义密码规则：6-12位非空字符
// const password = z.string().pattern(/^[\S]{6,12}$/).required()

// export const createUserSchema = {
//   body: {
//     username,
//     password,
//   },
// }

// 定义创建用户的 Schema
const userSchema = z.object({
  username: z.string().regex(/^[a-zA-Z0-9_]{3,20}$/, '用户名必须是3-20位的字母、数字或下划线'),
  password: z.string().regex(/^[\S]{6,20}$/, '密码长度需要符合6-20位')
});
// 登录Schema：仅要求非空即可
const loginSchema = z.object({
  username: z.string().min(1).max(72),
  password: z.string().min(1).max(72)
})
export { userSchema, loginSchema };