
export function sortArrayObject(array, sortFunc) {
  if (!(array instanceof Array)) {
    throw new Error('排序对象非数组')
  }
  if (!(sortFunc instanceof Function)) {
    throw new Error('排序方法错误')
  }
  array.sort(sortFunc)
  return array
}
