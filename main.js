let timeout;
let dismissed = false;


const init = () => {
    const timerInput = document.getElementById('intervalTime');
    const timerTime = localStorage.getItem('intervalTime');
    timerInput.value = timerTime ? parseInt(timerTime, 10) : 2000;
}

const saveIntervalTime = (updated) => {
    const time = document.getElementById('intervalTime').value;
    localStorage.setItem('intervalTime', time);

    clearTimeout(timeout);
    runTimer();
}

const keepBuggingUntilManualDismiss = () => {
    const timer = setInterval(() => {
        showNotification(false);

    console.log('dismissed', dismissed)
        if (dismissed) {
            clearInterval(timer);
        }
    }, 4000);
}

const runTimer = () => {
    dismissed = false;
    // time should be in minutes therefore we need to convert to milliseconds
    // by multiplying by 60000
    // const timer = parseInt(localStorage.getItem('intervalTime'), 10) * 60000;
    const timer = parseInt(localStorage.getItem('intervalTime'), 10);

    timeout = setTimeout(() => {
        showNotification(true);
        // keepBuggingUntilManualDismiss();
    }, timer);
}

const showNotification = (sound) => {
    const notification = new Notification('Title', {
        body: 'Stand up!',
        sound,
    });
    notification.onclick = (e) => {
        console.log('clicked', e)
        e.preventDefault();
        dismissed = true;
        runTimer();
    }
}

window.onload = function() {
    Object.assign(window, {
        saveIntervalTime,
    })

    init();
    runTimer();
}
