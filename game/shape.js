const CIRCLE = 'circle'
const POLYGON = 'polygon'
const DEFAULT_COLOR = 'white'
const COLLISION_COLOR = 'royalblue'
const BULLET_COLOR = 'skyblue'
const ROCK_COLOR = 'firebrick'
const SHARD_COLOR = 'palevioletred'
const TRANSPARENT_COLOR = 'rgba(0,0,0,0)'
const BOUNDS_OFFSET = 250

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
    this.rotation = 0
    this.speed = 0
    this.show = true
    this.color = DEFAULT_COLOR
  }

  update (canvas) {
    if (this.show) {
      const x = this.x + this.speed * Math.sin(this.rotation)
      const y = this.y - this.speed * Math.cos(this.rotation)

      if (this.name === null) {
        if (x > 0 - BOUNDS_OFFSET && x < canvas.width + BOUNDS_OFFSET) {
          this.x = x
        } else {
          this.show = false
        }
        if (y > 0 - BOUNDS_OFFSET && y < canvas.height + BOUNDS_OFFSET) {
          this.y = y
        } else {
          this.show = false
        }
      } else {
        if (x > 0 && x < canvas.width) {
          this.x = x
        }
        if (y > 0 && y < canvas.height) {
          this.y = y
        }
      }
    }
  }
}

class Circle extends Shape {
  constructor (x, y, radius) {
    super(x, y, radius, CIRCLE)
  }

  copy () {
    const circle = new Circle(this.x, this.y, this.radius)
    circle.name = this.name
    circle.rotation = this.rotation
    circle.speed = this.speed
    circle.show = this.show
    circle.color = this.color

    return circle
  }

  update (canvas) {
    super.update(canvas)
  }

  draw (context) {
    if (this.show) {
      context.save()
      context.strokeStyle = this.color
      context.lineWidth = 2
      context.beginPath()

      context.arc(this.x, this.y, this.radius, 0, Math.PI * 2)

      context.closePath()
      context.stroke()
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

  copy () {
    const polygon = new Polygon(this.x, this.y, this.radius, this.sides)
    polygon.name = this.name
    polygon.rotation = this.rotation
    polygon.speed = this.speed
    polygon.show = this.show
    polygon.color = this.color

    return polygon
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
      context.strokeStyle = this.color
      context.lineWidth = 2
      context.beginPath()

      // Start drawing from the last vertex.
      const vertices = this.getRotatedVertices()
      context.moveTo(this.x + vertices[vertices.length - 1].x, this.y + vertices[vertices.length - 1].y)
      for (const vertex of vertices) {
        context.lineTo(this.x + vertex.x, this.y + vertex.y)
      }

      context.closePath()
      context.fillStyle = this.color
      context.fill()
      context.stroke()
      context.restore()
    }
  }

  static createBullet (x, y, rotation) {
    const bullet = new Polygon(x, y, 6, 3)
    bullet.rotation = rotation
    bullet.speed = 10
    bullet.color = BULLET_COLOR

    return bullet
  }

  static createRock (canvas) {
    let sides = Math.floor(Math.random() * 8)
    sides = sides < 3 ? 3 : sides

    let radius = Math.floor(Math.random() * 80)
    radius = radius < 40 ? 40 : radius

    let x = 0
    let offset = Math.random() * BOUNDS_OFFSET
    if (Math.random() >= 0.5) {
      x = canvas.width + offset
    } else {
      x = 0 - offset
    }

    let y = 0
    offset = Math.random() * BOUNDS_OFFSET
    if (Math.random() >= 0.5) {
      y = offset + canvas.height
    } else {
      y = 0 - offset
    }

    const rock = new Polygon(x, y, radius, sides)
    rock.rotation = Math.random() * Math.PI * 2
    rock.speed = 2
    rock.color = ROCK_COLOR

    return rock
  }

  static createShards (rock) {
    const shards = []
    if (rock.radius > 30) {
      for (let index = 0; index < rock.sides; index++) {
        let sides = Math.floor(Math.random() * 8)
        sides = sides < 3 ? 3 : sides

        let radius = Math.floor(Math.random() * 30)
        radius = radius < 10 ? 10 : radius

        const shard = new Polygon(rock.x, rock.y, radius, sides)
        shard.rotation = Math.random() * Math.PI * 2
        shard.speed = 1
        shard.color = SHARD_COLOR
        shards.push(shard)
      }
    }

    return shards
  }
}

export { CIRCLE, POLYGON, BOUNDS_OFFSET, DEFAULT_COLOR, COLLISION_COLOR, TRANSPARENT_COLOR, Point, Circle, Polygon }
