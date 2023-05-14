import { CIRCLE, POLYGON, Point } from './shape.js'

class Collision {
  static checkShapes (shape01, shape02) {
    if (shape01.type === POLYGON && shape02.type === POLYGON) {
      return Collision.#checkPolygons(shape01, shape02, true)
    } else if (shape01.type === POLYGON && shape02.type === CIRCLE) {
      return Collision.#checkPolygonCircle(shape01, shape02)
    } else if (shape01.type === CIRCLE && shape02.type === POLYGON) {
      return Collision.#checkPolygonCircle(shape02, shape01)
    } else if (shape01.type === CIRCLE && shape02.type === CIRCLE) {
      return Collision.#checkCircles(shape01, shape02)
    } else {
      console.error('Unknown shape detected. Collision can not be checked.')
    }

    return false
  }

  static #checkPolygons (polygon01, polygon02, invert) {
    const rotatedVertices01 = polygon01.getRotatedVertices()
    const rotatedVertices02 = polygon02.getRotatedVertices()
    const vectorOffset = new Point(polygon01.x - polygon02.x, polygon01.y - polygon02.y)

    for (let index = 0; index < rotatedVertices01.length; index++) {
      const axis = Collision.#getPerpendicularAxis(rotatedVertices01, index)
      const polygon01Range = Collision.#getProjectedVertices(axis, rotatedVertices01)
      const polygon02Range = Collision.#getProjectedVertices(axis, rotatedVertices02)
      const scalerOffset = Collision.#getDotProduct(axis, vectorOffset)
      polygon01Range.min += scalerOffset
      polygon01Range.max += scalerOffset

      if ((polygon01Range.min - polygon02Range.max > 0) || (polygon02Range.min - polygon01Range.max > 0)) {
        return false
      }
    }

    return invert ? Collision.#checkPolygons(polygon02, polygon01, false) : true
  }

  // TODO: This doesn't fully work. Only polygon corners detect collisions against a circle.
  static #checkPolygonCircle (polygon, circle) {
    const rotatedVertices = polygon.getRotatedVertices()
    const closestVertex = new Point(0, 0)
    let shortestDistance = null

    for (const vertex of rotatedVertices) {
      const distance = Point.getDistance(polygon.x + vertex.x - circle.x, polygon.y + vertex.y - circle.y)
      if (shortestDistance === null || distance < shortestDistance) {
        shortestDistance = distance
        closestVertex.x = polygon.x + vertex.x - circle.x
        closestVertex.y = polygon.y + vertex.y - circle.y
      }
    }

    return closestVertex.getDistance() <= circle.radius
  }

  static #checkCircles (circle01, circle02) {
    return Point.getDistance(circle01.x - circle02.x, circle01.y - circle02.y) <= circle01.radius + circle02.radius
  }

  static #getDotProduct (point01, point02) {
    return (point01.x * point02.x) + (point01.y * point02.y)
  }

  static #getPerpendicularAxis (vertices, index) {
    const point01 = vertices[index++]
    const point02 = index < vertices.length ? vertices[index] : vertices[0]

    return new Point(-(point02.y - point01.y), point02.x - point01.x)
  }

  static #getProjectedVertices (axis, vertices) {
    let min = Collision.#getDotProduct(axis, vertices[0])
    let max = min

    for (let index = 1; index < vertices.length; index++) {
      const product = Collision.#getDotProduct(axis, vertices[index])
      if (product < min) {
        min = product
      } else if (product > max) {
        max = product
      }
    }

    return { min, max }
  }
}

export { Collision }
