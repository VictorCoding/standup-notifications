let timeout
let checkmarkToggleTimeout

const init = () => {
  const timerInput = document.getElementById('intervalTime')
  const timerTime = localStorage.getItem('intervalTime')
  localStorage.setItem('intervalTime', timerTime ? timerTime : 20)
  timerInput.value = timerTime ? parseInt(timerTime, 10) : 20

  if (Notification.permission !== 'granted') {
    Notification.requestPermission(()=> {})
  }
}

function saveIntervalTime(e) {
  e.preventDefault()
  const time = document.getElementById('intervalTime').value
  localStorage.setItem('intervalTime', time)
  clearTimeout(timeout)
  runTimer()
  _showCheckmark()
}

const runTimer = () => {
  // time should be in minutes therefore we need to convert to milliseconds
  // by multiplying by 60000
  const timer = parseInt(localStorage.getItem('intervalTime'), 10) * 60000

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

window.onload = function() {
  Object.assign(window, {
    saveIntervalTime,
    testNotification,
  })

  init()
  runTimer()
}
