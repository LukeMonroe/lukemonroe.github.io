import { Colors } from './colors.js'

const THEME = 'theme'
const LIGHT = 'light'
const DARK = 'dark'
const OBSIDIAN = 'obsidian'
const MIDNIGHT = 'midnight'
const OCEAN = 'ocean'
const FOREST = 'forest'
const SOLAR = 'solar'
const NEXT = 'next'

class Themes {
  themes = new Map([
    [LIGHT, new Map([[NEXT, DARK]])],
    [DARK, new Map([[NEXT, OBSIDIAN]])],
    [OBSIDIAN, new Map([[NEXT, MIDNIGHT]])],
    [MIDNIGHT, new Map([[NEXT, OCEAN]])],
    [OCEAN, new Map([[NEXT, FOREST]])],
    [FOREST, new Map([[NEXT, SOLAR]])],
    [SOLAR, new Map([[NEXT, LIGHT]])],
  ])

  backgroundColor = Colors.createHex('#f8f8ff')
  color = Colors.createHex('#000000')

  getTheme() {
    const theme = localStorage.getItem(THEME)

    return this.themes.has(theme) ? theme : LIGHT
  }

  setTheme() {
    const theme = this.getTheme()
    localStorage.setItem(THEME, theme)
    this.changeTheme(theme)
  }

  nextTheme() {
    const theme = this.themes.get(this.getTheme()).get(NEXT)
    localStorage.setItem(THEME, theme)
    this.changeTheme(theme)

    return theme
  }

  changeTheme(theme) {
    if (theme === LIGHT) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
    } else if (theme === DARK) {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    } else if (theme === OBSIDIAN) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#242424').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#000000').formattedHex)
    } else if (theme === MIDNIGHT) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#3d2438').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#3c3b78').formattedHex)
    } else if (theme === OCEAN) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#588b8d').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#b2a385').formattedHex)
    } else if (theme === FOREST) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#b2c897').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#2a4625').formattedHex)
    } else if (theme === SOLAR) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#5c000f').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#ad4b00').formattedHex)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    }
  }

  formatTheme(theme) {
    return `${theme.substr(0, 1).toUpperCase()}${theme.substr(1)}`
  }

  createButtonTheme(inverted = false) {
    const buttonTheme = document.createElement('button')
    buttonTheme.className = inverted === false ? 'theme' : 'theme-inverted'
    buttonTheme.innerText = this.formatTheme(this.getTheme())
    buttonTheme.addEventListener('click', () => {
      buttonTheme.innerText = this.formatTheme(this.nextTheme())
    })

    return buttonTheme
  }

  createSelectTheme(inverted = false) {
    const selectTheme = document.createElement('select')

    this.themes.keys().forEach(theme => {
      const optionTheme = document.createElement('option')
      optionTheme.textContent = this.formatTheme(theme)
      selectTheme.appendChild(optionTheme)
    })

    selectTheme.addEventListener('change', () => {
      this.changeTheme(selectTheme.value.toLowerCase())
    })

    return selectTheme
  }
}

export { Themes }