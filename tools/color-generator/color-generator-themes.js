import { Themes } from '../../themes.js'
import { Colors } from '../../colors.js'

class ColorGeneratorThemes extends Themes {
  changeTheme (theme) {
    if (this.loadInitialValues) {
      this.backgroundColor = window.getComputedStyle(document.documentElement).getPropertyValue('--background-color')
      this.color = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
      this.gradientColor01 = window.getComputedStyle(document.documentElement).getPropertyValue('--gradient-color-01')
      this.gradientColor02 = window.getComputedStyle(document.documentElement).getPropertyValue('--gradient-color-02')
      this.loadInitialValues = false
    }

    let randomColor01 = Colors.randomColor()
    let randomColor02 = Colors.randomColor()
    if (this.light(theme)) {
      while (randomColor01.grayscale > 150) { randomColor01 = Colors.randomColor() }
      while (randomColor02.grayscale > 150) { randomColor02 = Colors.randomColor() }

      this.gradientColor01 = Colors.formatHSL(randomColor01)
      this.gradientColor02 = Colors.formatHSL(randomColor02)

      document.documentElement.style.setProperty('--background-color', this.backgroundColor)
      document.documentElement.style.setProperty('--color', this.color)
      document.documentElement.style.setProperty('--gradient-color-01', this.gradientColor01)
      document.documentElement.style.setProperty('--gradient-color-02', this.gradientColor02)
    } else {
      while (randomColor01.grayscale <= 150) { randomColor01 = Colors.randomColor() }
      while (randomColor02.grayscale <= 150) { randomColor02 = Colors.randomColor() }

      this.gradientColor01 = Colors.formatHSL(randomColor01)
      this.gradientColor02 = Colors.formatHSL(randomColor02)

      document.documentElement.style.setProperty('--background-color', this.color)
      document.documentElement.style.setProperty('--color', this.backgroundColor)
      document.documentElement.style.setProperty('--gradient-color-01', this.gradientColor01)
      document.documentElement.style.setProperty('--gradient-color-02', this.gradientColor02)
    }
  }
}

export { ColorGeneratorThemes }
