import { Themes } from '../../themes.js'

class ColorGeneratorThemes extends Themes {
  changeTheme (theme) {
    if (this.loadInitialValues) {
      this.backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.loadInitialValues = false
    }

    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor)
      document.documentElement.style.setProperty('--color', this.color)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color)
      document.documentElement.style.setProperty('--color', this.backgroundColor)
    }
  }
}

export { ColorGeneratorThemes }
