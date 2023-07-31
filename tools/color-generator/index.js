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

colors.forEach(color => {
  const hsl = document.createElement('div')
  hsl.innerText = Colors.formatHSL(color)

  const rgb = document.createElement('div')
  rgb.innerText = Colors.formatRGB(color)

  const grayscale = document.createElement('div')
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
  column.onclick = function () {
    localStorage.setItem('h', color.hsl.h)
    localStorage.setItem('s', color.hsl.s)
    localStorage.setItem('l', color.hsl.l)
    window.location.href = './color/index.html'
  }

  row.appendChild(column)
})
