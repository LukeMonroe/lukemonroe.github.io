const CIRCLE = 'circle'
const POLYGON = 'polygon'
const PLAYER = 'player'
const BULLET = 'bullet'
const ROCK = 'rock'
const SHARD = 'shard'
const SEA_GREEN = 'seagreen'
const DARK_GREY = 'darkgrey'
const GHOST_WHITE = 'ghostwhite'
const SKY_BLUE = 'skyblue'
const FIRE_BRICK = 'firebrick'
const TOMATO = 'tomato'
const PALE_VIOLET_RED = 'palevioletred'
const BOUNDS_OFFSET = 150

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
    this.speed = 0
    this.show = true
    this.color = DARK_GREY
  }

  update (canvas) {
    if (this.show) {
      const x = this.x + this.speed * Math.sin(this.angle)
      const y = this.y - this.speed * Math.cos(this.angle)

      if (this.name === ROCK || this.name === SHARD) {
        this.rotation += this.rotation > 0 ? 0.01 : -0.01
      } else if (this.name === BULLET) {
        this.rotation += 0.15
        this.speed -= 0.05
        if (this.speed <= 0) {
          this.show = false
        }
      }

      if (this.name === PLAYER) {
        if (x > 0 && x < canvas.width) {
          this.x = x
        }
        if (y > 0 && y < canvas.height) {
          this.y = y
        }
      } else {
        if (x > 0 - BOUNDS_OFFSET && x < canvas.width + BOUNDS_OFFSET) {
          this.x = x
        } else {
          if (this.name === BULLET) {
            this.show = false
          } else {
            this.angle *= -1
          }
        }
        if (y > 0 - BOUNDS_OFFSET && y < canvas.height + BOUNDS_OFFSET) {
          this.y = y
        } else {
          if (this.name === BULLET) {
            this.show = false
          } else {
            this.angle *= -1
            this.speed *= -1
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

  update (canvas) {
    super.update(canvas)
  }

  draw (context) {
    if (this.show) {
      context.save()
      context.fillStyle = this.color
      context.beginPath()

      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)

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
      rotatedVertices.push(rotatedVertex)
    }

    return rotatedVertices
  }

  update (canvas) {
    super.update(canvas)
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

      // Draw the front of the player.
      if (this.name === PLAYER) {
        context.strokeStyle = SEA_GREEN
        context.lineWidth = 4
        context.beginPath()

        const vertices = this.getRotatedVertices()
        context.moveTo(this.x + vertices[2].x, this.y + vertices[2].y)
        context.lineTo(this.x + vertices[3].x, this.y + vertices[3].y)
        context.lineTo(this.x + vertices[4].x, this.y + vertices[4].y)

        context.stroke()
      }

      context.restore()
    }
  }

  defaultColor () {
    this.color = DARK_GREY
  }

  alternateColor () {
    this.color = this.color === DARK_GREY ? GHOST_WHITE : DARK_GREY
  }

  static createPlayer (canvas) {
    const player = new Polygon(canvas.width / 2, canvas.height / 2, 30, 5)
    player.name = PLAYER

    return player
  }

  static createBullet (player) {
    const bullet = new Polygon(player.x, player.y, 10, 3)
    bullet.angle = player.angle
    bullet.rotation = player.rotation
    bullet.speed = 8
    bullet.color = SKY_BLUE
    bullet.name = BULLET

    return bullet
  }

  static createRocks (canvas, quantity) {
    const rocks = []
    while (quantity > 0) {
      rocks.push(Polygon.createRock(canvas))
      quantity--
    }

    return rocks
  }

  static createRock (canvas) {
    const sides = Shape.rangeRandom(3, 8)
    const radius = Shape.rangeRandom(71, 100)

    let offset = Shape.limitRandom(BOUNDS_OFFSET)
    const x = Shape.random() >= 0.5 ? canvas.width + offset : -offset

    offset = Shape.limitRandom(BOUNDS_OFFSET)
    const y = Shape.random() >= 0.5 ? canvas.height + offset : -offset

    const rock = new Polygon(x, y, radius, sides)
    rock.angle = Shape.limitRandom(Math.PI * 2)
    rock.rotation = Shape.limitRandom(Math.PI * 2)
    rock.rotation *= Shape.random() >= 0.5 ? 1 : -1
    rock.speed = 1
    rock.color = FIRE_BRICK
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
        shard.speed = shard.radius > 40 ? 1.5 : 2
        shard.color = shard.radius > 40 ? TOMATO : PALE_VIOLET_RED
        shard.name = SHARD
        shards.push(shard)
      }
    }

    return shards
  }
}

export { CIRCLE, POLYGON, Point, Circle, Polygon }
