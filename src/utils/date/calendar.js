
export function getDateList(date = new Date(), weekStart = 1, weekCount = 6) {
  if (!(date instanceof Date)) {
    throw new Error('Function getDateList date参数必须为Date类型')
  }
  if ([0, 1, 2, 3, 4, 5, 6].indexOf(weekStart) === -1) {
    throw new Error('Function getDateList weekStart参数必须在 0,1,2,3,4,5,6中')
  }
  if (!(/(^[1-9]\d*$)/.test(weekCount))) {
    throw new Error('Function getDateList weekCount必须为正整数')
  }
  const dateYear = date.getFullYear()
  const dateMonth = date.getMonth()
  const monthDate = new Date(dateYear, dateMonth, 1)
  const firstDateWeek = monthDate.getDay()
  const diff = weekStart > firstDateWeek ? 7 - weekStart + firstDateWeek : firstDateWeek - weekStart
  const firstDate = new Date(monthDate.getTime() - 86400000 * diff)
  const firstDateTimestamp = firstDate.getTime()
  const count = weekCount * 7
  const dateList = []
  for (var i = 0; i < count; i++) {
    var dateObj = new Date(firstDateTimestamp + i * 86400000)
    var monthString  = (dateObj.getMonth() < 10 ? "0" : "") + dateObj.getMonth().toString()
    var dateString = (dateObj.getDate() < 10 ? "0" : "") + dateObj.getDate().toString()
    var dateInfo = {
      date: dateObj,
      headerTime: monthString + "-" + dateString,
      fullTime: dateObj.getFullYear().toString() + "-" + monthString + "-" + dateString
    }
    dateList.push(dateInfo)
  }
  return dateList
}
