import { ColorGeneratorThemes } from './color-generator-themes.js'
import { Colors } from '../../colors.js'

const themes = new ColorGeneratorThemes()
themes.setTheme()

const row = document.getElementById('row')
const colorsRGB = new Set()
const colors = new Set()
while (colorsRGB.size < 50) {
  colorsRGB.add(Colors.formatRGB(Colors.randomColor()))
  colors.add(Colors.randomColor())
}

// colors = Array.from(colors)
// colors.sort(function (color01, color02) { return color01.grayscale > color02.grayscale })

colors.forEach(color => {
  const hsl = document.createElement('h3')
  hsl.innerText = Colors.formatHSL(color)

  const rgb = document.createElement('h3')
  rgb.innerText = Colors.formatRGB(color)

  const grayscale = document.createElement('h3')
  grayscale.innerText = `Grayscale: ${color.grayscale}`

  let textColor = Colors.formatHSL(Colors.white())
  if (color.grayscale > 150) {
    textColor = Colors.formatHSL(Colors.black())
  }
  hsl.style.color = textColor
  rgb.style.color = textColor
  grayscale.style.color = textColor

  const column = document.createElement('div')
  column.className = 'column'
  column.style.backgroundColor = Colors.formatHSL(color)
  column.appendChild(hsl)
  column.appendChild(rgb)
  column.appendChild(grayscale)

  row.appendChild(column)
})
