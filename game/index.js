import { Collision } from './collision.js'
import { Polygon } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'

const CLICK = 'click'
const CANVAS = 'canvas'
const BUTTON = 'button'
const DIV = 'div'
const VISIBLE = 'visible'
const HIDDEN = 'hidden'

const canvas = document.createElement(CANVAS)
canvas.width = 1000
canvas.height = 700

const context = canvas.getContext('2d')

const playButton = document.createElement(BUTTON)
playButton.innerText = 'Play'
playButton.className = 'play'
playButton.addEventListener(CLICK, start)

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

const leftButton = document.createElement(BUTTON)
leftButton.innerText = 'Left'
leftButton.className = 'controls'
leftButton.addEventListener('mousedown', function () { leftDown = true })
leftButton.addEventListener('mouseup', function () { leftDown = false })
leftButton.addEventListener('mouseleave', function () { leftDown = false })

const rightButton = document.createElement(BUTTON)
rightButton.innerText = 'Right'
rightButton.className = 'controls'
rightButton.addEventListener('mousedown', function () { rightDown = true })
rightButton.addEventListener('mouseup', function () { rightDown = false })
rightButton.addEventListener('mouseleave', function () { rightDown = false })

const upButton = document.createElement(BUTTON)
upButton.innerText = 'Up'
upButton.className = 'controls'
upButton.addEventListener('mousedown', function () { upDown = true })
upButton.addEventListener('mouseup', function () { upDown = false })
upButton.addEventListener('mouseleave', function () { upDown = false })

const downButton = document.createElement(BUTTON)
downButton.innerText = 'Down'
downButton.className = 'controls'
downButton.addEventListener('mousedown', function () { downDown = true })
downButton.addEventListener('mouseup', function () { downDown = false })
downButton.addEventListener('mouseleave', function () { downDown = false })

const controls = document.createElement(DIV)
controls.className = 'controls'
controls.appendChild(upButton)
controls.appendChild(downButton)
controls.appendChild(leftButton)
controls.appendChild(rightButton)

document.body.appendChild(canvas)
document.body.appendChild(startButtons)
document.body.appendChild(endButtons)
document.body.appendChild(controls)

let player = Polygon.createPlayer(canvas)
const score = new Score()
const keys = new Keys()
let bullets = []
let rocks = []
let gameInterval = null
let lifeInterval = null
let upDown = false
let downDown = false
let leftDown = false
let rightDown = false

function start () {
  startButtons.style.visibility = HIDDEN
  setGameInterval()
}

function stop () {
  clearGameInterval()
  endButtons.style.visibility = VISIBLE
}

function restart () {
  endButtons.style.visibility = HIDDEN
  player = Polygon.createPlayer(canvas)
  score.reset()
  keys.reset()
  bullets = []
  rocks = []
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
  if (keys.arrowLeft() || leftDown) { player.angle -= 0.07; player.rotation -= 0.07 }
  if (keys.arrowRight() || rightDown) { player.angle += 0.07; player.rotation += 0.07 }
  if (keys.arrowDown() || downDown) { player.speed = -4 }
  if (keys.arrowUp() || upDown) { player.speed = 4 }
  if (keys.space()) { bullets.push(Polygon.createBullet(player)) }

  bullets.forEach(bullet => bullet.update(canvas))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(canvas))
  rocks = rocks.filter(rock => rock.show)
  player.update(canvas)

  if (!rocks.length) {
    score.incrementLevel()
    rocks = Polygon.createRocks(canvas, score.level())
  }
}

function draw () {
  bullets.forEach(bullet => bullet.draw(context))
  rocks.forEach(rock => rock.draw(context))
  player.draw(context)
  score.draw(context)
}
