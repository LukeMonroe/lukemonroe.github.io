import { Themes } from '../../themes.js'

class RocksThemes extends Themes {
  changeTheme (theme) {
    document.documentElement.style.setProperty('--background-color', this.backgroundColor(theme))
    document.documentElement.style.setProperty('--text-color', this.textColor(theme))
  }
}

export { RocksThemes }
