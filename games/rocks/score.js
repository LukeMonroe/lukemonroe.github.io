const FONT_SIZE = 18
const X = 30
const Y = 40
const NEW_LIFE = 200

class Score {
  #color = null
  #score = 0
  #level = 0
  #lives = 3

  constructor (color) {
    this.#color = color
  }

  draw (context, scale) {
    context.save()
    context.font = `${FONT_SIZE * scale}px monospace`
    context.fillStyle = this.#color.formattedHex
    context.fillText(`Score: ${this.#score}`, X * scale, Y * scale)
    context.fillText(`Level: ${this.#level}`, X * scale, (Y + 30) * scale)
    context.fillText(`Lives: ${this.#lives}`, X * scale, (Y + 60) * scale)
    context.restore()
  }

  incrementScore () {
    this.#score++
    if (this.#score > 0 && this.#score % NEW_LIFE === 0) {
      this.incrementLives()
    }
  }

  level () {
    return this.#level
  }

  incrementLevel () {
    return ++this.#level
  }

  incrementLives () {
    return ++this.#lives
  }

  decrementLives () {
    return --this.#lives
  }

  reset () {
    this.#score = 0
    this.#level = 0
    this.#lives = 3
  }
}

export { Score }
