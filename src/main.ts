import { INotificationOptions } from './interfaces';

let timeout: number;
let timestamp: number;
let timeDisplayInterval: number;

declare const Notification: Notification;

/*
 * @description Setup timer value for input if any has been previously saved in
 *              the localStorage, if not then set the default to 20 mins. Also
 *              ask for notifications permission in case it's the first time using
 *              the app or if permission has been previously removed
 */
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

/*
 * @description Save the timer time in the localStorage and rerun the timer.
 *              If there was a previous timer setup, we clear it. Also update
 *              the text displaying the time left.
 * @param {object} e - Form submit event which we prevent from submitting the form.
 *                     We use this instead of a button with type of button so that we
 *                     can validate that the timer number is not less than 0.
 */
const saveIntervalTime = (e) => {
  e.preventDefault()
  const time = document.getElementById('intervalTime') as HTMLInputElement
  localStorage.setItem('intervalTime', time.value)
  clearTimeout(timeout)
  document.getElementById('timeDisplay').innerHTML = `Time left: ${localStorage.getItem('intervalTime')} min(s)`
  runTimer()
  _showCheckmark()
}

/*
 * @description Setup a timeout to display a desktop Notification depending
 *              the time we pick on the number picker
 */
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

/*
 * @description Check if Notification permission has been granted or denied. If granted
 *              go ahead run utility function that shows notification, if denied then
 *              ask for permission.
 */
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

/*
 * @description Show desktop Notification and play Audio. Setup onclick handler
 *              for Notification which gets triggered when the Notification toaster
 *              gets closed which then setups a new timer for next notification.
 */
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

/*
 * @description Shows a Notification and plays an Audio to make sure
 *              desktop notifications are working
 */
const testNotification = () => {
    new Audio('assets/coins.mp3').play()
    new Notification('Arriba!', {
        body: 'Move a lil!'
    })
}

/*
 * @description Utility function to toggle a checkmark when saving a timer
 */
const _showCheckmark = () => {
  const checkmarkEl = document.getElementById('checkmark')
  checkmarkEl.style.display = 'inline-block'
  setTimeout(() => {
    checkmarkEl.style.display = 'none'
  }, 1000)
}

/*
 * @description Sets up an interval to run every 5 mins to update the time left
 *              being displayed.
 */
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
