
// 公共方法

export const isDev = process.env.NODE_ENV === 'dev'

export const getBaseUrl = () => {
  if (isDev) return '/api/'
  const arr = location.pathname.match(/\/(.+)\//i)
  return arr ? arr[0] : './'
}

export default {
  isDev,
  getBaseUrl,
}