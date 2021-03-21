import request from '@/utils/request'

export function getList(data) {
  return request({
    url: '/plan',
    method: 'get',
    data
  })
}

export function getTree(data) {
  return request({
    url: '/plan/tree/list',
    method: 'get',
    data
  })
}
