import request from '@/utils/request'

export function addWork(data) {
  return request({
    url: '/work',
    method: 'post',
    data
  })
}

export function getOneWork(id) {
  return request({
    url: '/work/detail/' + id,
    method: 'get'
  })
}

export function updateWork(id, data) {
  return request({
    url: '/work/' + id,
    method: 'patch',
    data
  })
}

export function deleteWork(id) {
  return request({
    url: '/work/' + id,
    method: 'delete'
  })
}
