const FONT_SIZE = 20
const X = 30
const SCORE_Y = 40
const LEVEL_Y = 70
const LIVES_Y = 100
const LIFE_INCREMENT = 200

class Score {
  #score = 0
  #level = 0
  #lives = 3
  #scale = 1
  #themes = null
  #theme = null
  #color = null

  constructor (themes) {
    this.#themes = themes
    this.#theme = themes.getTheme()
    this.#color = this.#themes.color
  }

  #scaled (number) {
    return number * this.#scale
  }

  update (scale) {
    this.#scale = scale
  }

  draw (context) {
    context.save()
    context.font = `${this.#scaled(FONT_SIZE)}px monospace`
    context.fillStyle = this.#color

    const scaledX = this.#scaled(X)
    context.fillText(`Score: ${this.#score}`, scaledX, this.#scaled(SCORE_Y))
    context.fillText(`Level: ${this.#level}`, scaledX, this.#scaled(LEVEL_Y))
    context.fillText(`Lives: ${this.#lives}`, scaledX, this.#scaled(LIVES_Y))

    context.restore()
  }

  incrementScore () {
    this.#score++
    if (this.#score > 0 && this.#score % LIFE_INCREMENT === 0) {
      this.incrementLives()
    }
  }

  level () {
    return this.#level
  }

  incrementLevel () {
    this.#level++
  }

  hasLives () {
    return this.#lives > 0
  }

  incrementLives () {
    this.#lives++
  }

  decrementLives () {
    this.#lives--
  }

  reset () {
    this.#score = 0
    this.#level = 0
    this.#lives = 3
    this.#scale = 1
  }
}

export { Score }
