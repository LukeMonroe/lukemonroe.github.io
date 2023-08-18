import { Themes } from '../../themes.js'

class RocksThemes extends Themes {
  changeTheme (theme) {
    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    }
  }
}

export { RocksThemes }
