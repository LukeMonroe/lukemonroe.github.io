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
const COLOR_A = 'hsl(300, 25%, 80%)'
const COLOR_B = 'hsl(260, 25%, 75%)'

class Themes {
  themeButton = null
  themes = new Map([
    [LIGHT, new Map([[BACKGROUND_COLOR, GHOST_WHITE], [TEXT_COLOR, BLACK], [NEXT, DARK]])],
    [DARK, new Map([[BACKGROUND_COLOR, BLACK], [TEXT_COLOR, GHOST_WHITE], [NEXT, LIGHT]])]
  ])

  getTheme () {
    const theme = localStorage.getItem(THEME)
    return this.themes.has(theme) ? theme : LIGHT
  }

  setTheme () {
    const theme = this.getTheme()
    localStorage.setItem(THEME, theme)
    this.changeTheme(theme)
  }

  nextTheme () {
    const theme = this.themes.get(this.getTheme()).get(NEXT)
    localStorage.setItem(THEME, theme)
    this.changeTheme(theme)
  }

  changeTheme (theme) {
    if (this.themeButton !== null) {
      this.themeButton.innerText = theme
    }
    const a = this.light(theme) ? COLOR_A : Colors.darkenHSL(COLOR_A, 10)
    const b = this.light(theme) ? COLOR_B : Colors.darkenHSL(COLOR_B, 10)
    document.documentElement.style.setProperty('--background-color', this.backgroundColor(theme))
    document.documentElement.style.setProperty('--text-color', this.textColor(theme))
    document.documentElement.style.setProperty('--link-color', a)
    document.documentElement.style.setProperty('--visited-color', b)
  }

  setThemeButton () {
    this.themeButton = document.getElementById(THEME)
    if (this.themeButton !== null) {
      this.themeButton.addEventListener(CLICK, () => this.nextTheme())
    }
  }

  light (theme) {
    return theme === LIGHT
  }

  dark (theme) {
    return theme === DARK
  }

  backgroundColor (theme) {
    return this.themes.get(theme).get(BACKGROUND_COLOR)
  }

  textColor (theme) {
    return this.themes.get(theme).get(TEXT_COLOR)
  }
}

export { Themes }
