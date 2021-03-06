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

export function addPlan(data) {
  return request({
    url: '/plan',
    method: 'post',
    data
  })
}

export function getOnePlan(id) {
  return request({
    url: '/plan/detail/' + id,
    method: 'get'
  })
}

export function getListByParent(params) {
  return request({
    url: '/plan/parent',
    method: 'get',
    params
  })
}

export function updatePlan(id, data) {
  return request({
    url: '/plan/' + id,
    method: 'patch',
    data
  })
}

export function removePlan(id) {
  return request({
    url: '/plan/' + id,
    method: 'delete'
  })
}

export function donePlan(id) {
  return request({
    url: '/plan/done/' + id,
    method: 'post'
  })
}

export function failPlan(id) {
  return request({
    url: '/plan/fail/' + id,
    method: 'post'
  })
}
