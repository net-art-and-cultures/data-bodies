/* global browser */
const runButton = document.querySelector('#run')

function getActiveTab () {
  return browser.tabs.query({ active: true, currentWindow: true })
}

browser.runtime.onMessage.addListener(message => {
  if (message.mode) {
    runButton.textContent = 'Stop'
  } else {
    runButton.textContent = 'Run'
  }
})

// Jason: Receive communication from browser window to generate portrait
browser.runtime.onMessage.addListener(message => {
  if (message.type === 'generate-finished') {
    if (message.data !=== undefined) {
      console.log(message.data)
    }
  }
})

getActiveTab().then((tabs) => {
  browser.tabs.sendMessage(tabs[0].id, { type: 'get-status' })
})

runButton.addEventListener('click', () => {
  if (runButton.textContent === 'Run') {
    getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'update',
        running: true
      })
    })
    runButton.textContent = 'Stop'
  } else {
    getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, {
        type: 'update',
        running: false
      })
    })
    runButton.textContent = 'Run'

    // Jason: Communicate with browser window to generate portrait
    getActiveTab().then((tabs) => {
      browser.tabs.sendMessage(tabs[0].id, { type: 'generate' })
    })
  }
})