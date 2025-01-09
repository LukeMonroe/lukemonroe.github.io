import { Themes } from './themes.js'
import { Colors } from './colors.js'

class ColorPickerThemes extends Themes {
  changeTheme (theme) {
    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
    } else if (this.dark(theme)) {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    } else if (this.blue(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#414082').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#FFFFFF').formattedHex)
    } else if (this.purple(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#856496').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#FFFFFF').formattedHex)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    }
  }
}

export { ColorPickerThemes }
