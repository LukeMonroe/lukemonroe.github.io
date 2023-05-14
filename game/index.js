import { Collision } from './collision.js'
import { DEFAULT_COLOR, COLLISION_COLOR, TRANSPARENT_COLOR, Polygon } from './shape.js'
import { Score } from './text.js'

let spaceDown = false
let player = null
let score = null
let bullets = []
let rocks = []
let alive = null
let gameInterval = null
let rockInterval = null
let deadInterval = null
let rockIntervalMillis = null

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
    document.getElementById('again').addEventListener('click', function (e) {
      game.restart()
    })
    document.getElementById('quit').addEventListener('click', function (e) {
      close()
    })
    window.addEventListener('keydown', function (e) {
      e.preventDefault()
      game.keys = (game.keys || [])
      game.keys[e.keyCode] = true
    })
    window.addEventListener('keyup', function (e) {
      game.keys[e.keyCode] = false
    })
    gameInterval = setInterval(manage, 10)
    rockIntervalMillis = 200
    rockInterval = setInterval(() => rocks.push(Polygon.createRock(game.canvas)), rockIntervalMillis)
  },
  stop: function () {
    clearInterval(gameInterval)
    clearInterval(rockInterval)
    document.getElementById('again').style.visibility = 'visible'
    document.getElementById('quit').style.visibility = 'visible'
  },
  clear: function () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
  },
  restart: function () {
    document.getElementById('again').style.visibility = 'hidden'
    document.getElementById('quit').style.visibility = 'hidden'
    gameInterval = setInterval(manage, 10)
    rockIntervalMillis = 200
    rockInterval = setInterval(() => rocks.push(Polygon.createRock(game.canvas)), 100)
    game.keys = []
    spaceDown = false
    player = new Polygon(700, 400, 30, 5)
    player.name = 'player'
    score = new Score()
    bullets = []
    rocks = []
    alive = true
  }
}

document.addEventListener('DOMContentLoaded', startGame)

function startGame () {
  player = new Polygon(700, 400, 30, 5)
  player.name = 'player'
  score = new Score()
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

  if (game.keys && game.keys[37]) { player.rotation -= 0.07 }
  if (game.keys && game.keys[39]) { player.rotation += 0.07 }
  if (game.keys && game.keys[38]) { player.speed = 3 }
  if (game.keys && game.keys[40]) { player.speed = -3 }
  if (game.keys && game.keys[32]) {
    if (!spaceDown && alive) {
      spaceDown = true
      bullets.push(Polygon.createBullet(player.x, player.y, player.rotation))
    }
  } else {
    spaceDown = false
  }

  collisions()
  bullets.forEach(bullet => bullet.update(game.canvas))
  bullets = bullets.filter(bullet => bullet.show)
  rocks.forEach(rock => rock.update(game.canvas))
  rocks = rocks.filter(rock => rock.show)
  player.update(game.canvas)
}

function draw () {
  bullets.forEach(bullet => bullet.draw(game.context))
  rocks.forEach(rock => rock.draw(game.context))
  player.draw(game.context)
  const playerCopy = new Polygon(player.x, player.y, 12, 3)
  playerCopy.rotation = player.rotation
  playerCopy.color = 'seagreen'
  playerCopy.draw(game.context)
  score.draw(game.canvas, game.context)
}

function collisions () {
  let shards = []
  for (const bullet of bullets) {
    for (const rock of rocks) {
      if (Collision.checkShapes(bullet, rock)) {
        shards = shards.concat(Polygon.createShards(rock))
        score.incrementScore()
        if (score.score > 0 && score.score % 10 === 0) {
          score.incrementLives()
        }
        if (rockIntervalMillis > 10) {
          rockIntervalMillis -= 1
          clearInterval(rockInterval)
          rockInterval = setInterval(() => rocks.push(Polygon.createRock(game.canvas)), rockIntervalMillis)
        }
        bullet.show = false
        rock.show = false
        break
      }
    }
  }
  rocks = rocks.concat(shards)

  if (alive) {
    player.color = DEFAULT_COLOR
    for (const rock of rocks) {
      if (Collision.checkShapes(player, rock)) {
        player.color = COLLISION_COLOR
        score.decrementLives()
        if (score.lives === 0) {
          alive = false
          setTimeout(game.stop, 50)
        } else {
          alive = false
          deadInterval = setInterval(function () { player.color = player.color === COLLISION_COLOR ? TRANSPARENT_COLOR : COLLISION_COLOR }, 80)
          setTimeout(function () {
            alive = true
            clearInterval(deadInterval)
          }, 3000)
        }
        break
      }
    }
  }
}
