import { Collision } from './collision.js'
import { Polygon } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'

const VISIBLE = 'visible'
const HIDDEN = 'hidden'

const canvas = document.createElement('canvas')
canvas.width = 1000
canvas.height = 700

const context = canvas.getContext('2d')

const playButton = document.createElement('button')
playButton.innerText = 'Play'
playButton.className = 'play'
playButton.addEventListener('click', start)

const againButton = document.createElement('button')
againButton.innerText = 'Again'
againButton.className = 'again'
againButton.addEventListener('click', restart)

const quitButton = document.createElement('button')
quitButton.innerText = 'Quit'
quitButton.className = 'quit'
quitButton.addEventListener('click', function (e) { close() })

const startButtons = document.createElement('div')
startButtons.className = 'buttons'
startButtons.appendChild(playButton)

const endButtons = document.createElement('div')
endButtons.className = 'buttons'
endButtons.style.visibility = HIDDEN
endButtons.appendChild(againButton)
endButtons.appendChild(quitButton)

document.body.appendChild(canvas)
document.body.appendChild(startButtons)
document.body.appendChild(endButtons)

let player = Polygon.createPlayer(canvas)
const score = new Score()
const keys = new Keys()
let bullets = []
let rocks = []
let gameInterval = null
let lifeInterval = null

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
  if (keys.arrowLeft()) { player.angle -= 0.07; player.rotation -= 0.07 }
  if (keys.arrowRight()) { player.angle += 0.07; player.rotation += 0.07 }
  if (keys.arrowDown()) { player.speed = -4 }
  if (keys.arrowUp()) { player.speed = 4 }
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
