import { Collision } from './collision.js'
import { Point, Circle, Polygon, Player } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'
import { RocksThemes } from './rocks-themes.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

const themes = new RocksThemes()
themes.setTheme()
// let backgroundColor = themes.color
let color = themes.backgroundColor
if (themes.light(themes.getTheme())) {
  // backgroundColor = themes.backgroundColor
  color = themes.color
}

const CLICK = 'click'
const CANVAS = 'canvas'
const BUTTON = 'button'
const DIV = 'div'
const VISIBLE = 'visible'
const HIDDEN = 'hidden'
const ASPECT_RATIO = 16 / 9
const CANVAS_MIN_WIDTH = 300
const CANVAS_MAX_WIDTH = 1200
const CANVAS_MIN_HEIGHT = CANVAS_MIN_WIDTH / ASPECT_RATIO
const CANVAS_MAX_HEIGHT = CANVAS_MAX_WIDTH / ASPECT_RATIO

const canvas = document.createElement(CANVAS)
const context = canvas.getContext('2d')

const playButton = document.createElement(BUTTON)
playButton.innerText = 'Play'
playButton.addEventListener(CLICK, start)

const resumeButton = document.createElement(BUTTON)
resumeButton.innerText = 'Resume'
resumeButton.style.display = 'none'
resumeButton.addEventListener(CLICK, resume)

const againButton = document.createElement(BUTTON)
againButton.innerText = 'Again'
againButton.style.display = 'none'
againButton.addEventListener(CLICK, restart)

const fullscreenButton = document.createElement(BUTTON)
fullscreenButton.innerText = 'Fullscreen'
fullscreenButton.addEventListener(CLICK, fullscreen)

const h1Title = document.createElement('h1')
h1Title.innerText = 'Rocks'

const buttonColumn = document.createElement(DIV)
buttonColumn.className = 'buttons-column'
buttonColumn.appendChild(h1Title)
buttonColumn.appendChild(playButton)
buttonColumn.appendChild(resumeButton)
buttonColumn.appendChild(againButton)
buttonColumn.appendChild(fullscreenButton)

document.body.appendChild(canvas)
document.body.appendChild(buttonColumn)

let scale = 1
let player = null
const score = new Score(color)
const keys = new Keys()
const touchControls = []
let bullets = []
let rocks = []
let requestId = null
let lifeInterval = null
let previousTimeStamp = 0
let elapsedTimeStamp = 0
let paused = false
let touchLeft = false
let touchRight = false
let touchUp = false
let touchDown = false

const raf =
  window.requestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.msRequestAnimationFrame

const caf =
  window.cancelAnimationFrame || window.mozCancelAnimationFrame

resizeCanvas()
window.addEventListener('resize', resizeCanvas)
canvas.addEventListener('touchstart', event => handleTouchStart(event))
canvas.addEventListener('touchmove', event => handleTouchMove(event))
canvas.addEventListener('touchend', event => handleTouchMove(event))
canvas.addEventListener('touchcancel', event => handleTouchMove(event))

function handleTouchStart (event) {
  handleTouch(event, true)
}

function handleTouchMove (event) {
  handleTouch(event, false)
}

function handleTouch (event, touchStart) {
  if (touchControls.length > 0) {
    touchLeft = false
    touchRight = false
    touchUp = false
    touchDown = false

    let count = 0
    const touches = event.touches
    const canvasRect = canvas.getBoundingClientRect()
    for (let touch = 0; touch < touches.length; touch++) {
      const x = touches[touch].clientX - canvasRect.left
      const y = touches[touch].clientY - canvasRect.top

      for (let i = 0; i < touchControls.length; i++) {
        const dist = Point.getDistance(x - touchControls[i].x, y - touchControls[i].y)
        if (dist < touchControls[i].radius * scale) {
          if (i === 0) {
            touchUp = true
            touchDown = false
          } else if (i === 1) {
            touchLeft = true
            touchRight = false
          } else if (i === 2) {
            touchRight = true
            touchLeft = false
          } else {
            touchDown = true
            touchUp = false
          }
          count++
        }
      }
    }

    touchControls[0].color = touchUp ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    touchControls[1].color = touchLeft ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    touchControls[2].color = touchRight ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    touchControls[3].color = touchDown ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    if (touchStart && count < touches.length) { bullets.push(Polygon.createBullet(player)) }
  }
}

