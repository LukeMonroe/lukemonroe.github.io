import { Collision } from './collision.js'
import { DEFAULT_COLOR, COLLISION_COLOR, TRANSPARENT_COLOR, Polygon } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

let player = null
let score = null
let bullets = []
let rocks = []
let alive = null
let gameInterval = null
let deadInterval = null
let keys = null
let spacePressed = false

document.addEventListener('DOMContentLoaded', load)

function load () {
  canvas.width = 1400
  canvas.height = 800
  player = new Polygon(700, 400, 30, 5)
  player.name = 'player'
  score = new Score()
  keys = new Keys()
  alive = true
  document.body.insertBefore(canvas, document.body.childNodes[0])
  document.getElementById('play').addEventListener('click', start)
}

function start () {
  document.getElementById('play').style.visibility = 'hidden'
  document.getElementById('again').addEventListener('click', function (e) { restart() })
  document.getElementById('quit').addEventListener('click', function (e) { close() })
  gameInterval = setInterval(manage, 10)
}

function stop () {
  clearInterval(gameInterval)
  document.getElementById('again').style.visibility = 'visible'
  document.getElementById('quit').style.visibility = 'visible'
}

function restart () {
  document.getElementById('again').style.visibility = 'hidden'
  document.getElementById('quit').style.visibility = 'hidden'
  player = new Polygon(700, 400, 30, 5)
  player.name = 'player'
  score.reset()
  keys.reset()
  bullets = []
  rocks = []
  alive = true
  spacePressed = false
  gameInterval = setInterval(manage, 10)
}

function clear () {
  context.clearRect(0, 0, canvas.width, canvas.height)
}

function manage () {
  update()
  draw()
}

function update () {
  clear()
  player.speed = 0

  if (keys.arrowLeft()) { player.rotation -= 0.07 }
  if (keys.arrowRight()) { player.rotation += 0.07 }
  if (keys.arrowDown()) { player.speed = -3 }
  if (keys.arrowUp()) { player.speed = 3 }
  if (keys.space() && !spacePressed) {
    spacePressed = true
    bullets.push(Polygon.createBullet(player.x, player.y, player.rotation))
  } else {
    if (!keys.space() && spacePressed) {
      spacePressed = false
    }
  }

  collisions()
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
  score.draw(canvas, context)
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

  if (alive) {
    for (const rock of rocks) {
      if (Collision.checkShapes(player, rock)) {
        alive = false
        score.decrementLives()
        if (score.lives === 0) {
          player.color = COLLISION_COLOR
          setTimeout(stop, 50)
        } else {
          deadInterval = setInterval(function () { player.color = player.color === COLLISION_COLOR ? TRANSPARENT_COLOR : COLLISION_COLOR }, 80)
          setTimeout(function () { alive = true; player.color = DEFAULT_COLOR; clearInterval(deadInterval) }, 3000)
        }
        break
      }
    }
  }
}
