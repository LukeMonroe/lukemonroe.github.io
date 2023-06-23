class Score {
  #score = 0
  #level = 0
  #lives = 3

  draw (context) {
    context.save()
    context.font = '20px monospace'
    context.fillStyle = 'white'
    context.fillText('Score: ' + this.#score, 30, 40)
    context.fillText('Level: ' + this.#level, 30, 70)
    context.fillText('Lives: ' + this.#lives, 30, 100)
    context.restore()
  }

  incrementScore () {
    this.#score++
    if (this.#score > 0 && this.#score % 200 === 0) {
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
  }
}

export { Score }
