import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class RecipesThemes extends Themes {
  changeTheme (theme) {
    let randomColor = Colors.random()
    if (this.light(theme)) {
      while (randomColor.grayscale > 150) { randomColor = Colors.random() }
      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
    } else {
      while (randomColor.grayscale <= 150) { randomColor = Colors.random() }
      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
    }
    document.documentElement.style.setProperty('--random-color', randomColor.formattedHex)
  }
}

export { RecipesThemes }
