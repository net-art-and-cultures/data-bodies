const runButton = document.querySelector('#run')
let isRunning = false

runButton.addEventListener('click', function (e) {
  if (isRunning === false) {
    runButton.textContent = 'Stop'
    isRunning = true
  } else if (isRunning === true) {
    runButton.textContent = 'Run'
    isRunning = false
  }
})
