/**
 * 用户相关
 * 这个是我们的相关描述
 * 来了就是我们的人了，哈哈
 * @sort 2
 */

const { api } = require('apite')


// 我的用户
api.get('/user', {
  user: '1'
})