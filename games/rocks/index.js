import { Collision } from './collision.js'
import { Point, Shape, Circle, Polygon, Player } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'

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
playButton.className = 'play'
playButton.addEventListener(CLICK, start)

const resumeButton = document.createElement(BUTTON)
resumeButton.innerText = 'Resume'
resumeButton.className = 'resume'
resumeButton.style.visibility = HIDDEN
resumeButton.addEventListener(CLICK, resume)

const againButton = document.createElement(BUTTON)
againButton.innerText = 'Again'
againButton.className = 'again'
againButton.addEventListener(CLICK, restart)

const quitButton = document.createElement(BUTTON)
quitButton.innerText = 'Quit'
quitButton.className = 'quit'
quitButton.addEventListener(CLICK, function () { close() })

const startButtons = document.createElement(DIV)
startButtons.className = 'buttons'
startButtons.appendChild(playButton)

const endButtons = document.createElement(DIV)
endButtons.className = 'buttons'
endButtons.style.visibility = HIDDEN
endButtons.appendChild(againButton)
endButtons.appendChild(quitButton)

document.body.appendChild(canvas)
document.body.appendChild(startButtons)
document.body.appendChild(endButtons)
document.body.appendChild(resumeButton)

let player = null
const score = new Score()
const keys = new Keys()
let touchControls = []
let bullets = []
let rocks = []
let gameInterval = null
let lifeInterval = null
let scale = 1
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
canvas.addEventListener('touchend', event => handleTouch(event), 'c')
canvas.addEventListener('touchcancel', event => handleTouch(event), 'd')

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
          } else if (i === 4) {
            if (type === 'a') {
              touchBullet = true
            }
          }
        }
      }
    }

    touchControls[0].color = touchUp ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
    touchControls[1].color = touchUp ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
    touchControls[2].color = touchUp ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
    touchControls[3].color = touchUp ? 'rgba(255, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'
    if (touchBullet) { bullets.push(Polygon.createBullet(player)) }
  }
}

function resizeCanvas () {
  const oldWidth = canvas.width
  const oldHeight = canvas.height

  if (gameInterval !== null) {
    pause()
  }

  if (document.body.clientWidth < CANVAS_MIN_WIDTH || window.innerHeight < CANVAS_MIN_HEIGHT) {
    canvas.width = CANVAS_MIN_WIDTH
    canvas.height = CANVAS_MIN_HEIGHT
  } else if (document.body.clientWidth > CANVAS_MAX_WIDTH && window.innerHeight > CANVAS_MAX_HEIGHT) {
    canvas.width = CANVAS_MAX_WIDTH
    canvas.height = CANVAS_MAX_HEIGHT
  } else {
    canvas.width = document.body.clientWidth
    canvas.height = canvas.width / ASPECT_RATIO

    if (canvas.height > window.innerHeight) {
      canvas.height = window.innerHeight
      canvas.width = canvas.height * ASPECT_RATIO
    }
  }

  if (paused) {
    const widthDelta = canvas.width / oldWidth
    const heightDelta = canvas.height / oldHeight

    player.x *= widthDelta
    player.y *= heightDelta
    bullets.forEach(bullet => { bullet.x *= widthDelta; bullet.y *= heightDelta })
    rocks.forEach(rock => { rock.x *= widthDelta; rock.y *= heightDelta })
    touchControls.forEach(touchControl => { touchControl.x *= widthDelta; touchControl.y *= heightDelta })
  }

  scale = canvas.width / CANVAS_MAX_WIDTH
  const canvasRect = canvas.getBoundingClientRect()
  resumeButton.style.top = canvasRect.y + (canvasRect.height / 2) + 'px'
  resumeButton.style.left = canvasRect.x + (canvasRect.width / 2) + 'px'
  resumeButton.style.transform = 'translate(-50%, -50%)'
}

function start () {
  document.body.requestFullscreen()
  startButtons.style.visibility = HIDDEN
  scale = canvas.width / CANVAS_MAX_WIDTH
  player = Player.create(canvas, scale)

  touchControls.push(new Circle(canvas.width - Shape.scaled(200, scale), canvas.height - Shape.scaled(300, scale), 100))
  touchControls.push(new Circle(canvas.width - Shape.scaled(300, scale), canvas.height - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvas.width - Shape.scaled(100, scale), canvas.height - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvas.width - Shape.scaled(200, scale), canvas.height - Shape.scaled(100, scale), 100))
  touchControls.push(new Circle(Shape.scaled(200, scale), canvas.height - Shape.scaled(100, scale), 90))
  touchControls.forEach(touchControl => { touchControl.color = 'rgba(255, 255, 255, 0.1)' })
  setGameInterval()
}

function pause () {
  resumeButton.style.visibility = VISIBLE
  paused = true
}

function resume () {
  resumeButton.style.visibility = HIDDEN
  paused = false
}

function stop () {
  clearGameInterval()
  endButtons.style.visibility = VISIBLE
}

function restart () {
  clearGameInterval()
  clearLifeInterval()
  endButtons.style.visibility = HIDDEN
  scale = canvas.width / CANVAS_MAX_WIDTH
  player.reset(canvas, scale)
  score.reset()
  keys.reset()
  touchControls = []
  touchControls.push(new Circle(canvas.width - Shape.scaled(200, scale), canvas.height - Shape.scaled(300, scale), 100))
  touchControls.push(new Circle(canvas.width - Shape.scaled(300, scale), canvas.height - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvas.width - Shape.scaled(100, scale), canvas.height - Shape.scaled(200, scale), 100))
  touchControls.push(new Circle(canvas.width - Shape.scaled(200, scale), canvas.height - Shape.scaled(100, scale), 100))
  touchControls.push(new Circle(Shape.scaled(200, scale), canvas.height - Shape.scaled(100, scale), 90))
  touchControls.forEach(touchControl => { touchControl.color = 'rgba(255, 255, 255, 0.1)' })
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
  context.clearRect(0, 0, canvas.width, canvas.height)
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
