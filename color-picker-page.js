import { Colors } from './colors.js'
import { createDivColorIconHeart, isColorLiked } from './favorites.js'
import { getBackgroundImage } from './images.js'
import { createDivTooltip } from './tooltips.js'
import { createH1, createH2, createH3, createH4, createDivColorText } from './text.js'
import { createDivColorIconFullscreen } from './fullscreen.js'

class ColorPickerPage {

  constructor(buttonNavigation, colorPicker, imagePicker) {
    this.buttonNavigation = buttonNavigation
    this.colorPicker = colorPicker
    this.imagePicker = imagePicker
    this.colorPicked = null
    this.hueSeparationSliderValue = 12
    this.hueDegreeSliderValue = 180
    this.saturationSliderValue = 8
    this.lightnessSliderValue = 8
    this.buttonToggleInputsText = 'Show'
    this.mediaQueryLayoutVertical = window.matchMedia('(max-width: 600px)')
  }

  createDivColorRow() {
    const row = document.createElement('div')
    row.className = 'color-row'

    return row
  }

  createDivColorRowSmall() {
    const row = document.createElement('div')
    row.className = 'color-row-small'

    return row
  }

  buildColorRow(row, colors) {
    row.replaceChildren()
    colors.forEach(color => {
      row.appendChild(this.createDivColor(color, false))
    })

    return row
  }

  createDivColorIconCheckmark(color) {
    const divColorIcon = document.createElement('div')
    divColorIcon.className = 'color-icon'
    divColorIcon.style.backgroundImage = getBackgroundImage(color, 'checkmark')
    divColorIcon.style.bottom = '10px'
    divColorIcon.style.right = '10px'
    createDivTooltip(divColorIcon, 'load')
    divColorIcon.addEventListener('click', () => {
      this.updatePage(color)
    })

    return divColorIcon
  }

  updatePage(color) {
    const colors = this.getHistoryColors()
    colors.push(color)
    this.setHistoryColors(colors)
    this.createPage()
  }

