import { Themes } from '../../themes.js'

class RocksThemes extends Themes {
  changeTheme (theme) {
    if (this.loadInitialValues) {
      this.backgroundColor00 = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color00 = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.loadInitialValues = false
    }

    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor00)
      document.documentElement.style.setProperty('--color', this.color00)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color00)
      document.documentElement.style.setProperty('--color', this.backgroundColor00)
    }
  }
}

export { RocksThemes }
