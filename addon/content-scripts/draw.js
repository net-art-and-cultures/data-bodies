let dataURL
let maxHeight
let canvasWidth = 1200
let canvasHeight
let canvasElement

function setup() {
  pixelDensity(2)
  calcMaxHeight()
  createCanvas(canvasWidth, 0)
  background(255)
  canvasElement = document.getElementById('defaultCanvas0')
  canvasElement.style.display = 'none';
}

function paint() {
  for (let m = 0; m < movePos.length-1; m++) {
    let mapPercent = map(m, 0, movePos.length, 0, 100)
    let r
    let g
    let b
    if (mapPercent < 25) {
      r = map(mapPercent, 0, 25, 189, 255)
      g = map(mapPercent, 0, 25, 161, 191)
      b = map(mapPercent, 0, 25, 255, 210)
    } else if (mapPercent >= 25 && mapPercent < 50) {
      r = 255
      g = map(mapPercent, 25, 50, 191, 197)
      b = map(mapPercent, 25, 50, 210, 161)
    } else if (mapPercent >= 50 && mapPercent < 75) {
      r = 255
      g = map(mapPercent, 50, 75, 197, 255)
      b = map(mapPercent, 50, 75, 161, 163)
    } else if (mapPercent >= 75) {
      r = map(mapPercent, 75, 100, 255, 155)
      g = 255
      b = map(mapPercent, 75, 100, 163, 227)
    }
    stroke(r, g, b)
    strokeWeight(15)
    let mapMoveMouseX = map(movePos[m].x, 0, recordWidth, 50, canvasWidth-50)
    let mapMoveMouseY = map(movePos[m].y, 0, maxHeight, 50, canvasHeight-50)
    let mapNextMoveMouseX = map(movePos[m+1].x, 0, recordWidth, 50, canvasWidth-50)
    let mapNextMoveMouseY = map(movePos[m+1].y, 0, maxHeight, 50, canvasHeight-50)
    line(mapMoveMouseX, mapMoveMouseY, mapNextMoveMouseX, mapNextMoveMouseY)
  }

  for (let n = 0; n < clickPos.length; n++) {
    stroke('#ffd76c')
    strokeWeight(3)
    noFill()
    let mapClickMouseX = map(clickPos[n].x, 0, recordWidth, 50, canvasWidth-50)
    let mapClickMouseY = map(clickPos[n].y, 0, maxHeight, 50, canvasHeight-50)
    circle(mapClickMouseX, mapClickMouseY, 30)
  }
}

function calcMaxHeight() {
  let maxY = 0
  for (let w = 0; w < movePos.length; w++) {
    if (movePos[w].y > maxY) {
      maxY = movePos[w].y
    }
  }
  maxHeight = maxY
  canvasHeight = map(maxHeight, 0, recordWidth, 0, canvasWidth)
}

// When receive generate message, send back portrait to popup window. 
browser.runtime.onMessage.addListener (message => {
  if (message.type === 'generate') {
    clear()
    calcMaxHeight()
    resizeCanvas(canvasWidth, canvasHeight)
    background(255)
    paint()
    dataURL = canvasElement.toDataURL()
    browser.runtime.sendMessage.({
      type: 'generate-finished',
      data: dataURL
    })
  }
}