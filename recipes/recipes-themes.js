import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class RecipesThemes extends Themes {
  changeTheme (theme) {
    let hsl = Colors.randomHSL()
    if (this.light(theme)) {
      while (hsl.grayscale > 150) { hsl = Colors.randomHSL() }
    } else {
      while (hsl.grayscale <= 150) { hsl = Colors.randomHSL() }
    }

    document.documentElement.style.setProperty('--random-color', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)
    document.documentElement.style.setProperty('--background-color', this.backgroundColor(theme))
    document.documentElement.style.setProperty('--text-color', this.textColor(theme))
  }
}

export { RecipesThemes }
