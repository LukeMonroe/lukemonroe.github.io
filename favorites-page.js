import { ColorPicker } from './color-picker.js'
import { createDivColorIconHeart, createDivGradientIconHeart, getLikedColors, isColorLiked, getLikedGradients } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH3, createDivColorText } from './text.js'
import { createDivColorIconFullscreen, createDivGradientIconFullscreen } from './fullscreen.js'
import { createButtonNavigation } from './navigation.js'

class FavoritesPage {
  buttonNavigation = createButtonNavigation()
  colorPicker = new ColorPicker()

  createDivColorRowSmall() {
    const row = document.createElement('div')
    row.className = 'color-row-small'

    return row
  }

  updatePage() {
    this.createPage()
  }

  createPage() {
    localStorage.setItem('tool', 'favorites')

    const favoriteColorsColumn = document.createElement('div')
    favoriteColorsColumn.style.maxWidth = 'none'
    favoriteColorsColumn.className = 'inner-column'
    favoriteColorsColumn.appendChild(createH2('Colors'))
    favoriteColorsColumn.appendChild(this.createDivColorGrid())

    const favoriteGradientsColumn = document.createElement('div')
    favoriteGradientsColumn.style.maxWidth = 'none'
    favoriteGradientsColumn.className = 'inner-column'
    favoriteGradientsColumn.appendChild(createH2('Gradients'))
    favoriteGradientsColumn.appendChild(this.createDivGradientGrid())

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(createButtonNavigation())
    header.appendChild(createH1('Favorites'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(favoriteColorsColumn)
    outerColumn.appendChild(favoriteGradientsColumn)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 10)
  }

  createDivColor(color) {
    const divMarker = document.createElement('div')
    divMarker.className = 'marker'
    divMarker.style.backgroundColor = color.formattedText

    const likeColor = createDivColorIconHeart(color)
    const divColor = document.createElement('div')
    divColor.className = 'color'
    divColor.style.backgroundColor = color.formattedHex
    divColor.style.color = color.formattedText
    divColor.appendChild(createDivColorText(color.formattedHex))
    divColor.appendChild(createDivColorText(color.formattedRGB))
    divColor.appendChild(createDivColorText(color.formattedHSL))
    divColor.appendChild(createDivColorText(color.formattedHSV))
    divColor.appendChild(createDivColorText(color.formattedCMYK))
    divColor.appendChild(createDivColorText(color.formattedCRWhite))
    divColor.appendChild(createDivColorText(color.formattedCRBlack))
    divColor.appendChild(likeColor)
    divColor.appendChild(createDivColorIconFullscreen(color))
    divColor.appendChild(this.colorPicker.createColorPickerIcon(color, (color) => { this.updatePage() }))
    divColor.appendChild(divMarker)

    divColor.addEventListener('mouseenter', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
      divMarker.style.display = 'none'
      likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
    })
    divColor.addEventListener('mouseleave', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'none'
      }
      divColor.style.boxShadow = 'none'
      divMarker.style.display = 'block'
    })
    divColor.addEventListener('click', () => {
      const children = divColor.children
      for (let index = 0; index < children.length; index++) {
        children[index].style.display = 'block'
      }
      divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
      divMarker.style.display = 'none'
      likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
    })

    return divColor
  }

  createDivGradient(gradient, divColors, type, value, position) {
    const divGradient = document.createElement('div')
    divGradient.className = 'color'
    divGradient.style.backgroundColor = gradient[0].formattedHex
    divGradient.style.color = gradient[0].formattedText
    divGradient.style.background = gradient[0].formattedHex
    divGradient.style.background = `${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
    divGradient.style.background = `-moz-${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`
    divGradient.style.background = `-webkit-${type}-gradient(${value}, ${gradient[0].formattedHex} ${position}, ${gradient[1].formattedHex}`

    const show = this.createDivColorIconCornerTriangle(gradient, divColors, divGradient)
    const openFullscreen = createDivGradientIconFullscreen(gradient, type, value, position)
    const likeGradient = createDivGradientIconHeart(gradient)

    divGradient.appendChild(show)
    divGradient.appendChild(openFullscreen)
    divGradient.appendChild(likeGradient)
    divGradient.addEventListener('mouseenter', () => {
      show.style.display = 'block'
      openFullscreen.style.display = 'block'
      likeGradient.style.display = 'block'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
    })
    divGradient.addEventListener('mouseleave', () => {
      show.style.display = 'none'
      openFullscreen.style.display = 'none'
      likeGradient.style.display = 'none'
      divGradient.style.boxShadow = 'none'
    })
    divGradient.addEventListener('click', () => {
      show.style.display = 'block'
      openFullscreen.style.display = 'block'
      likeGradient.style.display = 'block'
      divGradient.style.boxShadow = `2px 2px ${divGradient.style.color} inset, -2px -2px ${divGradient.style.color} inset`
    })

    return divGradient
  }

  createDivColorGrid() {
    const divColorGrid = document.createElement('div')
    divColorGrid.className = 'color-grid'

    const colors = getLikedColors()
    for (let index = 0; index < colors.length; index++) {
      const divColor = this.createDivColor(colors[index])
      divColor.style.flex = 'none'
      divColor.style.height = '400px'
      divColor.style.width = '100%'
      divColor.style.maxWidth = '400px'
      divColorGrid.appendChild(divColor)
    }
    if (colors.length === 0) {
      divColorGrid.appendChild(createH3('No favorites yet :('))
    }

    return divColorGrid
  }

  createDivGradientGrid() {
    const divGradientGrid = document.createElement('div')
    divGradientGrid.className = 'color-grid'

    const gradients = getLikedGradients()
    for (let index = 0; index < gradients.length; index++) {
      divGradientGrid.appendChild(this.buildGradientRow(gradients[index], 'linear', '0deg', '0%'))
    }
    if (gradients.length === 0) {
      divGradientGrid.appendChild(createH3('No favorites yet :('))
    }

    return divGradientGrid
  }

  buildGradientRow(gradient, type, value, position) {
    const divColor01 = this.createDivColor(gradient[0])
    const divColor02 = this.createDivColor(gradient[1])
    const divGradient = this.createDivGradient(gradient, [divColor01, divColor02], type, value, position)

    divColor01.style.height = '400px'
    divGradient.style.height = '400px'
    divColor02.style.height = '400px'

    divColor01.style.display = 'none'
    divGradient.style.display = 'flex'
    divColor02.style.display = 'none'

    const divGradientRow = this.createDivColorRowSmall()
    divGradientRow.style.flex = 'none'
    divGradientRow.style.width = '100%'
    divGradientRow.style.maxWidth = '400px'
    divGradientRow.replaceChildren()
    divGradientRow.appendChild(divColor01)
    divGradientRow.appendChild(divGradient)
    divGradientRow.appendChild(divColor02)
    divGradientRow.addEventListener('mouseleave', () => {
      divColor01.style.display = 'none'
      divGradient.style.display = 'flex'
      divColor02.style.display = 'none'
    })

    return divGradientRow
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
}

export { FavoritesPage }