function resizeCanvas () {
  if (player !== null && !paused) { pause() }

  const oldStyleWidth = Number(canvas.style.width.split('px')[0]) // ---
  const oldStyleHeight = Number(canvas.style.height.split('px')[0]) // ---
  let newStyleWidth = null // ---
  let newStyleHeight = null // ---

  // TODO: The canvas should always be a fixed amount smaller than the window size.
  if (document.body.clientWidth < CANVAS_MIN_WIDTH + 20 || window.innerHeight < CANVAS_MIN_HEIGHT + 20) {
    newStyleWidth = CANVAS_MIN_WIDTH // ---
    newStyleHeight = CANVAS_MIN_HEIGHT // ---
  } else if (document.body.clientWidth > CANVAS_MAX_WIDTH + 20 && window.innerHeight > CANVAS_MAX_HEIGHT + 20) {
    newStyleWidth = CANVAS_MAX_WIDTH // ---
    newStyleHeight = CANVAS_MAX_HEIGHT // ---
  } else {
    newStyleWidth = document.body.clientWidth - 20 // ---
    newStyleHeight = newStyleWidth / ASPECT_RATIO // ---

    if (newStyleHeight > window.innerHeight) { // ---
      newStyleHeight = window.innerHeight - 20 // ---
      newStyleWidth = newStyleHeight * ASPECT_RATIO // ---
    }
  }

  if (player !== null) {
    const widthDelta = newStyleWidth / oldStyleWidth // ---
    const heightDelta = newStyleHeight / oldStyleHeight // ---

    player.x *= widthDelta
    player.y *= heightDelta
    bullets.forEach(bullet => { bullet.x *= widthDelta; bullet.y *= heightDelta })
    rocks.forEach(rock => { rock.x *= widthDelta; rock.y *= heightDelta })
    touchControls.forEach(touchControl => { touchControl.x *= widthDelta; touchControl.y *= heightDelta })
  }

  scale = newStyleWidth / CANVAS_MAX_WIDTH // ---
  canvas.style.top = `${Math.round((window.innerHeight - newStyleHeight) / 2)}px` // ---
  canvas.style.left = `${Math.round((document.body.clientWidth - newStyleWidth) / 2)}px` // ---
  canvas.style.width = `${newStyleWidth}px` // ---
  canvas.style.height = `${newStyleHeight}px` // ---

  const s = window.devicePixelRatio // ---
  canvas.height = Math.floor(newStyleHeight * s) // ---
  canvas.width = Math.floor(newStyleWidth * s) // ---
  context.scale(s, s) // ---

  buttonColumn.style.top = `${Math.round(window.innerHeight / 2)}px`
  buttonColumn.style.left = `${Math.round(document.body.clientWidth / 2)}px`
  buttonColumn.style.transform = `translate(-50%, -50%) scale(${scale})`
}

function start () {
  playButton.style.display = 'none'
  resumeButton.style.display = 'block'
  againButton.style.display = 'block'
  buttonColumn.style.visibility = HIDDEN
  player = Player.create(canvas)

  // TODO: Make this a dictionary.
  touchControls.push(new Circle(canvasStyleWidth() - (100 * scale), canvasStyleHeight() - (280 * scale), 80))
  touchControls.push(new Circle(100 * scale, canvasStyleHeight() - (100 * scale), 80))
  touchControls.push(new Circle(280 * scale, canvasStyleHeight() - (100 * scale), 80))
  touchControls.push(new Circle(canvasStyleWidth() - (100 * scale), canvasStyleHeight() - (100 * scale), 80))
  touchControls.forEach(touchControl => { touchControl.color = 'rgba(150, 150, 150, 0.3)' })
  requestAnimationFrame(manage)
}

function pause () {
  paused = true
  cancelAnimationFrame()
  requestAnimationFrame(managePause)
  buttonColumn.style.visibility = VISIBLE
}