  createPage() {
    localStorage.setItem('tool', 'colorPicker')

    const colors = this.getHistoryColors()
    if (colors.length === 0) {
      colors.push(Colors.random())
      this.setHistoryColors(colors)
    }
    this.colorPicked = colors[colors.length - 1]
    document.documentElement.style.setProperty('--thumb-color', this.colorPicked.formattedHex)

    const hueArgs = () => { return [this.colorPicked, this.hueDegreeSliderValue, this.hueSeparationSliderValue] }
    const hueRow = this.createDivColorRow()
    const hueSeparationSlider = this.createInputRangeSlider('hueSeparationSliderValue', 'Separation', hueRow, Colors.hues, hueArgs, 1, 90, 1)
    const hueDegreeSlider = this.createInputRangeSlider('hueDegreeSliderValue', 'Degrees', hueRow, Colors.hues, hueArgs, 1, 360, 1)

    const saturationArgs = () => { return [this.colorPicked, this.saturationSliderValue] }
    const saturationRow = this.createDivColorRow()
    const saturationSlider = this.createInputRangeSlider('saturationSliderValue', 'Separation', saturationRow, Colors.saturations, saturationArgs, 1, 20, 1)

    const lightnessArgs = () => { return [this.colorPicked, this.lightnessSliderValue] }
    const lightnessRow = this.createDivColorRow()
    const lightnessSlider = this.createInputRangeSlider('lightnessSliderValue', 'Separation', lightnessRow, Colors.lightnesses, lightnessArgs, 1, 20, 1)

    const divColorPicked = this.createDivColor(this.colorPicked, true)
    divColorPicked.style.height = '400px'
    divColorPicked.style.maxWidth = '800px'

    const colorRow = document.createElement('div')
    colorRow.className = 'inner-row'
    colorRow.appendChild(divColorPicked)
    colorRow.appendChild(this.createDivInputColumn())

    const variationsColumn = document.createElement('div')
    variationsColumn.className = 'inner-column'
    variationsColumn.appendChild(createH2('Variations'))
    variationsColumn.appendChild(createH3('Hue'))
    variationsColumn.appendChild(hueSeparationSlider)
    variationsColumn.appendChild(hueDegreeSlider)
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
    for (let [colorHarmony, colorCallable] of [
      ['Complementary', Colors.complementary],
      ['Split Complementary', Colors.splitComplementary],
      ['Analogous', Colors.analogous],
      ['Triadic', Colors.triadic],
      ['Tetradic', Colors.tetradic],
      ['Square', Colors.square]
    ]) {
      harmoniesColumn.appendChild(createH3(colorHarmony))
      harmoniesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), colorCallable(this.colorPicked)))
    }

    const palettesColumn = document.createElement('div')
    palettesColumn.className = 'inner-column'
    palettesColumn.appendChild(createH2('Palettes'))
    palettesColumn.appendChild(this.buildColorRow(this.createDivColorRowSmall(), Colors.paletteA(this.colorPicked)))

    const historyColumn = document.createElement('div')
    historyColumn.className = 'inner-column'
    historyColumn.appendChild(createH2('History'))
    historyColumn.appendChild(this.buildColorRow(this.createDivColorRow(), colors))

    const header = document.getElementById('header')
    header.replaceChildren()
    header.appendChild(this.buttonNavigation)
    header.appendChild(createH1('Color Picker'))

    const outerColumn = document.getElementById('outer-column')
    outerColumn.replaceChildren()
    outerColumn.appendChild(colorRow)
    outerColumn.appendChild(variationsColumn)
    outerColumn.appendChild(harmoniesColumn)
    outerColumn.appendChild(palettesColumn)
    outerColumn.appendChild(historyColumn)

    setTimeout(() => { window.scrollTo({ top: 0, behavior: 'smooth' }) }, 10)
  }

  getHistoryColors() {
    const colors = []
    let index = 0
    while (localStorage.getItem(`historyColor${index}`) !== null) {
      colors.push(Colors.createHex(localStorage.getItem(`historyColor${index++}`)))
    }

    return colors
  }

  setHistoryColors(colors) {
    let pos = 0
    for (let index = (colors.length > 8 ? colors.length - 8 : 0); index < colors.length; index++) {
      localStorage.setItem(`historyColor${pos++}`, colors[index].formattedHex)
    }
    for (let index = (colors.length > 8 ? 8 : colors.length); index < 16; index++) {
      localStorage.removeItem(`historyColor${index}`)
    }
  }

  createDivColor(color, picked) {
    var divMarker = null
    const likeColor = createDivColorIconHeart(color)
    const divColor = document.createElement('div')
    divColor.className = 'color'
    divColor.style.flex = picked ? 'auto' : '1 1 0'
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
    divColor.appendChild(this.createDivColorIconCheckmark(color))
    divColor.appendChild(this.colorPicker.createColorPickerIcon(color, (color) => { this.updatePage(color) }))
    if (Colors.equal(color, this.colorPicked)) {
      divMarker = document.createElement('div')
      divMarker.className = 'marker'
      divMarker.style.backgroundColor = color.formattedText
      divColor.appendChild(divMarker)
    }

    const expandDivColor = expand => {
      if (expand) {
        Array.from(divColor.children).forEach(child => { child.style.display = 'block' })
        divColor.style.flex = 'auto'
        divColor.style.width = this.mediaQueryLayoutVertical.matches ? '100%' : '300px'
        divColor.style.boxShadow = `2px 2px ${divColor.style.color} inset, -2px -2px ${divColor.style.color} inset`
        if (divMarker !== null) { divMarker.style.display = 'none' }
        likeColor.style.backgroundImage = isColorLiked(color) ? getBackgroundImage(color, 'heart-filled') : getBackgroundImage(color, 'heart-empty')
      } else {
        Array.from(divColor.children).forEach(child => { child.style.display = 'none' })
        divColor.style.flex = picked ? 'auto' : '1 1 0'
        divColor.style.width = '100%'
        divColor.style.boxShadow = 'none'
        if (divMarker !== null) { divMarker.style.display = 'block' }
      }
    }
    divColor.addEventListener('mouseenter', event => { expandDivColor(true) })
    divColor.addEventListener('mouseleave', event => { expandDivColor(false) })
    divColor.addEventListener('click', event => { expandDivColor(true) })

    return divColor
  }

  createDivInputColumn() {
    const inputHex = (value, divInputBox) => {
      const color = Colors.createHex(divInputBox.value)
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const inputColor = (colorFormat, colorComponent, value, colorCallable, divInputBox) => {
      const colorComponents = []
      Object.keys(this.colorPicked[colorFormat]).forEach(key => {
        colorComponents.push(String(colorComponent === key ? divInputBox.value : this.colorPicked[colorFormat][key]))
      })
      const color = colorCallable(...colorComponents)
      color !== null && Colors.notEqual(color, this.colorPicked) ? this.updatePage(color) : divInputBox.value = String(value)
    }

    const divInputBox = document.createElement('input')
    divInputBox.className = 'box'
    divInputBox.type = 'text'
    divInputBox.maxLength = '7'
    divInputBox.style.width = '107px'
    divInputBox.value = this.colorPicked.formattedHex
    divInputBox.addEventListener('focusout', event => { inputHex(this.colorPicked.formattedHex, divInputBox) })
    divInputBox.addEventListener('keypress', event => { if (event.key === 'Enter') { inputHex(this.colorPicked.formattedHex, divInputBox) } })

    const buttonToggleInputs = document.createElement('button')
    buttonToggleInputs.className = 'theme'
    buttonToggleInputs.innerText = this.buttonToggleInputsText

    const hexBoxRow = document.createElement('div')
    hexBoxRow.className = 'input-row'
    hexBoxRow.appendChild(createH4('hex :'))
    hexBoxRow.appendChild(divInputBox)
    hexBoxRow.appendChild(buttonToggleInputs)

    const divInputRows = []
    const divInputColumn = document.createElement('div')
    divInputColumn.className = 'input-column'
    divInputColumn.appendChild(hexBoxRow)
    for (let [colorFormat, colorCallable] of [
      ['rgb', Colors.createRGB],
      ['hsl', Colors.createHSL],
      ['hsv', Colors.createHSV],
      ['cmyk', Colors.createCMYK]
    ]) {
      const divInputRow = document.createElement('div')
      divInputRow.className = 'input-row'
      divInputRow.style.display = this.buttonToggleInputsText === 'Show' ? 'none' : 'flex'
      divInputRow.appendChild(createH4(`${colorFormat.padEnd(4, ' ')}:`))
      Object.entries(this.colorPicked[colorFormat]).forEach(([colorComponent, value]) => {
        const divInputBox = document.createElement('input')
        divInputBox.className = 'box'
        divInputBox.type = 'text'
        divInputBox.maxLength = '3'
        divInputBox.style.width = '50px'
        divInputBox.value = String(Math.round(value))
        divInputBox.addEventListener('focusout', event => { inputColor(colorFormat, colorComponent, Math.round(value), colorCallable, divInputBox) })
        divInputBox.addEventListener('keypress', event => { if (event.key === 'Enter') { inputColor(colorFormat, colorComponent, Math.round(value), colorCallable, divInputBox) } })
        divInputRow.appendChild(divInputBox)
      })
      divInputColumn.appendChild(divInputRow)
      divInputRows.push(divInputRow)
    }
    divInputColumn.appendChild(this.colorPicker.createColorPickerButton(this.colorPicked, color => { this.updatePage(color) }))
    divInputColumn.appendChild(this.imagePicker.createImagePickerButton(this.colorPicked, color => { this.updatePage(color) }))

    buttonToggleInputs.addEventListener('click', event => {
      this.buttonToggleInputsText = this.buttonToggleInputsText === 'Show' ? 'Hide' : 'Show'
      buttonToggleInputs.innerText = this.buttonToggleInputsText
      divInputRows.forEach(divInputRow => { divInputRow.style.display = this.buttonToggleInputsText === 'Show' ? 'none' : 'flex' })
    })

    return divInputColumn
  }

  createInputRangeSlider(property, label, row, callable, callableArgs, min, max, step) {
    const h4Slider = createH4(`${label}: ${this[property]}`)

    const inputRangeSlider = document.createElement('input')
    inputRangeSlider.className = 'slider'
    inputRangeSlider.type = 'range'
    inputRangeSlider.min = min
    inputRangeSlider.max = max
    inputRangeSlider.step = step
    inputRangeSlider.value = this[property]
    inputRangeSlider.addEventListener('input', event => {
      this[property] = inputRangeSlider.value
      h4Slider.innerText = `${label}: ${this[property]}`
      this.buildColorRow(row, callable(...callableArgs()))
    })
    this.buildColorRow(row, callable(...callableArgs()))

    const divSlider = document.createElement('div')
    divSlider.className = 'slider'
    divSlider.appendChild(h4Slider)
    divSlider.appendChild(inputRangeSlider)

    return divSlider
  }
}

export { ColorPickerPage }