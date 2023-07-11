import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class RecipesThemes extends Themes {
  changeTheme (theme) {
    if (this.loadInitialValues) {
      this.backgroundColor00 = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color00 = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.randomColor00 = window.getComputedStyle(document.documentElement).getPropertyValue('--random-color')
      this.loadInitialValues = false
    }

    let randomColor = Colors.randomColor()
    if (this.light(theme)) {
      while (randomColor.grayscale > 150) { randomColor = Colors.randomColor() }
      document.documentElement.style.setProperty('--background-color', this.backgroundColor00)
      document.documentElement.style.setProperty('--color', this.color00)
    } else {
      while (randomColor.grayscale <= 150) { randomColor = Colors.randomColor() }
      document.documentElement.style.setProperty('--background-color', this.color00)
      document.documentElement.style.setProperty('--color', this.backgroundColor00)
    }
    this.randomColor00 = Colors.formatHSL(randomColor)
    document.documentElement.style.setProperty('--random-color', this.randomColor00)
  }
}

export { RecipesThemes }
