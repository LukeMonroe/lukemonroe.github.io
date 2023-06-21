const TEXT_COLOR = 'white'

class Score {
  constructor () {
    this.score = 0
    this.level = 0
    this.lives = 3
  }

  draw (context) {
    context.save()
    context.font = '20px monospace'
    context.fillStyle = TEXT_COLOR
    context.fillText('Score: ' + this.score, 30, 40)
    context.fillText('Level: ' + this.level, 30, 70)
    context.fillText('Lives: ' + this.lives, 30, 100)
    context.restore()
  }

  incrementScore () {
    this.score++
    if (this.score > 0 && this.score % 200 === 0) {
      this.incrementLives()
    }
  }

  incrementLevel () {
    this.level++
  }

  incrementLives () {
    this.lives++
  }

  decrementLives () {
    this.lives--
  }

  reset () {
    this.score = 0
    this.level = 0
    this.lives = 3
  }
}

export { Score }
