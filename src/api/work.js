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

export function doneWork(id) {
  return request({
    url: '/work/done/' + id,
    method: 'post'
  })
}

export function failWork(id) {
  return request({
    url: '/work/fail/' + id,
    method: 'post'
  })
}

export function doneWorkItem(id) {
  return request({
    url: '/work-item/done/' + id,
    method: 'post'
  })
}

export function failWorkItem(id) {
  return request({
    url: '/work-item/fail/' + id,
    method: 'post'
  })
}
