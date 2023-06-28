const KEYDOWN = 'keydown'
const KEYUP = 'keyup'
const ARROW_DOWN = 'ArrowDown'
const ARROW_LEFT = 'ArrowLeft'
const ARROW_RIGHT = 'ArrowRight'
const ARROW_UP = 'ArrowUp'
const SPACE = ' '
const LOWER_A = 'a'
const LOWER_P = 'p'
const LOWER_Q = 'q'
const LOWER_R = 'r'

class Keys {
  #keys = new Map([[ARROW_DOWN, false], [ARROW_LEFT, false], [ARROW_RIGHT, false], [ARROW_UP, false], [SPACE, false],
    [LOWER_A, false], [LOWER_P, false], [LOWER_Q, false], [LOWER_R, false]])

  #spacePressed = false

  constructor () {
    window.addEventListener(KEYDOWN, event => this.#keydown(event))
    window.addEventListener(KEYUP, event => this.#keyup(event))
  }

  #keydown (event) {
    event.preventDefault()
    if (this.#keys.has(event.key)) {
      this.#keys.set(event.key, true)
    }
  }

  #keyup (event) {
    if (this.#keys.has(event.key)) {
      this.#keys.set(event.key, false)
    }
  }

  arrowDown () { return this.#keys.get(ARROW_DOWN) }

  arrowLeft () { return this.#keys.get(ARROW_LEFT) }

  arrowRight () { return this.#keys.get(ARROW_RIGHT) }

  arrowUp () { return this.#keys.get(ARROW_UP) }

  space () {
    if (this.#keys.get(SPACE) && !this.#spacePressed) {
      this.#spacePressed = true
      return true
    }
    if (!this.#keys.get(SPACE) && this.#spacePressed) {
      this.#spacePressed = false
    }

    return false
  }

  lowerA () { return this.#keys.get(LOWER_A) }

  lowerP () { return this.#keys.get(LOWER_P) }

  lowerQ () { return this.#keys.get(LOWER_Q) }

  lowerR () { return this.#keys.get(LOWER_R) }

  reset () {
    this.#spacePressed = false
    for (const key in this.#keys.keys()) {
      this.#keys[key] = false
    }
  }
}

export { Keys }
