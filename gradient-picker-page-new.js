import { ColorPickerPage } from './color-picker-page.js'
import { Colors } from './colors.js'
import { createDivGradientIconHeart, isGradientLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH3, createDivColorText } from './text.js'
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
    localStorage.setItem('tool', 'gradientPickerNew')

    const colors = this.getHistoryColors()
    if (colors.length === 0) {
      colors.push(Colors.random())
      this.setHistoryColors(colors)
    }
    this.colorPicked = colors[colors.length - 1]
    document.documentElement.style.setProperty('--thumb-color', this.colorPicked.formattedHex)

    const hueRow = this.createDivColorRow()
    const hueSliders = this.createInputRangeSliders(1, 90, 1, 'Separation', 12, 1, 360, 1, 'Degrees', 180, hueRow)

    const saturationRow = this.createDivColorRow()
    const saturationSlider = this.createInputRangeSlider(1, 20, 1, 'Separation', 8, saturationRow, "sat")

    const lightnessRow = this.createDivColorRow()
    const lightnessSlider = this.createInputRangeSlider(1, 20, 1, 'Separation', 8, lightnessRow, "lig")

    const divColorPicked = this.createDivGradient([this.colorPicked, Colors.hue(this.colorPicked, 45)], true)
    // divColorPicked.style.height = '400px'
    // divColorPicked.style.maxWidth = '800px'
    // Array.from(divColorPicked.children).forEach(child => { child.style.height = '400px' })

    const colorRow = document.createElement('div')
    colorRow.className = 'inner-row'
    colorRow.appendChild(divColorPicked)
    colorRow.appendChild(this.createDivInputColumn())

    const variationsColumn = document.createElement('div')
    variationsColumn.className = 'inner-column'
    variationsColumn.appendChild(createH2('Variations'))
    variationsColumn.appendChild(createH3('Hue'))
    hueSliders.forEach(hueSlider => {
      variationsColumn.appendChild(hueSlider)
    })
    variationsColumn.appendChild(hueRow)
    variationsColumn.appendChild(createH3('Saturation'))
    variationsColumn.appendChild(saturationSlider)
    variationsColumn.appendChild(saturationRow)
    variationsColumn.appendChild(createH3('Lightness'))
    variationsColumn.appendChild(lightnessSlider)
    variationsColumn.appendChild(lightnessRow)

    const harmoniesColumn = document.createElement('div')
    harmoniesColumn.className = 'inner-column'
    harmoniesColumn.appendChild(createH2('Harmonies'))
    harmoniesColumn.appendChild(createH3('Complementary'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.complementary(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Split Complementary'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.splitComplementary(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Analogous'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.analogous(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Triadic'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.triadic(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Tetradic'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.tetradic(this.colorPicked)))
    harmoniesColumn.appendChild(createH3('Square'))
    harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.square(this.colorPicked)))

    const palettesColumn = document.createElement('div')
    palettesColumn.className = 'inner-column'
    palettesColumn.appendChild(createH2('Palettes'))
    palettesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.paletteA(this.colorPicked)))

    const historyColumn = document.createElement('div')
    historyColumn.className = 'inner-column'
    historyColumn.appendChild(createH2('History'))
    historyColumn.appendChild(this.buildColorRow(this.createDivColorRow(), this.getHistoryColors()))

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Gradient Picker New'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(colorRow)
    outerColumn.appendChild(variationsColumn)
    outerColumn.appendChild(harmoniesColumn)
    outerColumn.appendChild(palettesColumn)
    outerColumn.appendChild(historyColumn)

    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 10)
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