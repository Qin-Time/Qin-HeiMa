import fs from 'node:fs/promises';
import path from 'node:path';

let filePath = path.join(import.meta.dirname, './成绩.txt');
let toPath = path.join(import.meta.dirname, './成绩01.txt');

try {
  const data = await fs.readFile(filePath, 'utf8');

  // to do transform 
  // 1 按照空格分割数据
  const arrOld = data.split(' ')
  // 2 循环分割后的数组，对每一项数据，进行字符串的替换操作
  const arrNew = []
  arrOld.forEach(item => arrNew.push(item.replace('=', ': ')))
  // 3 把新数组中的每一项，进行合并，得到一个新的字符串
  const newStr = arrNew.join('\r\n')

  await fs.writeFile(toPath, newStr);
  console.log('写入文件成功');

} catch (error) {
  console.error('文件操作失败', error.message);
}
