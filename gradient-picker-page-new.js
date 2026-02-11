import { ColorPickerPage } from './color-picker-page.js'
import { Colors } from './colors.js'
import { createH1 } from './text.js'

class GradientPickerPageNew extends ColorPickerPage {

  createDivColorRowNew() {
    const row = document.createElement('div')
    row.className = 'color-row-new'

    return row
  }

  buildColorRow(row, colors) {
    row.replaceChildren()
    colors.forEach(color => {
      const divColor01 = this.createDivColor(color, false)
      divColor01.style.display = 'none'

      const divColor02 = this.createDivColor(Colors.hue(color, 90), false)
      divColor02.style.display = 'none'

      const divGradient = this.createDivColor(color, false)
      const type = 'linear'
      const value = '180deg'
      const position = '0%'
      divGradient.style.background = `${type}-gradient(${value}, ${color.formattedHex} ${position}, ${Colors.hue(color, 90).formattedHex})`

      const divColorRow = this.createDivColorRowNew()
      divColorRow.style.flex = '1 1 0'
      divColorRow.appendChild(divColor01)
      divColorRow.appendChild(divColor02)
      divColorRow.appendChild(divGradient)
      divColorRow.addEventListener('mouseenter', () => {
        divColorRow.style.flex = 'auto'
        divColor01.style.display = 'flex'
        divColor02.style.display = 'flex'
        divGradient.style.display = 'none'
      })
      divColorRow.addEventListener('mouseleave', () => {
        divColorRow.style.flex = '1 1 0'
        divColor01.style.display = 'none'
        divColor02.style.display = 'none'
        divGradient.style.display = 'flex'
      })
      divColorRow.addEventListener('click', () => {
        divColorRow.style.flex = 'auto'
        divColor01.style.display = 'flex'
        divColor02.style.display = 'flex'
        divGradient.style.display = 'none'
      })
      row.appendChild(divColorRow)
    })

    return row
  }

  createPage() {
    super.createPage(arguments)

    localStorage.setItem('tool', 'gradientPickerNew')

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Gradient Picker New'))
  }

  getHistoryColors() {
    const colors = []
    let index = 0
    while (localStorage.getItem(`historyColorNew${index}`) !== null) {
      colors.push(Colors.createHex(localStorage.getItem(`historyColorNew${index++}`)))
    }

    return colors
  }

  setHistoryColors(colors) {
    let pos = 0
    for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
      localStorage.setItem(`historyColorNew${pos++}`, colors[index].formattedHex)
    }
    for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
      localStorage.removeItem(`historyColorNew${index}`)
    }
  }
}

export { GradientPickerPageNew }