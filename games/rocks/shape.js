import { Colors } from '../../colors.js'

const CIRCLE = 'circle'
const POLYGON = 'polygon'
const PLAYER = 'player'
const BULLET = 'bullet'
const ROCK = 'rock'
const SHARD = 'shard'
const BOUNDS_OFFSET = 150

// TODO: Update the colors method to be numbers not strings.
const color = Colors.createHSL(String(Math.round(Math.random() * 359)), '60', '65')
const hues = Colors.hues(color, 200, 40)

const PLAYER_COLOR = Colors.lightness(hues[0], -35).formattedHex
const PLAYER_FRONT_COLOR = hues[0].formattedHex
const BULLET_COLOR = hues[1].formattedHex
const SMALL_SHARD_COLOR = hues[2].formattedHex
const LARGE_SHARD_COLOR = hues[3].formattedHex
const ROCK_COLOR = hues[4].formattedHex

class Point {
  constructor (x, y) {
    this.x = x
    this.y = y
  }

  copy () {
    return new Point(this.x, this.y)
  }

  getDistance () {
    return Point.getDistance(this.x, this.y)
  }

  static getDistance (x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2))
  }
}

class Shape {
  constructor (x, y, radius, type) {
    this.x = x
    this.y = y
    this.radius = radius
    this.type = type

    this.name = null
    this.angle = 0
    this.rotation = 0
    this.scale = 1
    this.defaultSpeed = 0
    this.speed = 0
    this.show = true
    this.color = PLAYER_COLOR
  }

  scaled (number) {
    return Shape.scaled(number, this.scale)
  }

  static scaled (number, scale) {
    return number * scale
  }

  update (canvas, scale, paused) {
    this.scale = scale

    if (!paused && this.show) {
      if (this.name === PLAYER) {
        this.speed = this.scaled(this.speed)
      } else {
        this.speed = this.scaled(this.defaultSpeed)
      }

      const x = this.x + this.speed * Math.sin(this.angle)
      const y = this.y - this.speed * Math.cos(this.angle)

      if (this.name === ROCK || this.name === SHARD) {
        this.rotation += this.rotation > 0 ? 0.01 : -0.01
      } else if (this.name === BULLET) {
        this.rotation += 0.15
        this.defaultSpeed -= 0.05
        if (this.defaultSpeed <= 0) {
          this.show = false
        }
      }

      if (this.name === PLAYER) {
        if (x > 0 && x < canvasStyleWidth(canvas)) { // ---
          this.x = x
        }
        if (y > 0 && y < canvasStyleHeight(canvas)) { // ---
          this.y = y
        }
      } else {
        if (x > this.scaled(-BOUNDS_OFFSET) && x < canvasStyleWidth(canvas) + this.scaled(BOUNDS_OFFSET)) { // ---
          this.x = x
        } else {
          if (this.name === BULLET) {
            this.show = false
          } else {
            this.angle *= -1
          }
        }
        if (y > this.scaled(-BOUNDS_OFFSET) && y < canvasStyleHeight(canvas) + this.scaled(BOUNDS_OFFSET)) { // ---
          this.y = y
        } else {
          if (this.name === BULLET) {
            this.show = false
          } else {
            this.angle *= -1
            this.defaultSpeed *= -1
          }
        }
      }
    }
  }

  static rangeRandom (floor, ceil) {
    const number = Math.ceil(Shape.limitRandom(ceil))
    return number < floor ? floor : number
  }

  static limitRandom (limit) {
    return Shape.random() * limit
  }

  static random () {
    return Math.random()
  }
}

class Circle extends Shape {
  constructor (x, y, radius) {
    super(x, y, radius, CIRCLE)
  }

  update (canvas, scale, paused) {
    super.update(canvas, scale, paused)
  }

  draw (context) {
    if (this.show) {
      context.save()
      context.fillStyle = this.color
      context.beginPath()

      context.arc(this.x, this.y, this.scaled(this.radius), 0, Math.PI * 2)

      context.closePath()
      context.fill()
      context.restore()
    }
  }
}

class Polygon extends Shape {
  constructor (x, y, radius, sides) {
    super(x, y, radius, POLYGON)
    this.sides = Math.round(sides)
    this.vertices = []

    let angle = 0
    const sideAngle = (Math.PI * 2) / this.sides
    for (let side = 0; side < this.sides; side++) {
      angle = (side * sideAngle) + ((Math.PI - sideAngle) * 0.5)
      this.vertices.push(new Point(Math.cos(angle) * radius, Math.sin(angle) * radius))
    }
  }

  getRotatedVertices () {
    const rotatedVertices = []
    for (const vertex of this.vertices) {
      const rotatedVertex = vertex.copy()
      if (this.rotation !== 0) {
        const distance = vertex.getDistance()
        const angle = Math.atan2(vertex.y, vertex.x) + this.rotation
        rotatedVertex.x = Math.cos(angle) * distance
        rotatedVertex.y = Math.sin(angle) * distance
      }

      rotatedVertex.x = this.scaled(rotatedVertex.x)
      rotatedVertex.y = this.scaled(rotatedVertex.y)
      rotatedVertices.push(rotatedVertex)
    }

    return rotatedVertices
  }

  update (canvas, scale, paused) {
    super.update(canvas, scale, paused)
  }

