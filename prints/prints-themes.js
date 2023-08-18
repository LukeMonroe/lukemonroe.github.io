import { Themes } from '../themes.js'
import { Colors } from '../colors.js'

class PrintsThemes extends Themes {
  changeTheme (theme) {
    let randomColor01 = Colors.random()
    let randomColor02 = Colors.random()
    if (this.light(theme)) {
      while (randomColor01.grayscale > 150) { randomColor01 = Colors.random() }
      while (randomColor02.grayscale > 150) { randomColor02 = Colors.random() }

      document.documentElement.style.setProperty('--background-color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--color', this.backgroundColor.formattedHex)
      document.documentElement.style.setProperty('--gradient-start-color', randomColor01.formattedHex)
      document.documentElement.style.setProperty('--gradient-end-color', randomColor02.formattedHex)
    } else {
      while (randomColor01.grayscale <= 150) { randomColor01 = Colors.random() }
      while (randomColor02.grayscale <= 150) { randomColor02 = Colors.random() }

      document.documentElement.style.setProperty('--background-color', this.color.formattedHex)
      document.documentElement.style.setProperty('--color', this.color.formattedHex)
      document.documentElement.style.setProperty('--gradient-start-color', randomColor01.formattedHex)
      document.documentElement.style.setProperty('--gradient-end-color', randomColor02.formattedHex)
    }
  }
}

export { PrintsThemes }
