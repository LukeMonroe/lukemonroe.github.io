import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class RecipesThemes extends Themes {
  changeTheme (theme) {
    if (this.loadInitialValues) {
      this.backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.randomColor = window.getComputedStyle(document.documentElement).getPropertyValue('--random-color')
      this.loadInitialValues = false
    }

    let randomColor = Colors.random()
    if (this.light(theme)) {
      while (randomColor.grayscale > 150) { randomColor = Colors.random() }
      document.documentElement.style.setProperty('--background-color', this.backgroundColor)
      document.documentElement.style.setProperty('--color', this.color)
    } else {
      while (randomColor.grayscale <= 150) { randomColor = Colors.random() }
      document.documentElement.style.setProperty('--background-color', this.color)
      document.documentElement.style.setProperty('--color', this.backgroundColor)
    }
    this.randomColor = randomColor.formattedHSL
    document.documentElement.style.setProperty('--random-color', this.randomColor)
  }
}

export { RecipesThemes }