  draw (context) {
    if (this.show) {
      context.save()
      context.fillStyle = this.color
      context.beginPath()

      // Start drawing from the last vertex.
      const vertices = this.getRotatedVertices()
      context.moveTo(this.x + vertices[vertices.length - 1].x, this.y + vertices[vertices.length - 1].y)
      vertices.forEach(vertex => context.lineTo(this.x + vertex.x, this.y + vertex.y))

      context.closePath()
      context.fill()
      context.restore()
    }
  }

  static createBullet (player) {
    const bullet = new Polygon(player.x, player.y, 10, 3)
    bullet.angle = player.angle
    bullet.rotation = player.rotation
    bullet.scale = player.scale
    bullet.defaultSpeed = 8
    bullet.color = BULLET_COLOR
    bullet.name = BULLET

    return bullet
  }

  static createRocks (canvas, scale, level) {
    const rocks = []
    let quantity = level * 2
    while (quantity > 0) {
      rocks.push(Polygon.createRock(canvas, scale))
      quantity--
    }

    return rocks
  }

  static createRock (canvas, scale) {
    const sides = Shape.rangeRandom(3, 8)
    const radius = Shape.rangeRandom(71, 100)

    let offset = Shape.limitRandom(Shape.scaled(BOUNDS_OFFSET, scale))
    const x = Shape.random() >= 0.5 ? canvasStyleWidth(canvas) + offset : -offset // ---

    offset = Shape.limitRandom(Shape.scaled(BOUNDS_OFFSET, scale))
    const y = Shape.random() >= 0.5 ? canvasStyleHeight(canvas) + offset : -offset // ---

    const rock = new Polygon(x, y, radius, sides)
    rock.angle = Shape.limitRandom(Math.PI * 2)
    rock.rotation = Shape.limitRandom(Math.PI * 2)
    rock.rotation *= Shape.random() >= 0.5 ? 1 : -1
    rock.defaultSpeed = 1
    rock.color = LARGE_SHARD_COLOR
    rock.name = ROCK

    return rock
  }

  static createShards (rock) {
    const shards = []
    if (rock.radius > 40) {
      for (let index = 0; index < rock.sides; index++) {
        const sides = Shape.rangeRandom(3, 8)
        const radius = rock.radius > 70 ? Shape.rangeRandom(41, 60) : Shape.rangeRandom(21, 40)

        const shard = new Polygon(rock.x, rock.y, radius, sides)
        shard.angle = Shape.limitRandom(Math.PI * 2)
        shard.rotation = Shape.limitRandom(Math.PI * 2)
        shard.rotation *= Shape.random() >= 0.5 ? 1 : -1
        shard.defaultSpeed = shard.radius > 40 ? 1.5 : 2
        shard.scale = rock.scale
        shard.color = shard.radius > 40 ? ROCK_COLOR : SMALL_SHARD_COLOR
        shard.name = SHARD
        shards.push(shard)
      }
    }

    return shards
  }
}

class Player extends Polygon {
  #themes = null
  #theme = null
  #lifeColor = null

  constructor (canvas, scale, themes) {
    super(canvasStyleWidth(canvas) / 2, canvasStyleHeight(canvas) / 2, 30, 5) // ---
    this.scale = scale
    this.name = PLAYER

    this.#themes = themes
    this.#theme = themes.getTheme()
    this.#lifeColor = this.#themes.color
  }

  draw (context) {
    super.draw(context)

    // Draw the front of the player.
    if (this.show) {
      context.save()
      context.strokeStyle = PLAYER_FRONT_COLOR
      context.lineWidth = this.scaled(4)
      context.beginPath()

      const vertices = this.getRotatedVertices()
      context.moveTo(this.x + vertices[2].x, this.y + vertices[2].y)
      context.lineTo(this.x + vertices[3].x, this.y + vertices[3].y)
      context.lineTo(this.x + vertices[4].x, this.y + vertices[4].y)

      context.stroke()
      context.restore()
    }
  }

  defaultColor () {
    this.color = PLAYER_COLOR
  }

  alternateColor () {
    this.color = this.color === PLAYER_COLOR ? this.#lifeColor : PLAYER_COLOR
  }

  rotateLeft () {
    this.angle -= 0.07
    this.rotation -= 0.07
  }

  rotateRight () {
    this.angle += 0.07
    this.rotation += 0.07
  }

  forward (elapsedTimeStamp) {
    this.speed = 0.25 * elapsedTimeStamp
    // console.log(this.speed)
  }

  backward () {
    this.speed = -4
  }

  reset (canvas, scale, themes) {
    const player = new Player(canvas, scale, themes)
    this.x = player.x
    this.y = player.y
    this.radius = player.radius
    this.type = player.type
    this.sides = player.sides
    this.vertices = player.vertices

    this.name = player.name
    this.angle = player.angle
    this.rotation = player.rotation
    this.scale = player.scale
    this.defaultSpeed = player.defaultSpeed
    this.speed = player.speed
    this.show = player.show
    this.color = player.color

    this.#themes = player.#themes
    this.#theme = player.#theme
    this.#lifeColor = player.#lifeColor
  }

  static create (canvas, scale, themes) {
    return new Player(canvas, scale, themes)
  }
}

function canvasStyleWidth (canvas) { // ---
  return Number(canvas.style.width.split('px')[0])
}

function canvasStyleHeight (canvas) { // ---
  return Number(canvas.style.height.split('px')[0])
}

export { CIRCLE, POLYGON, Point, Shape, Circle, Polygon, Player }
