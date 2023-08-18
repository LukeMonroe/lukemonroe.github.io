import { Colors } from './colors.js'

const CLICK = 'click'
const THEME = 'theme'
const LIGHT = 'light'
const DARK = 'dark'
const NEXT = 'next'

class Themes {
  #linkColor001 = Colors.createHex('#D9BFD9')
  #linkColor002 = Colors.createHex('#C2BFD9')

  loadInitialValues = true
  themes = new Map([
    [LIGHT, new Map([[NEXT, DARK]])],
    [DARK, new Map([[NEXT, LIGHT]])]
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

      this.backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.linkColor01 = window.getComputedStyle(document.documentElement).getPropertyValue('--link-color-01')
      this.linkColor02 = window.getComputedStyle(document.documentElement).getPropertyValue('--link-color-02')
      this.loadInitialValues = false
    }

    this.themeButton.innerText = theme

    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor)
      document.documentElement.style.setProperty('--color', this.color)
      document.documentElement.style.setProperty('--link-color-01', this.#linkColor001.formattedHex)
      document.documentElement.style.setProperty('--link-color-02', this.#linkColor002.formattedHex)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color)
      document.documentElement.style.setProperty('--color', this.backgroundColor)
      document.documentElement.style.setProperty('--link-color-01', Colors.lightness(this.#linkColor001, -50).formattedHex)
      document.documentElement.style.setProperty('--link-color-02', Colors.lightness(this.#linkColor002, -50).formattedHex)
    }
  }

  light (theme) {
    return theme === LIGHT
  }

  dark (theme) {
    return theme === DARK
  }
}

export { Themes }
