import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class PrintsThemes extends Themes {
  changeTheme (theme) {
    let color01 = Colors.randomColor()
    if (this.light(theme)) {
      while (color01.grayscale <= 150) { color01 = Colors.randomColor() }
    } else {
      while (color01.grayscale > 150) { color01 = Colors.randomColor() }
    }

    let color02 = Colors.randomColor()
    if (this.light(theme)) {
      while (color02.grayscale <= 150) { color02 = Colors.randomColor() }
    } else {
      while (color02.grayscale > 150) { color02 = Colors.randomColor() }
    }

    document.documentElement.style.setProperty('--gs', Colors.formatHSL(color01))
    document.documentElement.style.setProperty('--ge', Colors.formatHSL(color02))
    document.documentElement.style.setProperty('--text-color', this.textColor(theme))
  }
}

export { PrintsThemes }
