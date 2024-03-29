import { Colors } from './colors.js'

const THEME = 'theme'
const LIGHT = 'light'
const DARK = 'dark'
const NEXT = 'next'

class Themes {
  themes = new Map([
    [LIGHT, new Map([[NEXT, DARK]])],
    [DARK, new Map([[NEXT, LIGHT]])]
  ])

  backgroundColor = Colors.createHex('#F8F8FF')
  color = Colors.createHex('#000000')
  #linkColor = Colors.createHex('#D9BFD9')
  #visitedColor = Colors.lightness(this.#linkColor, -20)

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

    return theme
  }

  changeTheme (theme) {
    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
      document.documentElement.style.setProperty('--link-color', this.#linkColor.formattedHex)
      document.documentElement.style.setProperty('--visited-color', this.#visitedColor.formattedHex)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--link-color', Colors.lightness(this.#linkColor, -40).formattedHex)
      document.documentElement.style.setProperty('--visited-color', Colors.lightness(this.#visitedColor, -40).formattedHex)
    }
  }

  light (theme) {
    return theme === LIGHT
  }

  dark (theme) {
    return theme === DARK
  }

  formatTheme (theme) {
    return `${theme.substr(0, 1).toUpperCase()}${theme.substr(1)}`
  }

  createButtonTheme () {
    const buttonTheme = document.createElement('button')
    buttonTheme.className = 'theme'
    buttonTheme.innerText = this.formatTheme(this.getTheme())
    buttonTheme.addEventListener('click', () => {
      buttonTheme.innerText = this.formatTheme(this.nextTheme())
    })

    return buttonTheme
  }
}

export { Themes }
