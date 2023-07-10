import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class RecipesThemes extends Themes {
  changeTheme (theme) {
    let color = Colors.randomColor()
    if (this.light(theme)) {
      while (color.grayscale > 150) { color = Colors.randomColor() }
    } else {
      while (color.grayscale <= 150) { color = Colors.randomColor() }
    }

    document.documentElement.style.setProperty('--random-color', Colors.formatHSL(color))
    document.documentElement.style.setProperty('--background-color', this.backgroundColor(theme))
    document.documentElement.style.setProperty('--text-color', this.textColor(theme))
  }
}

export { RecipesThemes }
