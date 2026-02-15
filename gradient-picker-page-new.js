import { ColorPickerPage } from './color-picker-page.js'
import { Colors } from './colors.js'
import { createDivGradientIconHeart, isGradientLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createDivColorText } from './text.js'
import { createDivGradientIconFullscreenNew } from './fullscreen.js'

class GradientPickerPageNew extends ColorPickerPage {

  createDivColorRowNew() {
    const row = document.createElement('div')
    row.className = 'color-row-new'

    return row
  }

  buildColorRow(row, colors) {
    row.replaceChildren()
    colors.forEach(color => {
      row.appendChild(this.createDivGradient([color, Colors.hue(color, 45)], false))
    })

    return row
  }

  createPage() {
    super.createPage()
    localStorage.setItem('tool', 'gradientPickerNew')

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Gradient Picker New'))
  }

  createDivGradientIconCheckmark(colors) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(colors[1], 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      this.updatePage(colors[0])
    })

    return divColorIcon
  }

  createDivColorIconCornerTriangle(color, divGradient, divColors) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'corner-triangle')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.left = '10px'
    createDivTooltip(divColorIcon, 'show colors')
    divColorIcon.addEventListener('click', () => {
      divGradient.style.display = 'none'
      divColors.forEach(divColor => { divColor.style.display = 'flex' })
    })

    return divColorIcon
  }

  createDivGradient(colors, picked) {
    const divMarker = document.createElement('div')
    divMarker.className = 'marker'
    divMarker.style.backgroundColor = colors[0].formattedText

    const type = 'linear'
    const value = '180deg'
    const position = '0%'

    const divColors = colors.map(color => this.createDivColor(color, false))
    divColors.forEach(divColor => { divColor.style.display = 'none' })

    const likeGradient = createDivGradientIconHeart(colors)
    const divGradient = document.createElement('div')
    divGradient.className = 'color'
    divGradient.style.display = 'flex'
    divGradient.style.backgroundColor = colors[0].formattedHex
    divGradient.style.background = `${type}-gradient(${value}, ${colors.map((color, index) => `${color.formattedHex} ${Math.round((index / (colors.length - 1)) * 100)}%`).join(', ')})`
    divGradient.style.color = colors[0].formattedText
    divGradient.style.flex = '1 1 0'
    colors.forEach(color => { divGradient.appendChild(createDivColorText(color.formattedHex)) })
    divGradient.appendChild(likeGradient)
    divGradient.appendChild(createDivGradientIconFullscreenNew(colors, type, value, position))
    divGradient.appendChild(this.createDivGradientIconCheckmark(colors))
    divGradient.appendChild(this.createDivColorIconCornerTriangle(colors[0], divGradient, divColors))
    if (Colors.equal(colors[0], this.colorPicked)) {
      divGradient.appendChild(divMarker)
    }

    divGradient.addEventListener('mouseenter', () => {
      Array.from(divGradient.children).forEach(child => { child.style.display = 'block' })
      divGradient.style.flex = 'auto'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
      divMarker.style.display = 'none'
      likeGradient.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
    })
    divGradient.addEventListener('mouseleave', () => {
      Array.from(divGradient.children).forEach(child => { child.style.display = 'none' })
      divGradient.style.flex = '1 1 0'
      divGradient.style.boxShadow = 'none'
      divMarker.style.display = 'block'
    })
    divGradient.addEventListener('click', () => {
      Array.from(divGradient.children).forEach(child => { child.style.display = 'block' })
      divGradient.style.flex = 'auto'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
      divMarker.style.display = 'none'
      likeGradient.style.backgroundImage = isGradientLiked(colors) ? getBackgroundImage(colors[0], 'heart-filled') : getBackgroundImage(colors[0], 'heart-empty')
    })

    const divColorRowNew = this.createDivColorRowNew()
    divColorRowNew.style.flex = picked ? 'auto' : '1 1 0'
    divColorRowNew.appendChild(divGradient)
    divColors.forEach(divColor => { divColorRowNew.appendChild(divColor) })
    divColorRowNew.addEventListener('mouseenter', () => {
      divColorRowNew.style.flex = 'auto'
    })
    divColorRowNew.addEventListener('mouseleave', () => {
      divColorRowNew.style.flex = picked ? 'auto' : '1 1 0'
      divGradient.style.display = 'flex'
      divColors.forEach(divColor => { divColor.style.display = 'none' })
    })
    divColorRowNew.addEventListener('click', () => {
      divColorRowNew.style.flex = 'auto'
    })

    return divColorRowNew
  }
}

export { GradientPickerPageNew }