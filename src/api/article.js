import request from '@/utils/request'

export const artGetChannelsService = () => {
  return request.get('/my/cate/list')
}
// 添加文章分类
export const artAddChannelService = (data) => {
  return request.post('/my/cate/add', data)
}
// 编辑文章分类
export const artEditChannelService = (data) => {
  return request.put('/my/cate/info', data)
}
// 删除文章分类
export const artDelChannelService = (id) => {
  return request.delete('/my/cate/del', { params: { id } })
}
// 封装文章接口,获取文章列表
export const artGetListService = (params) => {
  // 后端文档要求使用 GET，并通过 query 参数传递分页/筛选
  return request.get('/my/article/list', { params })
}
// 添加发布文章的接口
export const artPublishService = (data) => {
  return request.post('/my/article/add', data)
}
export const artGetDetailService = (id) => {
  return request.get('/my/article/info', { params: { id } })
}
// 文章：编辑文章接口
export const artEditService = (data) => {
  return request.put('/my/article/info', data)
}

// 文章：删除文章接口
export const artDelService = (id) => {
  return request.delete('/my/article/info', { params: { id } })
}
