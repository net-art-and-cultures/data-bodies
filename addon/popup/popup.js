/* global browser */
const runButton = document.querySelector('#run')
const saveButton = document.querySelector('#save')

  // we got this from https://stackoverflow.com/a/12300351/12146405

function dataURItoBlob(dataURI) {
  // convert base64 to raw binary data held in a string
  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
  var byteString = atob(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  // write the bytes of the string to an ArrayBuffer
  var ab = new ArrayBuffer(byteString.length);

  // create a view into the buffer
  var ia = new Uint8Array(ab);

  // set the bytes of the buffer to the correct values
  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  // write the ArrayBuffer to a blob, and you're done
  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

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

saveButton.addEventListener('click', () => {
  browser.storage.local.get('portrait').then((res) => {
    const latest = res.portrait[res.portrait.length - 1]
    const blob = dataURItoBlob(latest)
    const data = new FormData()
    data.append('image', blob)
    fetch('http://databodies.me/api/image-upload', { method: 'POST', body: data })
  })
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
