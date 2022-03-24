export function millisToMinutesAndSeconds(millis: number) {
  const minutes = Math.floor(millis / 60000)
  const seconds: number = parseFloat(((millis % 60000) / 1000).toFixed(0))
  return seconds === 60
    ? minutes + 1 + ':00'
    : minutes + ':' + (seconds < 10 ? '0' : '') + seconds
}

export function millisToHoursAndMinutes(millis: number) {
  const milliseconds = Math.floor((millis % 1000) / 100)
  let seconds = Math.floor((millis / 1000) % 60)
  let minutes = Math.floor((millis / (1000 * 60)) % 60)
  let hours = Math.floor((millis / (1000 * 60 * 60)) % 24)

  hours = hours < 10 ? 0 + hours : hours
  minutes = minutes < 10 ? 0 + minutes : minutes
  seconds = seconds < 10 ? 0 + seconds : seconds

  return hours + ' hr ' + minutes + ' min'
}
