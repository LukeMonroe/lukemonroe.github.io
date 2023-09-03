import { Collision } from './collision.js'
import { Point, Shape, Circle, Polygon, Player } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'
import { RocksThemes } from './rocks-themes.js'

document.addEventListener('dblclick', event => { event.preventDefault() })

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

let scale = 1

const buttonColumn = document.createElement(DIV)
buttonColumn.className = 'buttons-column'
buttonColumn.appendChild(playButton)
buttonColumn.appendChild(resumeButton)
buttonColumn.appendChild(againButton)

document.body.appendChild(canvas)
document.body.appendChild(buttonColumn)

const themes = new RocksThemes()
themes.setTheme()

let player = null
const score = new Score(themes)
const keys = new Keys()
let touchControls = []
let bullets = []
let rocks = []
let gameInterval = null
let lifeInterval = null
let paused = false
let touchLeft = false
let touchRight = false
let touchUp = false
let touchDown = false
let touchBullet = false

resizeCanvas()
window.addEventListener('resize', resizeCanvas)
canvas.addEventListener('touchstart', event => handleTouch(event, 'a'))
canvas.addEventListener('touchmove', event => handleTouch(event, 'b'))
canvas.addEventListener('touchend', event => handleTouch(event, 'c'))
canvas.addEventListener('touchcancel', event => handleTouch(event, 'd'))

function handleTouch (event, type) {
  if (touchControls.length > 0) {
    touchLeft = false
    touchRight = false
    touchUp = false
    touchDown = false
    touchBullet = false
    if (type === 'c' || type === 'd') {
      return
    }

    const touches = event.changedTouches
    const canvasRect = canvas.getBoundingClientRect()
    for (let touch = 0; touch < touches.length; touch++) {
      const x = touches[touch].clientX - canvasRect.left
      const y = touches[touch].clientY - canvasRect.top

      for (let i = 0; i < touchControls.length; i++) {
        const dist = Point.getDistance(x - touchControls[i].x, y - touchControls[i].y)
        if (dist < Shape.scaled(touchControls[i].radius, scale)) {
          if (i === 0) {
            touchUp = true
            touchDown = false
          } else if (i === 1) {
            touchLeft = true
            touchRight = false
          } else if (i === 2) {
            touchRight = true
            touchLeft = false
          } else if (i === 3) {
            touchDown = true
            touchUp = false
          } else {
            if (type === 'a') {
              touchBullet = true
            }
          }
        }
      }
    }

    touchControls[0].color = touchUp ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    touchControls[1].color = touchLeft ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    touchControls[2].color = touchRight ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    touchControls[3].color = touchDown ? 'rgba(150, 150, 150, 0.5)' : 'rgba(150, 150, 150, 0.3)'
    if (touchBullet) { bullets.push(Polygon.createBullet(player)) }
  }
}

function resizeCanvas () {
  const oldStyleWidth = Number(canvas.style.width.split('px')[0]) // ---
  const oldStyleHeight = Number(canvas.style.height.split('px')[0]) // ---
  let newStyleWidth = null // ---
  let newStyleHeight = null // ---

  if (gameInterval !== null) {
    pause()
  }

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

  if (paused) {
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

  // const canvasRect = canvas.getBoundingClientRect()
  // buttonColumn.style.scale = `${scale}`
  // buttonColumn.style.top = canvasRect.y + (canvasRect.height / 2) + 'px'
  // buttonColumn.style.left = canvasRect.x + (canvasRect.width / 2) + 'px'
  // buttonColumn.style.transform = 'translate(-50%, -50%)'
}

function start () {
  playButton.style.display = 'none'
  resumeButton.style.display = 'block'
  againButton.style.display = 'block'
  buttonColumn.style.visibility = HIDDEN
  player = Player.create(canvas, scale, themes)

  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(200, scale), canvasStyleHeight() - Shape.scaled(300, scale), 100))
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(300, scale), canvasStyleHeight() - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(100, scale), canvasStyleHeight() - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(200, scale), canvasStyleHeight() - Shape.scaled(100, scale), 100))
  touchControls.forEach(touchControl => { touchControl.color = 'rgba(150, 150, 150, 0.3)' })
  setGameInterval()
}

function pause () {
  buttonColumn.style.visibility = VISIBLE
  paused = true
}

function resume () {
  buttonColumn.style.visibility = HIDDEN
  paused = false
}

function stop () {
  clearGameInterval()
  resumeButton.style.display = 'none'
  buttonColumn.style.visibility = VISIBLE
}

function restart () {
  // document.body.requestFullscreen() // ---
  clearGameInterval()
  clearLifeInterval()
  resumeButton.style.display = 'block'
  buttonColumn.style.visibility = HIDDEN
  player.reset(canvas, scale, themes)
  score.reset()
  keys.reset()
  touchControls = []
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(200, scale), canvasStyleHeight() - Shape.scaled(300, scale), 100))
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(300, scale), canvasStyleHeight() - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(100, scale), canvasStyleHeight() - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvasStyleWidth() - Shape.scaled(200, scale), canvasStyleHeight() - Shape.scaled(100, scale), 100))
  touchControls.forEach(touchControl => { touchControl.color = 'rgba(150, 150, 150, 0.3)' })
  bullets = []
  rocks = []
  paused = false
  setGameInterval()
}

function setGameInterval () {
  gameInterval = setInterval(manage, 10)
}

function clearGameInterval () {
  clearInterval(gameInterval)
  gameInterval = null
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

function manage () {
  clear()
  collisions()
  update()
  draw()
}

function clear () {
  context.clearRect(0, 0, Number(canvas.style.width.split('px')[0]), Number(canvas.style.height.split('px')[0])) // ---
}

function collisions () {
  let shards = []
  for (const bullet of bullets) {
    for (const rock of rocks) {
      if (rock.show && Collision.checkShapes(bullet, rock)) {
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
      if (Collision.checkShapes(player, rock)) {
        score.decrementLives()
        if (score.hasLives()) {
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
  if (keys.arrowUp() || keys.lowerW() || touchUp) { player.forward() }
  if (keys.space()) { bullets.push(Polygon.createBullet(player)) }
  if (keys.lowerP()) { pause() }
  if (keys.lowerR()) { resume() }

  bullets.forEach(bullet => bullet.update(canvas, scale, paused))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(canvas, scale, paused))
  rocks = rocks.filter(rock => rock.show)
  player.update(canvas, scale, paused)
  touchControls.forEach(touchControl => touchControl.update(canvas, scale, paused))
  score.update(scale)

  if (!rocks.length) {
    score.incrementLevel()
    rocks = Polygon.createRocks(canvas, scale, score.level())
  }
}

function draw () {
  bullets.forEach(bullet => bullet.draw(context))
  rocks.forEach(rock => rock.draw(context))
  player.draw(context)
  touchControls.forEach(touchControl => touchControl.draw(context))
  score.draw(context)
}

function canvasStyleWidth () { // ---
  return Number(canvas.style.width.split('px')[0])
}

function canvasStyleHeight () { // ---
  return Number(canvas.style.height.split('px')[0])
}
