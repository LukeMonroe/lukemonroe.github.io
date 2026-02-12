import { ColorPickerPage } from './color-picker-page.js'
import { Colors } from './colors.js'
import { createDivGradientIconHeart, isGradientLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createDivColorText } from './text.js'
import { createDivGradientIconFullscreen } from './fullscreen.js'

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

      const divGradient = this.createDivGradient(color, Colors.hue(color, 90), divColor01, divColor02)
      divGradient.style.display = 'flex'

      const divColorRow = this.createDivColorRowNew()
      divColorRow.style.flex = '1 1 0'
      divColorRow.appendChild(divColor01)
      divColorRow.appendChild(divColor02)
      divColorRow.appendChild(divGradient)
      divColorRow.addEventListener('mouseenter', () => {
        divColorRow.style.flex = 'auto'
      })
      divColorRow.addEventListener('mouseleave', () => {
        divColorRow.style.flex = '1 1 0'
        divColor01.style.display = 'none'
        divColor02.style.display = 'none'
        divGradient.style.display = 'flex'
      })
      divColorRow.addEventListener('click', () => {
        divColorRow.style.flex = 'auto'
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

  createDivGradientIconCheckmark(gradient) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(gradient[1], 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      this.updatePage(gradient[0])
    })

    return divColorIcon
  }

  createDivColorIconCornerTriangle(gradient, divColors, divGradient) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(gradient[0], 'corner-triangle')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'show colors')
    divColorIcon.addEventListener('click', () => {
      divColors[0].style.display = 'flex'
      divGradient.style.display = 'none'
      divColors[1].style.display = 'flex'
    })

    return divColorIcon
  }

  createDivGradient(color01, color02, divColor01, divColor02) {
    const divMarker = document.createElement('div')
    divMarker.className = 'marker'
    divMarker.style.backgroundColor = color01.formattedText

    const type = 'linear'
    const value = '180deg'
    const position = '0%'

    const likeGradient = createDivGradientIconHeart([color01, color02])
    const divGradient = document.createElement('div')
    divGradient.className = 'color'
    divGradient.style.backgroundColor = color01.formattedHex
    divGradient.style.color = color01.formattedText
    divGradient.style.background = `${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex})`
    divGradient.appendChild(createDivColorText(`${type}-gradient(${value}, ${color01.formattedHex} ${position}, ${color02.formattedHex})`))
    divGradient.appendChild(likeGradient)
    divGradient.appendChild(createDivGradientIconFullscreen([color01, color02], type, value, position))
    divGradient.appendChild(this.createDivGradientIconCheckmark([color01, color02]))
    divGradient.appendChild(this.createDivColorIconCornerTriangle([color01, color02], [divColor01, divColor02], divGradient))
    if (Colors.equal(color01, this.colorPicked)) {
      divGradient.appendChild(divMarker)
    }

    divGradient.style.flex = '1 1 0'
    divGradient.addEventListener('mouseenter', () => {
      const children = divGradient.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divGradient.style.flex = 'auto'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
      divMarker.style.display = 'none'
      likeGradient.style.backgroundImage = isGradientLiked([color01, color02]) ? getBackgroundImage(color01, 'heart-filled') : getBackgroundImage(color01, 'heart-empty')
    })
    divGradient.addEventListener('mouseleave', () => {
      const children = divGradient.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'none'
      }
      divGradient.style.flex = '1 1 0'
      divGradient.style.boxShadow = 'none'
      divMarker.style.display = 'block'
    })
    divGradient.addEventListener('click', () => {
      const children = divGradient.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divGradient.style.flex = 'auto'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
      divMarker.style.display = 'none'
      likeGradient.style.backgroundImage = isGradientLiked([color01, color02]) ? getBackgroundImage(color01, 'heart-filled') : getBackgroundImage(color01, 'heart-empty')
    })

    return divGradient
  }
}

export { GradientPickerPageNew }