function resume () {
  paused = false
  buttonColumn.style.visibility = HIDDEN
  cancelAnimationFrame()
  requestAnimationFrame(manage)
}

function stop () {
  pause()
  resumeButton.style.display = 'none'
}

function restart () {
  clearLifeInterval()
  resumeButton.style.display = 'block'
  buttonColumn.style.visibility = HIDDEN
  player.reset(canvas)
  score.reset()
  keys.reset()
  bullets = []
  rocks = []
  resume()
}

function fullscreen () {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen().catch((error) => {
      alert(`Error attempting to enable fullscreen mode: ${error.message} (${error.name})`)
    })
  } else {
    document.exitFullscreen()
  }
}

function requestAnimationFrame (callable) {
  requestId = raf(callable)
}

function cancelAnimationFrame () {
  caf(requestId)
  requestId = null
}

function setLifeInterval () {
  lifeInterval = setInterval(function () { player.alternateColor() }, 100)
  setLifeIntervalTimeout()
}

function clearLifeInterval () {
  clearInterval(lifeInterval)
  lifeInterval = null
}

function setLifeIntervalTimeout () {
  setTimeout(function () { clearLifeInterval(); player.defaultColor() }, 3000)
}

function manage (timeStamp) {
  elapsedTimeStamp = Math.round((timeStamp - previousTimeStamp) * 100) / 100
  previousTimeStamp = timeStamp
  collisions()
  update()
  clear()
  draw()
  if (!paused) { requestAnimationFrame(manage) }
}

function managePause (timeStamp) {
  elapsedTimeStamp = Math.round((timeStamp - previousTimeStamp) * 100) / 100
  previousTimeStamp = timeStamp
  clear()
  draw()
  if (paused) { requestAnimationFrame(managePause) }
}

function clear () {
  context.clearRect(0, 0, Number(canvas.style.width.split('px')[0]), Number(canvas.style.height.split('px')[0])) // ---
}

function collisions () {
  let shards = []
  for (const bullet of bullets) {
    for (const rock of rocks) {
      if (rock.show && Collision.checkShapes(bullet, rock, scale)) {
        shards = shards.concat(Polygon.createShards(rock))
        score.incrementScore()
        bullet.show = false
        rock.show = false
        break
      }
    }
  }
  rocks = rocks.concat(shards)

  if (lifeInterval === null) {
    for (const rock of rocks) {
      if (Collision.checkShapes(player, rock, scale)) {
        if (score.decrementLives() > 0) {
          setLifeInterval()
        } else {
          stop()
        }
        break
      }
    }
  }
}

function update () {
  player.speed = 0
  if (keys.arrowLeft() || keys.lowerA() || touchLeft) { player.rotateLeft() }
  if (keys.arrowRight() || keys.lowerD() || touchRight) { player.rotateRight() }
  if (keys.arrowDown() || keys.lowerS() || touchDown) { player.backward() }
  if (keys.arrowUp() || keys.lowerW() || touchUp) { player.forward(elapsedTimeStamp) }
  if (keys.space()) { bullets.push(Polygon.createBullet(player)) }
  if (keys.lowerP()) { pause() }
  if (keys.lowerR()) { resume() }

  bullets.forEach(bullet => bullet.update(canvas, scale))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(canvas, scale))
  rocks = rocks.filter(rock => rock.show)
  player.update(canvas, scale)
  touchControls.forEach(touchControl => touchControl.update(canvas, scale))

  if (!rocks.length) {
    rocks = Polygon.createRocks(canvas, scale, score.incrementLevel())
  }
}

function draw () {
  bullets.forEach(bullet => bullet.draw(context, scale))
  rocks.forEach(rock => rock.draw(context, scale))
  player.draw(context, scale)
  touchControls.forEach(touchControl => touchControl.draw(context, scale))
  score.draw(context, scale)
}

function canvasStyleWidth () { // ---
  return Number(canvas.style.width.split('px')[0])
}

function canvasStyleHeight () { // ---
  return Number(canvas.style.height.split('px')[0])
}
