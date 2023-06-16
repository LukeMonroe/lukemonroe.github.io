const ARROW_DOWN = 'ArrowDown'
const ARROW_LEFT = 'ArrowLeft'
const ARROW_RIGHT = 'ArrowRight'
const ARROW_UP = 'ArrowUp'
const SPACE = ' '

class Keys {
  constructor () {
    this.keys = new Map([[ARROW_DOWN, false], [ARROW_LEFT, false], [ARROW_RIGHT, false], [ARROW_UP, false], [SPACE, false]])
    window.addEventListener('keydown', event => this.keydown(event))
    window.addEventListener('keyup', event => this.keyup(event))
  }

  keydown (event) {
    event.preventDefault()
    if (this.keys.has(event.key)) {
      this.keys.set(event.key, true)
    }
  }

  keyup (event) {
    if (this.keys.has(event.key)) {
      this.keys.set(event.key, false)
    }
  }

  arrowDown () { return this.keys.get(ARROW_DOWN) }
  arrowLeft () { return this.keys.get(ARROW_LEFT) }
  arrowRight () { return this.keys.get(ARROW_RIGHT) }
  arrowUp () { return this.keys.get(ARROW_UP) }
  space () { return this.keys.get(SPACE) }

  reset () {
    for (const key in this.keys.keys()) {
      this.keys[key] = false
    }
  }
}

export { Keys }
