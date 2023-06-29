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
const controls = []
const score = new Score()
const keys = new Keys()
let bullets = []
let rocks = []
let gameInterval = null
let lifeInterval = null
let scale = 1
let paused = false
let playerLeft = false
let playerRight = false
let playerUp = false
let playerDown = false
let madeBullet = false

resizeCanvas()
window.addEventListener('resize', resizeCanvas)
// window.addEventListener('mousedown', event => { mouseControls(event) })
window.addEventListener('touchstart', event => touchControls(event, 'a'))
window.addEventListener('touchmove', event => touchControls(event, 'b'))
window.addEventListener('touchend', event => touchControls(event), 'c')
window.addEventListener('touchcancel', event => touchControls(event), 'd')

function mouseControls (event) {
  if (controls.length > 0) {
    event.preventDefault()

    const r = canvas.getBoundingClientRect()
    const x = event.clientX - r.left
    const y = event.clientY - r.top

    for (let i = 0; i < controls.length; i++) {
      const dist = Point.getDistance(x - controls[i].x, y - controls[i].y)
      if (dist < Shape.scaled(controls[i].radius, scale)) {
        if (i === 0) {
          playerUp = !playerUp
          playerDown = false
          break
        } else if (i === 1) {
          playerLeft = !playerLeft
          playerRight = false
          break
        } else if (i === 2) {
          playerRight = !playerRight
          playerLeft = false
          break
        } else if (i === 3) {
          playerDown = !playerDown
          playerUp = false
          break
        } else if (i === 4) {
          bullets.push(Polygon.createBullet(player))
          break
        }
      }
    }

    if (playerUp) {
      controls[0].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[0].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (playerLeft) {
      controls[1].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[1].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (playerRight) {
      controls[2].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[2].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (playerDown) {
      controls[3].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[3].color = 'rgba(255, 255, 255, 0.1)'
    }
  }
}

function touchControls (event, type) {
  if (controls.length > 0) {
    event.preventDefault()

    playerLeft = false
    playerRight = false
    playerUp = false
    playerDown = false
    madeBullet = false
    if (type === 'c' || type === 'd') {
      return
    }

    const r = canvas.getBoundingClientRect()
    const touches = event.changedTouches
    for (let t = 0; t < touches.length; t++) {
      const x = touches[t].clientX - r.left
      const y = touches[t].clientY - r.top

      for (let i = 0; i < controls.length; i++) {
        const dist = Point.getDistance(x - controls[i].x, y - controls[i].y)
        if (dist < Shape.scaled(controls[i].radius, scale)) {
          if (i === 0) {
            playerUp = true
            playerDown = false
          } else if (i === 1) {
            playerLeft = true
            playerRight = false
          } else if (i === 2) {
            playerRight = true
            playerLeft = false
          } else if (i === 3) {
            playerDown = true
            playerUp = false
          } else if (i === 4) {
            if (type === 'a') {
              madeBullet = true
            }
          }
        }
      }
    }

    if (playerUp) {
      controls[0].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[0].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (playerLeft) {
      controls[1].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[1].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (playerRight) {
      controls[2].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[2].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (playerDown) {
      controls[3].color = 'rgba(255, 255, 255, 0.3)'
    } else {
      controls[3].color = 'rgba(255, 255, 255, 0.1)'
    }
    if (madeBullet) {
      bullets.push(Polygon.createBullet(player))
    }
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
    controls.forEach(control => { control.x *= widthDelta; control.y *= heightDelta })
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

  controls.push(new Circle(canvas.width - Shape.scaled(200, scale), canvas.height - Shape.scaled(300, scale), 100))
  controls.push(new Circle(canvas.width - Shape.scaled(300, scale), canvas.height - Shape.scaled(200, scale), 100))
  controls.push(new Circle(canvas.width - Shape.scaled(100, scale), canvas.height - Shape.scaled(200, scale), 100))
  controls.push(new Circle(canvas.width - Shape.scaled(200, scale), canvas.height - Shape.scaled(100, scale), 100))
  controls.push(new Circle(Shape.scaled(200, scale), canvas.height - Shape.scaled(100, scale), 90))
  controls.forEach(control => { control.color = 'rgba(255, 255, 255, 0.1)' })
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
  if (keys.arrowLeft() || keys.lowerA() || playerLeft) { player.rotateLeft() }
  if (keys.arrowRight() || keys.lowerD() || playerRight) { player.rotateRight() }
  if (keys.arrowDown() || keys.lowerS() || playerDown) { player.backward() }
  if (keys.arrowUp() || keys.lowerW() || playerUp) { player.forward() }
  if (keys.space()) { bullets.push(Polygon.createBullet(player)) }
  if (keys.lowerP()) { pause() }
  if (keys.lowerR()) { resume() }

  bullets.forEach(bullet => bullet.update(canvas, scale, paused))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(canvas, scale, paused))
  rocks = rocks.filter(rock => rock.show)
  player.update(canvas, scale, paused)
  controls.forEach(control => control.update(canvas, scale, paused))
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
  controls.forEach(control => control.draw(context))
  score.draw(context)
}
