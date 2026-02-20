import { Colors } from './colors.js'
import { createH1 } from './text.js'

class ExploreColorsPage {

  constructor(buttonNavigation, colorPickerPage) {
    this.buttonNavigation = buttonNavigation
    this.colorPickerPage = colorPickerPage
  }

  createPage() {
    localStorage.setItem('tool', 'exploreColors')

    const divColorGrid = document.createElement('div')
    divColorGrid.className = 'color-grid'
    for (let index = 0; index < 48; index++) {
      const divColor = this.colorPickerPage.createDivColor(Colors.random(), false, true)
      divColor.style.height = '400px'
      divColor.style.maxWidth = '400px'
      divColorGrid.appendChild(divColor)
    }

    const exploreColorsColumn = document.createElement('div')
    exploreColorsColumn.style.maxWidth = 'none'
    exploreColorsColumn.className = 'inner-column'
    exploreColorsColumn.appendChild(divColorGrid)

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Explore Colors'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(exploreColorsColumn)

    var timeout = false
    window.addEventListener('scroll', event => {
      if (divColorGrid.children.length <= 991 && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100)) {
        timeout = true
        setTimeout(() => {
          if (timeout === true) {
            for (let index = 0; index < 48; index++) {
              const divColor = this.colorPickerPage.createDivColor(Colors.random(), false, true)
              divColor.style.height = '400px'
              divColor.style.maxWidth = '400px'
              divColorGrid.appendChild(divColor)
            }
            timeout = false
          }
        }, 1000)
      }
    })

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 10)
  }
}

export { ExploreColorsPage }