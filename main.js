let timeout
let clicked = false

const init = () => {
  const timerInput = document.getElementById('intervalTime')
  const timerTime = localStorage.getItem('intervalTime')
  localStorage.setItem('intervalTime', timerTime ? timerTime : 20)
  timerInput.value = timerTime ? parseInt(timerTime, 10) : 20

  if (Notification.permission !== 'granted') {
    Notification.requestPermission(()=> {})
  }
}

const saveIntervalTime = (updated) => {
  const time = document.getElementById('intervalTime').value
  localStorage.setItem('intervalTime', time)

  clearTimeout(timeout)
  runTimer()
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
  clicked = false;

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

  notification.onclose = () => {
    if (!clicked) {
      runTimer()
    }
  }

  notification.onclick = () => {
    clicked = true;
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

window.onload = function() {
  Object.assign(window, {
    saveIntervalTime,
    testNotification,
  })

  init()
  runTimer()
}
