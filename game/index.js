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

const buttons00 = document.createElement('div')
buttons00.className = 'buttons'
buttons00.appendChild(playButton)

const buttons01 = document.createElement('div')
buttons01.className = 'buttons'
buttons01.style.visibility = HIDDEN
buttons01.appendChild(againButton)
buttons01.appendChild(quitButton)

document.body.appendChild(canvas)
document.body.appendChild(buttons00)
document.body.appendChild(buttons01)

let player = Polygon.createPlayer(canvas)
const score = new Score()
const keys = new Keys()
let bullets = []
let rocks = []
let gameInterval = null
let lifeInterval = null
let spacePressed = false

function start () {
  buttons00.style.visibility = HIDDEN
  gameInterval = setInterval(manage, 10)
}

function stop () {
  clearInterval(gameInterval)
  buttons01.style.visibility = VISIBLE
}

function restart () {
  buttons01.style.visibility = HIDDEN
  player = Polygon.createPlayer(canvas)
  score.reset()
  keys.reset()
  bullets = []
  rocks = []
  spacePressed = false
  gameInterval = setInterval(manage, 10)
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
        if (score.lives === 0) {
          stop()
        } else {
          lifeInterval = setInterval(function () { player.alternateColor() }, 100)
          setTimeout(function () { clearInterval(lifeInterval); lifeInterval = null; player.defaultColor() }, 3000)
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
  if (keys.space() && !spacePressed) {
    spacePressed = true
    bullets.push(Polygon.createBullet(player))
  } else {
    if (!keys.space() && spacePressed) {
      spacePressed = false
    }
  }

  bullets.forEach(bullet => bullet.update(canvas))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(canvas))
  rocks = rocks.filter(rock => rock.show)
  player.update(canvas)

  if (!rocks.length) {
    score.incrementLevel()
    for (let i = 0; i < score.level * 2; i++) {
      rocks.push(Polygon.createRock(canvas))
    }
  }
}

function draw () {
  bullets.forEach(bullet => bullet.draw(context))
  rocks.forEach(rock => rock.draw(context))
  player.draw(context)
  score.draw(context)
}
