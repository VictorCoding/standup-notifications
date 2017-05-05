let timeout
let checkmarkToggleTimeout
let timestamp
let timeDisplayInterval

const init = () => {
  const timerInput = document.getElementById('intervalTime')
  const timerTime = localStorage.getItem('intervalTime')
  localStorage.setItem('intervalTime', timerTime ? timerTime : 20)
  timerInput.value = timerTime ? parseInt(timerTime, 10) : 20

  if (Notification.permission !== 'granted') {
    Notification.requestPermission(()=> {})
  }

  document.getElementById('timeDisplay').innerHTML = `Time left: ${localStorage.getItem('intervalTime')} min(s)`
}

function saveIntervalTime(e) {
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
  const notification = new Notification('Arriva!', {
    body: 'Move a lil!',
    requireInteraction: true,
  })


  notification.onclick = () => {
    document.getElementById('timeDisplay').innerHTML = `Time left: ${localStorage.getItem('intervalTime')} min(s)`
    notification.close()
    runTimer()
  }
}

const testNotification = () => {
  new Audio('assets/coins.mp3').play()
  new Notification('Arriva!', {
    body: 'Move a lil!',
  })
}

const _showCheckmark = () => {
  const checkmarkEl = document.getElementById('checkmark')
  checkmarkEl.style.display = 'inline-block'
  setTimeout(() => {
    checkmarkEl.style.display = 'none';
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
                     .fold(t => Math.round(t).toString())

    document.getElementById('timeDisplay').innerHTML = `Time left: ${timeLeft} min(s)`
    console.log('in ehre', timeLeft)
  }, 60000 * 5) // check every 5 minutes
}

window.onload = function() {
  Object.assign(window, {
    saveIntervalTime,
    testNotification,
  })

  init()
  runTimer()
}
