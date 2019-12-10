/* global browser */
const runButton = document.querySelector('#run')

let movePos
let clickPos
let recordWidth

function getActiveTab () {
  return browser.tabs.query({ active: true, currentWindow: true })
}

function storePortrait () {
  browser.storage.local.clear()
  browser.storage.local.set({'portrait': dataURL})
  browser.storage.local.get('portrait')
    .then((res) => {
      updateGallery(res)
    })
}

function updateGallery (portraitInput) {
  document.getElementById('preview-1').innerHTML = "<img src=" + portraitInput.portrait + ">"
}

browser.runtime.onMessage.addListener(message => {
  if (message.mode) {
    runButton.textContent = 'Stop'
  } else {
    runButton.textContent = 'Run'
  }
  if (message.type === 'generate-finished') {
    movePos = message.recordedMove
    clickPos = message.recordedClick
    recordWidth = message.recordedWidth
    clear()
    calcMaxHeight()
    resizeCanvas(canvasWidth, canvasHeight)
    background(255)
    paint()
    canvasElement = document.getElementById('defaultCanvas0')
    dataURL = canvasElement.toDataURL()
    storePortrait()
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

browser.storage.local.get('portrait')
  .then((res) => {
    updateGallery(res)
  })