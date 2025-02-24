import { Themes } from './themes.js'
import { Colors } from './colors.js'

class ColorPickerThemes extends Themes {
  changeTheme(theme) {
    if (this.light(theme)) {
      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
    } else if (this.dark(theme)) {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    } else if (this.obsidian(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#242424').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#000000').formattedHex)
    } else if (this.midnight(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#3d2438').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#3c3b78').formattedHex)
    } else if (this.ocean(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#588b8d').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#b2a385').formattedHex)
    } else if (this.forest(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#b2c897').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#2a4625').formattedHex)
    } else if (this.solar(theme)) {
      document.documentElement.style.setProperty('--background-color', Colors.createHex('#5c000f').formattedHex)
      document.documentElement.style.setProperty('--color', Colors.createHex('#ad4b00').formattedHex)
    } else {
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    }
  }
}

export { ColorPickerThemes }