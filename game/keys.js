const KEYDOWN = 'keydown'
const KEYUP = 'keyup'
const ARROW_DOWN = 'ArrowDown'
const ARROW_LEFT = 'ArrowLeft'
const ARROW_RIGHT = 'ArrowRight'
const ARROW_UP = 'ArrowUp'
const SPACE = ' '

class Keys {
  #keys = new Map([[ARROW_DOWN, false], [ARROW_LEFT, false], [ARROW_RIGHT, false], [ARROW_UP, false], [SPACE, false]])
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

  reset () {
    this.#spacePressed = false
    for (const key in this.#keys.keys()) {
      this.#keys[key] = false
    }
  }
}

export { Keys }
