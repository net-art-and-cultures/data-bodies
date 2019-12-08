function getActiveTab () {
  return browser.tabs.query({ active: true, currentWindow: true })
}

getActiveTab().then((tabs) => {
  browser.tabs.sendMessage(
    tabs[0].id,
    { mode: 'check the mode' }
  ).then(response => {
    if (response.response === 'off') {
      dataBodyOn()
      // start the program, change button to "stop"
    } else if (response.response === 'on') {
      runButton.textContent = 'Stop'
      dataBodyOff()
      // stop the program, change button to "run"
    }
  })
})

const runButton = document.querySelector('#run')

function dataBodyOn () {
  let isRunning = false
  runButton.addEventListener('click', () => {
    if (isRunning === false) {
      runButton.textContent = 'Stop'
      isRunning = true
      getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(
          tabs[0].id,
          { message: 'start the program' }
        )
      })
    } else if (isRunning === true) {
      runButton.textContent = 'Run'
      isRunning = false
      getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(
          tabs[0].id,
          { message: 'stop the program' }
        )
      })
    }
  })
}

function dataBodyOff () {
  let isRunning = true
  runButton.addEventListener('click', () => {
    if (isRunning === true) {
      runButton.textContent = 'Run'
      isRunning = false
      getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(
          tabs[0].id,
          { message: 'stop the program' }
        )
      })
    } else if (isRunning === false) {
      runButton.textContent = 'Stop'
      isRunning = true
      getActiveTab().then((tabs) => {
        browser.tabs.sendMessage(
          tabs[0].id,
          { message: 'start the program' }
        )
      })
    }
  })
}
