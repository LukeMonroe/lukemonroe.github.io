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
  loadInitialValues = true
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
    if (this.loadInitialValues) {
      this.themeButton = document.getElementById(THEME)
      this.themeButton.addEventListener(CLICK, () => this.nextTheme())

      this.backgroundColor00 = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color00 = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.linkColor01 = window.getComputedStyle(document.documentElement).getPropertyValue('--link-color-01')
      this.linkColor02 = window.getComputedStyle(document.documentElement).getPropertyValue('--link-color-02')
      this.loadInitialValues = false
    }

    this.themeButton.innerText = theme

    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor00)
      document.documentElement.style.setProperty('--color', this.color00)
      document.documentElement.style.setProperty('--link-color-01', this.linkColor01)
      document.documentElement.style.setProperty('--link-color-02', this.linkColor02)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color00)
      document.documentElement.style.setProperty('--color', this.backgroundColor00)
      document.documentElement.style.setProperty('--link-color-01', Colors.darkenHSL(this.linkColor01, 50))
      document.documentElement.style.setProperty('--link-color-02', Colors.darkenHSL(this.linkColor02, 50))
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
