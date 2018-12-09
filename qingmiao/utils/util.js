const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('-')
   // + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatTime2 = time => {
  let s = time % 60
  let m = parseInt(time/60)
  if (s < 10) s = '0' + s
  if(m < 10) m = '0' + m
  return m + ':' + s
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatTime2: formatTime2,
}
