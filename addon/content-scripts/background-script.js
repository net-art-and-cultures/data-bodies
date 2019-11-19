
const movePos = []
const clickPos = []
const wheelPos = []

window.addEventListener('mousemove', function (e) {
  movePos.push({
    x: e.clientX,
    y: e.clientY
  })
  const moveData = JSON.stringify(movePos)
  console.log('move: ' + moveData)
  const move = window.localStorage
  move.setItem('moveData', moveData)
})

window.addEventListener('click', function (e) {
  clickPos.push({
    x: e.clientX,
    y: e.clientY
  })
  const clickData = JSON.stringify(clickPos)
  console.log('click: ' + clickData)
  const click = window.localStorage
  click.setItem('clickData', clickData)
})

window.addEventListener('wheel', function (e) {
  wheelPos.push({
    x: e.clientX,
    y: e.clientY
  })
  const wheelData = JSON.stringify(wheelPos)
  console.log('wheel: ' + wheelData)
  const wheel = window.localStorage
  wheel.setItem('wheelData', wheelData)
})
