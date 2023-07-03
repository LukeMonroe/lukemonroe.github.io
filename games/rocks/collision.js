import { CIRCLE, POLYGON, Point } from './shape.js'

class Collision {
  static checkShapes (shape01, shape02) {
    if (shape01.type === POLYGON && shape02.type === POLYGON) {
      return Collision.#checkPolygons(shape01, shape02, true)
    } else if (shape01.type === POLYGON && shape02.type === CIRCLE) {
      return Collision.#checkPolygonCircle(shape01, shape02)
    } else if (shape01.type === CIRCLE && shape02.type === POLYGON) {
      return Collision.#checkPolygonCircle(shape02, shape01)
    } else {
      return Collision.#checkCircles(shape01, shape02)
    }
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

  // TODO: Does not detect a collision until the circle is about halfway into the polygon.
  static #checkPolygonCircle (polygon, circle) {
    const rotatedVertices = polygon.getRotatedVertices()
    const vectorOffset = new Point(polygon.x - circle.x, polygon.y - circle.y)
    let shortestDistance = null

    for (const vertex of rotatedVertices) {
      const distance = Point.getDistance(vectorOffset.x + vertex.x, vectorOffset.y + vertex.y)
      if (shortestDistance === null || distance < shortestDistance) {
        shortestDistance = distance
      }
    }

    if (shortestDistance <= circle.radius) {
      return true
    }

    for (let index = 0; index < rotatedVertices.length; index++) {
      const axis = Collision.#getPerpendicularAxis(rotatedVertices, index)
      const polygonRange = Collision.#getProjectedVertices(axis, rotatedVertices)
      const scalerOffset = Collision.#getDotProduct(axis, vectorOffset)
      polygonRange.min += scalerOffset
      polygonRange.max += scalerOffset

      if ((polygonRange.min - circle.radius > 0) || (-circle.radius - polygonRange.max > 0)) {
        return false
      }
    }

    return true
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
