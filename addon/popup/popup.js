/* global browser */
const runButton = document.querySelector('#run')

function getActiveTab () {
  return browser.tabs.query({ active: true, currentWindow: true })
}

function storePortrait (dataURL) {
  // browser.storage.local.clear()
  // browser.storage.local.set({'portrait': dataURL})
  browser.storage.local.get('portrait')
    .then((res) => {
      let p = res.portrait
      if (p instanceof Array) {
        p.push(dataURL)
      } else {
        p = [dataURL]
      }
      browser.storage.local.set({'portrait': p})
      updateGallery(p)
    })
}

function updateGallery (portraits) {
  let previews = document.querySelector('.previews')
  previews.innerHTML = ''
  for (var i = 0; i < portraits.length; i++) {
    let preview = document.createElement('div')
    preview.className = 'preview'
    let img = document.createElement('img')
    img.src = portraits[i]
    // img.onclick = () => {
    //   window.open('https://google.com')
    // }
    preview.appendChild(img)
    previews.appendChild(preview)
  }

}

browser.runtime.onMessage.addListener(message => {
  if (message.mode) {
    runButton.textContent = 'Stop'
  } else {
    runButton.textContent = 'Run'
  }
  if (message.type === 'generate-finished') {
    paint(message)
    storePortrait(document.getElementById('defaultCanvas0').toDataURL())
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
    if (res.portrait instanceof Array) {
      updateGallery(res.portrait)
    }
  })