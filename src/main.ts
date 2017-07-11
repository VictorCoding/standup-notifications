import { INotificationOptions } from './interfaces';

let timeout: number;
let timestamp: number;
let timeDisplayInterval: number;

declare const Notification: Notification;

const init = () => {
  const timerInput = document.getElementById('intervalTime') as HTMLInputElement
  const timerTime = localStorage.getItem('intervalTime')
  localStorage.setItem('intervalTime', (timerTime ? timerTime : 20).toString())
  timerInput.value = (timerTime ? parseInt(timerTime, 10) : 20).toString()

  if (Notification.permission !== 'granted') {
    Notification.requestPermission(() => {})
  }

  document.getElementById('timeDisplay').innerHTML = `Time left: ${localStorage.getItem('intervalTime')} min(s)`
}

const saveIntervalTime = (e) => {
  e.preventDefault()
  const time = document.getElementById('intervalTime').value
  localStorage.setItem('intervalTime', time)
  clearTimeout(timeout)
  document.getElementById('timeDisplay').innerHTML = `Time left: ${localStorage.getItem('intervalTime')} min(s)`
  runTimer()
  _showCheckmark()
}

const runTimer = () => {
  // time should be in minutes therefore we need to convert to milliseconds
  // by multiplying by 60000
  const timer = parseInt(localStorage.getItem('intervalTime'), 10) * 60000
  timestamp = new Date().getTime()
  clearInterval(timeDisplayInterval)
  runTimeChecker()

  timeout = setTimeout(() => {
    clearInterval(timeDisplayInterval)
    showNotification()
  }, timer)
}

const showNotification = () => {
  if (Notification.permission === 'granted') {
    _setupNotification()
  } else if (Notification.permission !== 'denied') {
    Notification.requestPermission((permission) => {
      if (permission === 'granted') {
        _setupNotification()
      }
    })
  }
}

const _setupNotification = () => {
  new Audio('assets/coins.mp3').play()

  const options: INotificationOptions = {
    body: 'Move a lil!',
    requireInteraction: true,
  }

  const notification = new Notification('Arriva!', options)
  notification.onclick = () => {
    document.getElementById('timeDisplay').innerHTML = `Time left: ${localStorage.getItem('intervalTime')} min(s)`
    notification.close()
    runTimer()
  }
}

const testNotification = () => {
    new Audio('assets/coins.mp3').play()
    new Notification('Arriba!', {
        body: 'Move a lil!'
    })
}

const _showCheckmark = () => {
  const checkmarkEl = document.getElementById('checkmark')
  checkmarkEl.style.display = 'inline-block'
  setTimeout(() => {
    checkmarkEl.style.display = 'none'
  }, 1000)
}

const runTimeChecker = () => {
  const timeBox = (time) => ({
    map: f => timeBox(f(time)),
    fold: f => f(time),
  })
  timeDisplayInterval = setInterval(() => {
    const intervalTime = parseInt(localStorage.getItem('intervalTime'), 10)
    const timeLeft = timeBox(new Date().getTime())
                     .map(t => t - timestamp) // get the time lapsed
                     .map(t => t / 60000) // convert mills to mins
                     .map(t => intervalTime - t) // get time left till next notification
                     .map(Math.round)
                     .fold(t => t.toString())

    document.getElementById('timeDisplay').innerHTML = `Time left: ${timeLeft} min(s)`
  }, 60000 * 5) // check every 5 minutes
}

window.onload = function () {
  Object.assign(window, {
    saveIntervalTime: saveIntervalTime,
    testNotification: testNotification
  })

  init()
  runTimer()
}
