import { ColorGeneratorThemes } from './color-generator-themes.js'
import { Colors } from '../../colors.js'

const themes = new ColorGeneratorThemes()
themes.setTheme()

const row = document.getElementById('row')
for (let index = 0; index < 50; index++) {
  const randomColor = Colors.randomColor()

  const hsl = document.createElement('h3')
  hsl.innerText = Colors.formatHSL(randomColor)

  const rgb = document.createElement('h3')
  rgb.innerText = Colors.formatRGB(randomColor)

  const grayscale = document.createElement('h3')
  grayscale.innerText = `Grayscale: ${randomColor.grayscale}`

  if (randomColor.grayscale > 150) {
    hsl.style.color = 'rgb(0, 0, 0)'
    rgb.style.color = 'rgb(0, 0, 0)'
    grayscale.style.color = 'rgb(0, 0, 0)'
  } else {
    hsl.style.color = 'rgb(255, 255, 255)'
    rgb.style.color = 'rgb(255, 255, 255)'
    grayscale.style.color = 'rgb(255, 255, 255)'
  }

  const column = document.createElement('div')
  column.className = 'column'
  column.style.backgroundColor = Colors.formatHSL(randomColor)
  column.appendChild(hsl)
  column.appendChild(rgb)
  column.appendChild(grayscale)

  row.appendChild(column)
}
