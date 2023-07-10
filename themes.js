import { Colors } from './colors.js'

const CLICK = 'click'
const THEME = 'theme'
const LIGHT = 'light'
const DARK = 'dark'
const BACKGROUND_COLOR = 'backgroundColor'
const TEXT_COLOR = 'textColor'
const NEXT = 'next'
const BLACK = 'black'
const GHOST_WHITE = 'ghostwhite'

class Themes {
  themes = new Map([
    [LIGHT, new Map([[BACKGROUND_COLOR, GHOST_WHITE], [TEXT_COLOR, BLACK], [NEXT, DARK]])],
    [DARK, new Map([[BACKGROUND_COLOR, BLACK], [TEXT_COLOR, GHOST_WHITE], [NEXT, LIGHT]])]
  ])

  constructor () {
    if (document.URL.match(/lukemonroe.github.io\/index.html/i)) {
      this.themeButton = document.getElementById(THEME)
      this.themeButton.addEventListener(CLICK, () => this.nextTheme())
    }
  }

  getTheme () {
    const theme = localStorage.getItem(THEME)

    return this.themes.has(theme) ? theme : LIGHT
  }

  setTheme () {
    this.changeTheme(this.getTheme())
  }

  changeTheme (theme) {
    localStorage.setItem(THEME, theme)

    if (document.URL.match(/lukemonroe.github.io\/index.html/i)) {
      this.themeButton.innerText = theme
      document.documentElement.style.setProperty('--background-color', this.themes.get(theme).get(BACKGROUND_COLOR))
    } else if (document.URL.match(/lukemonroe.github.io\/recipes\/.*\/index.html/i)) {
      let hsl = Colors.randomHSL()
      if (theme === LIGHT) {
        while (hsl.grayscale > 150) { hsl = Colors.randomHSL() }
      } else {
        while (hsl.grayscale <= 150) { hsl = Colors.randomHSL() }
      }

      document.documentElement.style.setProperty('--random-color', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)
      document.documentElement.style.setProperty('--background-color', this.themes.get(theme).get(BACKGROUND_COLOR))
      document.documentElement.style.setProperty('--text-color', this.themes.get(theme).get(TEXT_COLOR))
    }
  }

  nextTheme () {
    this.changeTheme(this.themes.get(this.getTheme()).get(NEXT))
  }
}

export { Themes }
