import { Collision } from './collision.js'
import { DEFAULT_COLOR, COLLISION_COLOR, TRANSPARENT_COLOR, Polygon } from './shape.js'
import { Score } from './score.js'
import { Keys } from './keys.js'

let spacePressed = false
let player = null
let score = null
let bullets = []
let rocks = []
let alive = null
let gameInterval = null
let deadInterval = null
let keys = null

const game = {
  canvas: document.createElement('canvas'),

  init: function () {
    this.canvas.width = 1400
    this.canvas.height = 800
    this.context = this.canvas.getContext('2d')
    document.body.insertBefore(this.canvas, document.body.childNodes[0])
    this.frames = 0
  },
  start: function () {
    document.getElementById('play').style.visibility = 'hidden'
    document.getElementById('again').addEventListener('click', function (e) { game.restart() })
    document.getElementById('quit').addEventListener('click', function (e) { close() })
    gameInterval = setInterval(manage, 10)
  },
  stop: function () {
    clearInterval(gameInterval)
    document.getElementById('again').style.visibility = 'visible'
    document.getElementById('quit').style.visibility = 'visible'
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
  restart: function () {
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
}

document.addEventListener('DOMContentLoaded', startGame)

function startGame () {
  player = new Polygon(700, 400, 30, 5)
  player.name = 'player'
  score = new Score()
  keys = new Keys()
  alive = true
  game.init()
  document.getElementById('play').addEventListener('click', game.start)
}

function manage () {
  update()
  draw()
}

function update () {
  game.clear()
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
  bullets.forEach(bullet => bullet.update(game.canvas))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(game.canvas))
  rocks = rocks.filter(rock => rock.show)
  player.update(game.canvas)

  if (!rocks.length) {
    score.incrementLevel()
    for (let i = 0; i < score.level * 2; i++) {
      rocks.push(Polygon.createRock(game.canvas))
    }
  }
}

function draw () {
  bullets.forEach(bullet => bullet.draw(game.context))
  rocks.forEach(rock => rock.draw(game.context))
  player.draw(game.context)
  score.draw(game.canvas, game.context)
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
          setTimeout(game.stop, 50)
        } else {
          deadInterval = setInterval(function () { player.color = player.color === COLLISION_COLOR ? TRANSPARENT_COLOR : COLLISION_COLOR }, 80)
          setTimeout(function () { alive = true; player.color = DEFAULT_COLOR; clearInterval(deadInterval) }, 3000)
        }
        break
      }
    }
  }
}
