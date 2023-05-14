const TEXT_COLOR = 'white'

class Score {
  constructor () {
    this.score = 0
    this.lives = 3
  }

  draw (canvas, context) {
    context.save()
    context.font = '40px monospace'
    context.fillStyle = TEXT_COLOR
    context.fillText(this.score, 50, 75)
    context.fillText(this.lives, 50, 115)
    context.restore()
  }

  incrementScore () {
    this.score++
  }

  incrementLives () {
    this.lives++
  }

  decrementLives () {
    this.lives--
  }

  reset () {
    this.score = 0
    this.lives = 3
  }
}

export { Score }
