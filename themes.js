import { Colors } from './colors.js'

const THEME = 'theme'
const BACKGROUND_COLOR = 'backgroundColor'
const COLOR = 'color'

const LIGHT = 'light'
const DARK = 'dark'
const OBSIDIAN = 'obsidian'
const MIDNIGHT = 'midnight'
const OCEAN = 'ocean'
const FOREST = 'forest'
const SOLAR = 'solar'

class Themes {
  themes = new Map([
    [LIGHT, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#f8f8ff')],
      [COLOR, Colors.createHex('#000000')]
    ])],
    [DARK, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#000000')],
      [COLOR, Colors.createHex('#f8f8ff')]
    ])],
    [OBSIDIAN, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#242424')],
      [COLOR, Colors.createHex('#000000')]
    ])],
    [MIDNIGHT, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#3d2438')],
      [COLOR, Colors.createHex('#3c3b78')]
    ])],
    [OCEAN, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#588b8d')],
      [COLOR, Colors.createHex('#b2a385')]
    ])],
    [FOREST, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#b2c897')],
      [COLOR, Colors.createHex('#2a4625')]
    ])],
    [SOLAR, new Map([
      [BACKGROUND_COLOR, Colors.createHex('#5c000f')],
      [COLOR, Colors.createHex('#ad4b00')]
    ])]
  ])

  getTheme() {
    const theme = localStorage.getItem(THEME)

    return this.themes.has(theme) ? theme : LIGHT
  }

  setTheme() {
    const theme = this.getTheme()
    localStorage.setItem(THEME, theme)
    this.changeTheme(theme)
  }

  changeTheme(theme) {
    if (!this.themes.has(theme)) {
      theme = LIGHT
    }
    localStorage.setItem(THEME, theme)
    document.documentElement.style.setProperty('--background-color', this.themes.get(theme).get(BACKGROUND_COLOR).formattedHex)
    document.documentElement.style.setProperty('--color', this.themes.get(theme).get(COLOR).formattedHex)
  }

  formatTheme(theme) {
    return `${theme.substr(0, 1).toUpperCase()}${theme.substr(1)}`
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