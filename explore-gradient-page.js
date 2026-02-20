import { Colors } from './colors.js'
import { createH1 } from './text.js'

class ExploreGradientsPage {

  constructor(buttonNavigation, colorPickerPage) {
    this.buttonNavigation = buttonNavigation
    this.colorPickerPage = colorPickerPage
  }

  createPage() {
    localStorage.setItem('tool', 'exploreGradients')

    const divGradientGrid = document.createElement('div')
    divGradientGrid.className = 'color-grid'
    for (let index = 0; index < 48; index++) {
      const divColor = this.colorPickerPage.createDivGradient([Colors.random(), Colors.random()], true, true)
      divColor.style.height = '400px'
      divColor.style.maxWidth = '400px'
      divGradientGrid.appendChild(divColor)
    }

    const exploreGradientsColumn = document.createElement('div')
    exploreGradientsColumn.style.maxWidth = 'none'
    exploreGradientsColumn.className = 'inner-column'
    exploreGradientsColumn.appendChild(divGradientGrid)

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Explore Gradients'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(exploreGradientsColumn)

    var timeout = false
    window.addEventListener('scroll', event => {
      if (divGradientGrid.children.length <= 991 && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100)) {
        timeout = true
        setTimeout(() => {
          if (timeout === true) {
            for (let index = 0; index < 48; index++) {
              const divColor = this.colorPickerPage.createDivGradient([Colors.random(), Colors.random()], true, true)
              divColor.style.height = '400px'
              divColor.style.maxWidth = '400px'
              divGradientGrid.appendChild(divColor)
            }
            timeout = false
          }
        }, 1000)
      }
    })

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 10)
  }
}

export { ExploreGradientsPage }