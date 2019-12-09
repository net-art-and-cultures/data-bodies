/* global browser */
console.log('extention go')
let isRunning = false

browser.runtime.onMessage.addListener(message => {
  if (message.type === 'update') {
    isRunning = message.running
    console.log(isRunning)
  } else if (message.type === 'get-status') {
    browser.runtime.sendMessage({ mode: isRunning })
  }
})

const movePos = []
const clickPos = []

window.addEventListener('mousemove', function (e) {
  if (isRunning) {
    movePos.push({
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY
    })
    const moveData = JSON.stringify(movePos)
    console.log('move: ' + moveData)
    const move = window.localStorage
    move.setItem('moveData', moveData)
  }
})

window.addEventListener('click', function (e) {
  if (isRunning) {
    clickPos.push({
      x: e.clientX + window.scrollX,
      y: e.clientY + window.scrollY
    })
    const clickData = JSON.stringify(clickPos)
    console.log('click: ' + clickData)
    const click = window.localStorage
    click.setItem('clickData', clickData)
  }
})
