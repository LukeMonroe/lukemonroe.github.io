import { Colors } from './colors.js'
import { createH1 } from './text.js'

class PalettePickerPage {

  constructor(buttonNavigation, colorPickerPage) {
    this.buttonNavigation = buttonNavigation
    this.colorPickerPage = colorPickerPage

    this.palettePickerPageData = localStorage.getItem('palettePickerPageData') !== null ? JSON.parse(localStorage.getItem('palettePickerPageData')) : { colors: [Colors.random(), Colors.random(), Colors.random(), Colors.random(), Colors.random(), Colors.random(), Colors.random(), Colors.random()] }
    localStorage.setItem('palettePickerPageData', JSON.stringify(this.palettePickerPageData))
  }

  createPage() {
    localStorage.setItem('tool', 'palettePicker')

    const divColorGrid = document.createElement('div')
    divColorGrid.className = 'color-grid'
    this.palettePickerPageData.colors.forEach((color, index) => {
      const callable = color => {
        this.palettePickerPageData.colors[index] = color
        localStorage.setItem('palettePickerPageData', JSON.stringify(this.palettePickerPageData))
        this.createPage()
      }
      const divColor = this.colorPickerPage.createDivColor(color, false, true, false, false, callable)
      divColor.style.height = '200px'
      divColor.style.maxWidth = '300px'
      divColorGrid.appendChild(divColor)
    })

    const exploreColorsColumn = document.createElement('div')
    exploreColorsColumn.style.maxWidth = 'none'
    exploreColorsColumn.className = 'inner-column'
    exploreColorsColumn.appendChild(divColorGrid)

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Palette Picker'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(exploreColorsColumn)

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 10)
  }
}

export { PalettePickerPage }